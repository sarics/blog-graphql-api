import cuid from 'cuid';
import bcrypt from 'bcryptjs';

const date = new Date().toISOString();

export const users = [
  {
    id: cuid(),
    name: 'Sári Csaba',
    email: 'sarics@example.com',
    password: 'Asdf1234',
    createdAt: date,
    updatedAt: date,
  },
  {
    id: cuid(),
    name: 'Teszt Elek',
    email: 'teszte@example.com',
    password: '4321fdsA',
    createdAt: date,
    updatedAt: date,
  },
  {
    id: cuid(),
    name: 'Teszt Béla',
    email: 'tesztb@example.com',
    password: '12345678',
    createdAt: date,
    updatedAt: date,
  },
  {
    id: cuid(),
    name: 'Teszt József',
    email: 'tesztj@example.com',
    password: '12345678',
    createdAt: date,
    updatedAt: date,
  },
];

export const seed = async knex => {
  await knex('Users').del();

  await knex('Users').insert(
    users.map(({ password, ...user }) => ({
      ...user,
      password: bcrypt.hashSync(password, 10),
    })),
  );
};
