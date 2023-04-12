/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("pairs", (table) => {
    table.integer("user_id_A")
      .unsigned()
      .references("users.id");
      
    table.integer("user_id_B")
      .unsigned()
      .references("users.id");
      
    table.primary(["user_id_A", "user_id_B"]);
    
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
  return knex.schema.dropTable("pairs");
};
