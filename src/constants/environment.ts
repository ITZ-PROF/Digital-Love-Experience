const apiUrl = process.env.REACT_APP_API_BASE_URL
    || (process.env.NODE_ENV !== 'production' ? 'http://localhost:5000' : undefined);

if (!apiUrl) {
    throw new Error('REACT_APP_API_BASE_URL must be configured outside development.');
}

const environment = {
    env: process.env.NODE_ENV || 'development',

    api: {
        url: apiUrl,
    },

    version: '1.0.0'
}

export default environment