exports.up = knex => {
  return knex.schema.withSchema('deel').raw(
    `TRUNCATE TABLE deel.conversations, deel.conversation_content; 
  CREATE TYPE deel.conversation_user_types AS ENUM ('DEEL_ADMIN', 'DEEL_USER');
  ALTER TABLE deel.conversations ADD COLUMN user_ref INT NOT NULL, ADD COLUMN user_type deel.conversation_user_types NOT NULL ;`)
    .raw(`TRUNCATE TABLE deel.page_chunks,  deel.page_tsvs;`)
    .raw(`CREATE OR REPLACE FUNCTION public.dot_product(vector1 numeric[], vector2 numeric[])
    RETURNS numeric
    LANGUAGE sql
    IMMUTABLE PARALLEL SAFE
   AS $function$
       SELECT sum(mul) FROM (SELECT v1e*v2e as mul FROM unnest(vector1, vector2) AS t(v1e,v2e)) AS denominator;
   $function$
   `)
}

exports.down = knex => { }
