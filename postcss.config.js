/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
module.exports = {
    plugins: [
        require('precss'),
        require('autoprefixer'),
        require('cssnano')({
            preset: ['default', { discardComments: { removeAll: true } }],
        }),
    ],
};
