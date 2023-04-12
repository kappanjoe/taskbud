/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  await knex('users').insert([
    {username: 'franklin', buddy_code: 'blue dog tango'},
    {username: 'Em0xxK1D', buddy_code: 'wiley cat samba'},
    {username: 'not_a_robot', buddy_code: 'silly hamster ox'},
    {username: 'LouiseBurger', buddy_code: 'cute bird friend'},
    {username: 'fakeUserx5050', buddy_code: 'red lizard hugs'}
  ]);
};
