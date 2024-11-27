module.exports = {
    module: {
        rules: [
            {
                test: /\.(ttf|otf|woff|woff2)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'assets/fonts/[name].[hash].[ext]',
                        },
                    },
                ],
            },
        ],
    },
};
