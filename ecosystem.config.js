// Tools Program - Port 3002 (adjust as needed)
module.exports = {
  apps: [{
    name: 'trustme-tools',
    script: 'node_modules/next/dist/bin/next', // Change to your main file name
    cwd: '/var/www/trustme', 
    instances: 1,
    exec_mode: 'fork',
    watch: false,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production',
      PORT: 3000  // Change if needed
    },
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s'
  }]
}