exports.up = function up(knex, Promise) {
  return knex.schema.createTable('CommentsToUsers', table => {
    table
      .string('CommentId', 25)
      .notNullable()
      .references('Comments.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table
      .string('UserId', 25)
      .notNullable()
      .references('Users.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table.primary(['CommentId', 'UserId']);
  });
};

exports.down = function down(knex, Promise) {
  return knex.schema.dropTable('CommentsToUsers');
};
