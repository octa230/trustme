module.exports = {
  apps: [{
    name: 'trustme-client',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    cwd: '/var/www/trustme',
    instances: 1,
    exec_mode: 'fork',
    watch: false,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      // API calls use relative path /api/ which nginx proxies to port 3001
      NEXT_PUBLIC_API_URL: '/api'
    },
    error_file: '/var/www/trustme/logs/pm2-error.log',
    out_file: '/var/www/trustme/logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s',
    listen_timeout: 3000,
    kill_timeout: 5000
  }]
}