module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'collection', 'description', { type: Sequelize.STRING },
    );
    await queryInterface.addColumn(
      'collection', 'user_id', { type: Sequelize.INTEGER },
    );
    await queryInterface.addConstraint(
      'collection',
      {
        type: 'foreign key',
        fields: ['user_id'],
        name: 'user_id_fkey',
        references: {
          table: 'user',
          field: 'id',
        },
      },
    );
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn(
      'collection', 'description',
    );
    await queryInterface.removeColumn(
      'collection', 'user_id',
    );
  },
};
