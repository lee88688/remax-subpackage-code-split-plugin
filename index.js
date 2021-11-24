const DependencyResolvePlugin = require('./dependencyResolvePlugin');

module.exports = (options) => {
  return {
    configWebpack({ config }) {
      let map = null;
      config
        .plugin('DependencyResolvePlugin')
        .use(DependencyResolvePlugin, [options.subpackages, m => map = m]);

      const preSplitChunks = config.optimization.get('splitChunks');
      const subpackages = options.subpackages || [];
      const cacheGroups = subpackages.reduce((acc, cur) => ({
        ...acc,
        [cur]: {
          priority: 10,
          minChunks: 2,
          minSize: 0,
          test(module, chunks) {
            if (module.resource && map && map.get(cur).has(module)) {
              return true
            }
            return false
          },
          filename: `${cur}/vendors.js`,
          chunks: 'all'
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