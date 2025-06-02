module.exports = {
  resolve: {
    modules: ['node_modules', 'app'],
    alias: {
      '@eslint/compat': require.resolve('@eslint/compat'),
    },
    extensions: ['.js', '.jsx', '.react.js', '.mjs'],
    mainFields: ['browser', 'jsnext:main', 'main'],
    fallback: {
      fs: false,
      child_process: false,
      process: require.resolve('process/browser'),
    },
  },
};