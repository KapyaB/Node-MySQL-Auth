"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
*/
    return await [
      queryInterface.addColumn("users", "uuid", {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true
      }),
      queryInterface.addColumn("users", "username", {
        type: Sequelize.STRING,
        allowNull: false
      }),
      queryInterface.addColumn("users", "isActive", {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      })
    ];
  },

  down: async (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
