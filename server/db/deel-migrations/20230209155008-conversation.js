exports.up = async (knex) => {
  await knex.raw('CREATE SCHEMA deel')

  return knex.schema.withSchema('deel')
    .createTable('conversation', table => {
      table.increments('id').primary()
      table.string('question').notNullable()
      table.string('answer').notNullable()
      table.json('metadata')
      table.text('score')
      table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now())
    })
}

exports.down = knex => { }
