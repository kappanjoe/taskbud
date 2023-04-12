/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {

  await knex('users').del()
  await knex('users').insert([
    {username: 'franklin', buddy_code: 'blue dog tango'},
    {username: 'Em0xxK1D', buddy_code: 'wiley cat samba'},
    {username: 'not_a_robot', buddy_code: 'silly hamster ox'},
    {username: 'LouiseBurger', buddy_code: 'cute bird friend'},
    {username: 'fakeUserx5050', buddy_code: 'red lizard hugs'}
  ]);
  
  await knex('pairs').del()
  await knex('pairs').insert([
    {user_id_A: 11, user_id_B: 12},
    {user_id_A: 13, user_id_B: 14}
  ]);
  
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
