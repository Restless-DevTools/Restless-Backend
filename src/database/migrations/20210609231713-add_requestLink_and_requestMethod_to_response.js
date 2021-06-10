module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'response', 'link', { type: Sequelize.STRING },
    );
    await queryInterface.addColumn(
      'response', 'method', { type: Sequelize.STRING },
    );
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn(
      'response', 'link',
    );
    await queryInterface.removeColumn(
      'response', 'method',
    );
  },
};
