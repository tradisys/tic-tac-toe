module.exports = ({file, options, env}) => ({
    // eslint-disable-line no-unused-vars
    parser: false,
    // parser: file.extname === '.sss' ? 'sugarss' : false,

    plugins: {
        // 'postcss-import': { root: file.dirname },
        // 'postcss-cssnext': options.cssnext ? options.cssnext : false,
        autoprefixer: {
            add: true,
            browsers: ['Chrome 20', 'Safari 5', 'Edge 12', 'Explorer 8', 'Firefox 15']
        }
    }
});
