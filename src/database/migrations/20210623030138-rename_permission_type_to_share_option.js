module.exports = {
  up: (queryInterface) => queryInterface.renameColumn(
    'collection', 'permission_type', 'share_option',
  ),
  down: (queryInterface) => queryInterface.renameColumn(
    'collection', 'share_option', 'permission_type',
  ),
};
