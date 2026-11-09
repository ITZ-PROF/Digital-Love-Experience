export default {
    env: process.env.NODE_ENV || 'development',

    api: {
        url: process.env.API_URL || 'http://localhost:3000',
    },

    version: '1.0.0'
}