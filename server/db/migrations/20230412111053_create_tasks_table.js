/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("tasks", (table) => {
    table.increments("id").primary();
    
    table.integer("owner_id")
      .unsigned()
      .notNullable()
      .references("users.id")
      .index();
      
    table.text("body")
      .notNullable();
      
    table.text("memo");
    
    table.boolean("is_completed")
      .notNullable()
      .defaultTo(false);
      
    table.date("due_on");
    
    table.date("start_on");
      
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
  return knex.schema.dropTable("tasks");
};
