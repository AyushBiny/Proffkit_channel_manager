// Expo Monorepo Metro Configuration
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

module.exports = {
  watchFolders: [workspaceRoot],
  resolver: {
    nodeModulesPaths: [
      path.resolve(projectRoot, 'node_modules'),
      path.resolve(workspaceRoot, 'node_modules'),
    ],
    extraNodeModules: {
      '@proffkit/db-types': path.resolve(workspaceRoot, 'packages/db-types/src'),
      '@proffkit/business-logic': path.resolve(workspaceRoot, 'packages/business-logic/src'),
      '@proffkit/shared-ui': path.resolve(workspaceRoot, 'packages/shared-ui/src'),
    },
  },
};

