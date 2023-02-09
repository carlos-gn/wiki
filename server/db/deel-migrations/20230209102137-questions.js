exports.up = knex => {
  return knex.schema
    .createTable('questions', table => {
      table.increments('id').primary()
      table.string('text').notNullable()
      table.text('score').notNullable()
    })
}

exports.down = knex => { }
