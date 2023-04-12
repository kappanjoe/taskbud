/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('pairs').del()
  await knex('pairs').insert([ // Currently references ids of rows that may or may not exist
    {user_id_A: 6, user_id_B: 7},
    {user_id_A: 8, user_id_B: 9}
  ]);
};
