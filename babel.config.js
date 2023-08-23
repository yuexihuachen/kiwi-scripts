module.exports = {
  presets: [
    '@babel/preset-typescript', // ts to js
    ['@babel/preset-env', { targets: { node: '8' } }], // latest js syntax change es5 
    '@babel/preset-react', // latest react js syntax change es5
  ],
  plugins: [
    'babel-plugin-macros', // 在代码中显式声明需要在编译时需要做的事情
    '@babel/plugin-proposal-export-namespace-from', // export * as ns from "mod";
    '@babel/plugin-transform-numeric-separator',
    '@babel/plugin-proposal-object-rest-spread',// var {...y } =  {a:1}
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-syntax-optional-catch-binding',
    '@babel/plugin-transform-optional-chaining',
    '@babel/plugin-proposal-throw-expressions',
  ],
}
