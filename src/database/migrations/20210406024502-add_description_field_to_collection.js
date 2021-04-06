module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'collection', 'description', { type: Sequelize.STRING },
    );
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn(
      'collection', 'description',
    );
  },
};
