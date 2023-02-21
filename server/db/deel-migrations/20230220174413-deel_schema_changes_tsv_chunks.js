exports.up = knex => {
  return knex.schema.withSchema('deel')
    .dropTable('page_chunks')
    .createTable('page_chunks', table => {
      table.integer('page_id').references('id').inTable('public.pages').onDelete('CASCADE')
      table.integer('ordinal').notNullable()
      table.string('text').notNullable()
      table.integer('tokens').notNullable()
      table.specificType('text_embedding_ada_002', 'decimal[]').notNullable()
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
      table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now())
      table.unique(['page_id', 'ordinal'])
    })

    .dropTable('page_tsvs')
    .createTable('page_tsvs', table => {
      table.integer('page_id').references('id').inTable('public.pages').onDelete('CASCADE').primary()
      table.specificType('tsv', 'tsvector').index(null, 'GIN')
    })
}

exports.down = knex => { }
