import { gql } from 'apollo-server';
import { Model } from 'objection';

import createClient from './__utils__/createClient';
import { runSeeds, users } from './__seeds__';

const GET_ME = gql`
  query Me {
    me {
      id
      name
      email
      createdAt
      updatedAt
    }
  }
`;

const GET_USERS = gql`
  query Users(
    $search: String
    $first: Int
    $skip: Int
    $after: ID
    $orderBy: UsersOrderByInput
  ) {
    users(
      search: $search
      first: $first
      skip: $skip
      after: $after
      orderBy: $orderBy
    ) {
      id
      name
      email
      createdAt
      updatedAt
    }
  }
`;

const GET_USER = gql`
  query User($id: ID!) {
    user(id: $id) {
      id
      name
      email
      createdAt
      updatedAt
    }
  }
`;

let knex;

beforeAll(() => {
  knex = Model.knex();
});

beforeEach(async () => {
  await runSeeds(knex);
});

afterAll(() => {
  knex.destroy();
});

describe('me query', () => {
  test('should return authenticated user', async () => {
    const authUser = users[1];
    const client = createClient(authUser);

    const expectedUser = {
      ...authUser,
      password: undefined,
    };

    const res = await client.query({ query: GET_ME });

    expect(res.data.me).toEqual(expectedUser);
    expect(res.errors).toBeUndefined();
  });

  test('should return error when authenticated user not found', async () => {
    const client = createClient();

    const res = await client.query({ query: GET_ME });

    expect(res.data).toBeNull();
    expect(res.errors).toHaveLength(1);
    expect(res.errors[0].extensions).toMatchSnapshot();
  });
});

describe('users query', () => {
  test('should return all users without auth user', async () => {
    const client = createClient();

    const expectedUsers = users.map(({ email, password, ...user }) => ({
      ...user,
      email: null,
    }));

    const res = await client.query({ query: GET_USERS });

    expect(res.data.users).toEqual(expectedUsers);
    expect(res.errors).toBeUndefined();
    expect(res.extensions.total).toBe(expectedUsers.length);
  });

  test('should return all users with auth user', async () => {
    const authUser = users[0];
    const client = createClient(authUser);

    const expectedUsers = users.map(({ email, password, ...user }) => ({
      ...user,
      email: user.id === authUser.id ? authUser.email : null,
    }));

    const res = await client.query({ query: GET_USERS });

    expect(res.data.users).toEqual(expectedUsers);
    expect(res.errors).toBeUndefined();
    expect(res.extensions.total).toBe(expectedUsers.length);
  });
});

describe('user query', () => {
  test('should return user for id', async () => {
    const user = users[0];
    const client = createClient();
    const variables = { id: user.id };

    const expectedUser = {
      ...user,
      email: null,
      password: undefined,
    };

    const res = await client.query({
      query: GET_USER,
      variables,
    });

    expect(res.data.user).toEqual(expectedUser);
    expect(res.errors).toBeUndefined();
  });

  test('should return error when user not found', async () => {
    const client = createClient();
    const variables = { id: 'notexistingid' };

    const res = await client.query({
      query: GET_USER,
      variables,
    });

    expect(res.data).toBeNull();
    expect(res.errors).toHaveLength(1);
    expect(res.errors[0].extensions).toMatchSnapshot();
  });
});
