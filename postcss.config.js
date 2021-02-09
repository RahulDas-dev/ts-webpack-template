if (process.env.NODE_ENV === 'Production'){
    module.exports = {
        plugins: [
            require('postcss-preset-env')({browsers: 'last 2 versions'}),
            require('autoprefixer')
        ],
    }
} else {
    module.exports = {
        plugins: [
            require('postcss-preset-env')({browsers: 'last 2 versions'}),
            //require('autoprefixer')
        ],
    }
}

