/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    
    table.uuid("uuid")
      .defaultTo(knex.raw('gen_random_uuid()'))
      .unique()
      .notNullable()
      .index();
      
    table.string("username", 32)
      .unique()
      .notNullable()
      .index();
      
    table.string("buddy_code", 16)
      .unique()
      .notNullable()
      .index();
      
    table.timestamp("created_at")
      .defaultTo(knex.fn.now())
      .notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable("users");
};
