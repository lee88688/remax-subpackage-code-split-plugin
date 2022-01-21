const path = require('path');
const DependencyResolvePlugin = require('./dependencyResolvePlugin');

module.exports = (options) => {
  return {
    configWebpack({ config }) {
      let map = null;
      config
        .plugin('DependencyResolvePlugin')
        .use(DependencyResolvePlugin, [options.subpackages, m => map = m]);

      const extArr = new Set(['.js', '.jsx', '.ts', '.tsx']);
      const preSplitChunks = config.optimization.get('splitChunks');
      preSplitChunks.cacheGroups.remaxStyles.enforce = true;
      const subpackages = options.subpackages || [];
      const cacheGroups = subpackages.reduce((acc, cur) => ({
        ...acc,
        [cur]: {
          priority: 10,
          minChunks: 2,
          minSize: 0,
          test(module, chunks) {
            const isCode = () => {
              let fileExt = path.extname(module.resource);
              fileExt = fileExt.split('?')[0]; // remove query
              return !fileExt || extArr.has(fileExt);
            }
            if (module.resource && isCode() && map && map.get(cur).has(module)) {
              return true
            }
            return false
          },
          filename: `${cur}/vendors.js`,
          chunks: 'all',
          name: `${cur}`
        }
      }), {});
      config.optimization.splitChunks({
        cacheGroups: {
          ...preSplitChunks.cacheGroups,
          ...cacheGroups,
        }
      });
    }
  };
};