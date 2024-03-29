module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'team', 'description', { type: Sequelize.STRING },
    );
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn(
      'team', 'description',
    );
  },
};
