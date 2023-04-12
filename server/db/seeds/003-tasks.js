/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('tasks').del()
  await knex('tasks').insert([
    {owner_id: 11, body: 'Do laundry'},
    {owner_id: 11, body: 'Shave head', is_completed: true},
    {owner_id: 11, body: 'Write memoir'},
    {owner_id: 12, body: 'Make tabbouleh', is_completed: true},
    {owner_id: 12, body: 'Spill tea', is_completed: true},
    {owner_id: 12, body: 'Learn Finnish', is_completed: true},
    {owner_id: 13, body: 'Wake up'},
    {owner_id: 13, body: 'Get out of bed'},
    {owner_id: 13, body: 'Make bed'},
    {owner_id: 13, body: 'Brush teeth', is_completed: true},
    {owner_id: 14, body: 'Call Mom'},
    {owner_id: 14, body: 'Dig six-foot hole in backyard'},
    {owner_id: 14, body: 'Go to gym'},
    {owner_id: 14, body: 'Order new Tesla'},
    {owner_id: 14, body: 'Return old Tesla'}
  ]);
};
