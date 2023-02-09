exports.up = async (knex) => {
  await knex.raw('CREATE SCHEMA deel')

  return knex.schema.withSchema('deel')
    .createTable('conversations', table => {
      table.increments('id').primary()
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    })
}

exports.down = knex => { }
