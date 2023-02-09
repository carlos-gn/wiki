exports.up = async (knex) => {
  await knex.raw('CREATE SCHEMA deel')

  return knex.schema.withSchema('deel')
    .createTable('conversations', table => {
      table.increments('id').primary()
      table.string('question').notNullable()
      table.string('answer').notNullable()
      table.jsonb('metadata')
      table.integer('score')
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    })
}

exports.down = knex => { }
