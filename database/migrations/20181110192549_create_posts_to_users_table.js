exports.up = function up(knex, Promise) {
  return knex.schema.createTable('PostsToUsers', table => {
    table
      .string('PostId', 25)
      .notNullable()
      .references('Posts.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table
      .string('UserId', 25)
      .notNullable()
      .references('Users.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table.primary(['PostId', 'UserId']);
  });
};

exports.down = function down(knex, Promise) {
  return knex.schema.dropTable('PostsToUsers');
};
