module.exports = {
  apps: [{
    name: 'eventable',
    cwd: '/srv/projects/eventable/APP',
    script: 'npm',
    args: 'run build && npm run preview',
    instances: 1,
    exec_mode: 'fork',
    watch: false,
    ignore_watch: ['node_modules', 'dist'],
    env: {
      NODE_ENV: 'production',
      VITE_HOST: 'localhost',
      PORT: 4173
    }
  }]
};
