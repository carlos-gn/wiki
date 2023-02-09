exports.up = async (knex) => {
  return knex.schema.withSchema('deel')
    .createTable('conversation_content', table => {
      table.increments('id').primary()
      table.integer('conversation_id').references('id').inTable('deel.conversations')
      table.string('question').notNullable()
      table.string('answer').notNullable()
      table.jsonb('metadata')
      table.integer('score')
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    })
}

exports.down = knex => { }
