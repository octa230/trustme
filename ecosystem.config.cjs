module.exports = {
  apps: [
    {
      name: "tools",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      cwd: "/var/www/trustme",
      instances: 1,          // or "max" if using cluster
      exec_mode: "fork",     // Next.js prefers fork mode
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
