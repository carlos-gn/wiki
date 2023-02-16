exports.up = async (knex) => {
  return knex.schema.withSchema('deel')
    .alterTable('conversation_content', table => {
      table.string('question', 2000).notNullable().alter()
      table.string('answer', 2000).notNullable().alter()
      table.string('feedback', 2000).alter()
    })
}

exports.down = knex => { }
