module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'collection', 'shared_permissions', { type: Sequelize.STRING },
    );
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn(
      'collection', 'shared_permissions',
    );
  },
};
