exports.up = function(knex, Promise) {
  return knex.schema.createTable('Users', table => {
    table.string('id', 25).primary();
    table.string('name').notNullable();
    table
      .string('email')
      .notNullable()
      .unique();
    table.string('password').notNullable();
    table.timestamp('createdAt').notNullable();
    table.timestamp('updatedAt').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('Users');
};
