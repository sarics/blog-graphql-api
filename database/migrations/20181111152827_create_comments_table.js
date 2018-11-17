exports.up = function up(knex, Promise) {
  return knex.schema.createTable('Comments', table => {
    table.string('id', 25).primary();
    table.string('text').notNullable();
    table.timestamp('createdAt').notNullable();
    table.timestamp('updatedAt').notNullable();
  });
};

exports.down = function down(knex, Promise) {
  return knex.schema.dropTable('Comments');
};
