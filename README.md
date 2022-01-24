# remax-subpackage-code-split-plugin

插件主要解决小程序分包的时候子包只在子包内的引入的代码不要合并到主包中。很多时候只有子包引入的代码合并到主包中导致主包体积过大，此时如果不拆分代码到子包中没办法发布小程序。

## 安装

`npm install @monsterlee/remax-subpackage-code-split-plugin` or `yarn add @monsterlee/remax-subpackage-code-split-plugin`

## 使用

```js
const prerenderPlugin = require('@monsterlee/remax-subpackage-code-split-plugin');

module.exports = {
  plugins: [prerenderPlugin({
    subpackages: [
      'packageA' // 在app.config中配置的子页面的名称
    ]
  })]
};
```

## 配置

- subpackages，需要配置的子页面名称

## 存在的问题

remax当前依赖的`mini-css-extract-plugin`版本会触发[bug](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/341)，因为`remax-cli`依赖的版本 0.x 没办法解决，该问题到 1.3之后好像才解决了（没有验证）。这个插件的解决方案是通过给splitplugin的`remaxStyles`添加`enforce = true`解决的。

## LICENSE

MIT
