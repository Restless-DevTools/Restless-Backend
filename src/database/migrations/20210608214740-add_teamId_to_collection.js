module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'collection', 'team_id', { type: Sequelize.INTEGER },
    );
    await queryInterface.addConstraint(
      'collection',
      {
        type: 'foreign key',
        fields: ['team_id'],
        name: 'team_id_fkey',
        references: {
          table: 'team',
          field: 'id',
        },
        onDelete: 'set null',
        onUpdate: 'cascade',
      },
    );
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn(
      'collection', 'team_id',
    );
  },
};
