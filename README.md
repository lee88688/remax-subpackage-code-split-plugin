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

## LICENSE

[MIT](LICENSE)