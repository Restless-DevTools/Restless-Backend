module.exports = {
  apps: [{
    name: 'restless-backend',
    script: 'dist',
    instances: 0, // 0 is equal to max, automatically set 1 instace for core
    autorestart: true,
    watch: false,
    max_memory_restart: '4G',
    // node_args: '--max-old-space-size=4096',
  }],

  deploy: {
    production: {
      user: 'ec2-user',
      host: '',
      ref: 'origin/master',
      repo: 'git@github.com:Felipedelima123/Restless-Backend.git',
      path: '/home/restless',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
    },
  },
};
