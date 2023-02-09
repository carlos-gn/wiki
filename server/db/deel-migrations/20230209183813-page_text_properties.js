exports.up = async (knex) => {
  return knex.schema.withSchema('deel')
    .createTable('page_text_properties', table => {
      table.integer('page_id').primary().references('id').inTable('public.pages')
      table.decimal('text_embedding_ada_002', 31, 30).notNullable()
      table.integer('tokens').notNullable()
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
      table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now())
    })
}

exports.down = knex => { }
