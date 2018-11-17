exports.up = function up(knex, Promise) {
  return knex.schema.createTable('Posts', table => {
    table.string('id', 25).primary();
    table.string('title').notNullable();
    table.text('body').notNullable();
    table.boolean('published').notNullable();
    table.timestamp('createdAt').notNullable();
    table.timestamp('updatedAt').notNullable();
  });
};

exports.down = function down(knex, Promise) {
  return knex.schema.dropTable('Posts');
};
