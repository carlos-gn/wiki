exports.up = knex => {
  return knex.schema
    .createTable('conversation', table => {
      table.increments('id').primary()
      table.string('questions').notNullable()
      table.string('answer').notNullable()
      table.text('score')
    })
}

exports.down = knex => { }
