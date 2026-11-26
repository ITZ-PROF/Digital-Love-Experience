const apiUrl = process.env.NODE_ENV === 'production'
    ? '/api'
    : process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const environment = {
    env: process.env.NODE_ENV || 'production',

    api: {
        url: apiUrl,
    },

    version: '1.0.0'
}

export default environment