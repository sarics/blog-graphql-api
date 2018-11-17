exports.up = function up(knex, Promise) {
  return knex.schema.createTable('CommentsToPosts', table => {
    table
      .string('CommentId', 25)
      .notNullable()
      .references('Comments.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table
      .string('PostId', 25)
      .notNullable()
      .references('Posts.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table.primary(['CommentId', 'PostId']);
  });
};

exports.down = function down(knex, Promise) {
  return knex.schema.dropTable('CommentsToPosts');
};
