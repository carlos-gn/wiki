exports.up = knex => {
  return knex.schema.withSchema('deel')
  // Renaming page_text_properties to page_chunks and adding chunk_id and text columns
    .dropTable('page_text_properties')
    .createTable('page_chunks', table => {
      table.integer('chunk_id').primary()
      table.integer('page_id').references('id').inTable('public.pages')
      table.string('text').notNullable()
      table.integer('tokens').notNullable()
      table.decimal('text_embedding_ada_002', 31, 30).notNullable()
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
      table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now())
    })

    // conversation_content table - adding feedback_type and feedback columns
    .alterTable('conversation_content', table => {
      table.string('feedback_type', 24)
      table.string('feedback')
    })
}

exports.down = knex => { }
