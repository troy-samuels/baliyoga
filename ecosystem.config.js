module.exports = {
  apps: [
    {
      name: 'baliyoga',
      script: 'npm',
      args: 'start',
      cwd: '/root/baliyoga',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
}
