module.exports = {
  apps: [{
    name: 'restless-backend',
    script: 'dist/server.js',
    instances: 0,
    autorestart: true,
    watch: false,
    max_memory_restart: '4G',
    envs: {
      DATABASE_DIALECT: 'postgres',
      DATABASE_HOST: 'localhost',
      DATABASE_PORT: 5432,
      DATABASE_USER: 'user',
      DATABASE_PASSWORD: 'password',
      DATABASE_NAME: 'restless',
      NODE_ENV: 'production',
      DEBUG: false,
      JWT_KEY: 'secret key',
      JWT_EXPIRATION_TIME: '1d',
      SMTP_FROM: 'youremail@restless.com',
      SMTP_HOST: 'localhost',
      SMTP_USER: '',
      SMTP_PASS: '',
      SMTP_PORT: 587,
      GITHUB_CLIENT_ID: '',
      GITHUB_CLIENT_SECRET: '',
      GITHUB_REDIRECT_URI: '',
      GITHUB_ACCESS_TOKEN_API: '',
      GITHUB_USER_API: '',
    },
  }],
};
