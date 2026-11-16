export default {
    env: process.env.NODE_ENV || 'development',

    api: {
        url: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000',
    },

    version: '1.0.0'
}