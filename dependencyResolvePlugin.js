module.exports = class DependencyResolvePlugin {
  constructor(subpackages, cb) {
    this.subpackages = subpackages;
    this.cb = cb;
  }

  apply(compiler) {
    compiler.hooks.thisCompilation.tap('DependencyResolvePlugin', (compilation) => {
      compilation.hooks.optimizeChunksAdvanced.tap('DependencyResolvePlugin', (chunks) => {
        const map = new Map();
        this.subpackages.forEach(p => {
          map.set(p, new Set());
        });
        for (const pkg of this.subpackages) {
          const packageModules = [...compilation.entrypoints]
            .filter(([name, _]) => name.includes(pkg))
            .flatMap(([_, entrypoint]) => [...entrypoint._moduleIndices])
            .map(([module]) => module)
          const otherModules = [...compilation.entrypoints]
            .filter(([name, _]) => !name.includes(pkg))
            .flatMap(([_, entrypoint]) => [...entrypoint._moduleIndices])
            .map(([module]) => module)

          const packageModulesSet = new Set(packageModules);
          const otherModulesSet = new Set(otherModules);

          const allSet = new Set([...packageModulesSet, ...otherModulesSet]);
          for (const module of allSet) {
            if (packageModulesSet.has(module) && !otherModulesSet.has(module)) {
              map.get(pkg).add(module);
            }
          }
        }
        if (typeof this.cb === 'function') {
          this.cb(map);
        }
      })
    })
  }
}