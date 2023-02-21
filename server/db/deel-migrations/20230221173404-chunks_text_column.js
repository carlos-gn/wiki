exports.up = async (knex) => {
  return knex.schema.withSchema('deel')
    .alterTable('page_chunks', table => {
      table.specificType('text', 'text').notNullable().alter()
    })
}

exports.down = knex => { }
