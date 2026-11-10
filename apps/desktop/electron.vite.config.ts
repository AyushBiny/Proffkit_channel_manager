import { resolve } from 'path';

export default {
  main: {
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/main/index.ts')
        }
      }
    }
  },
  preload: {
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/preload/index.ts')
        }
      }
    }
  },
  renderer: {
    resolve: {
      alias: {
        '@proffkit/db-types': resolve(__dirname, '../../packages/db-types/src/index.ts'),
        '@proffkit/business-logic': resolve(__dirname, '../../packages/business-logic/src/index.ts'),
        '@proffkit/shared-ui': resolve(__dirname, '../../packages/shared-ui/src/index.tsx')
      }
    }
  }
};

