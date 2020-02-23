module.exports = {
  apps: [{
    name: 'restless-backend',
    script: 'dist/server.js',
    instances: 0, // 0 is equal to max, automatically set 1 instace for core
    autorestart: true,
    watch: false,
    max_memory_restart: '4G',
    // node_args: '--max-old-space-size=4096',
  }],
};
