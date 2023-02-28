exports.up = async knex => {
  const hasColumn = await knex.schema
    .withSchema("deel")
    .hasColumn("conversation_content", "reviewed");

  if (hasColumn) {
    return;
  }

  return knex.schema
    .withSchema("deel")
    .alterTable("conversation_content", table => {
      table.boolean("reviewed").defaultTo(false);
    });
};

exports.down = async knex => {
  const hasColumn = await knex.schema
    .withSchema("deel")
    .hasColumn("conversation_content", "reviewed");

  if (hasColumn) {
    return knex.schema
      .withSchema("deel")
      .table("conversation_content", table => {
        table.dropColumn("reviewed");
      });
  }
};
