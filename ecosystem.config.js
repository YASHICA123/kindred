/**
 * PM2 Ecosystem Configuration
 * 
 * This file manages both Next.js and Strapi processes
 * 
 * Usage:
 * - Start all:     pm2 start ecosystem.config.js
 * - Stop all:      pm2 stop ecosystem.config.js
 * - Restart all:   pm2 restart ecosystem.config.js
 * - View logs:     pm2 logs
 * - View status:   pm2 status
 * - Save config:   pm2 save
 * - Auto-startup:  pm2 startup
 */

module.exports = {
  apps: [
    {
      name: 'strapi-cms',
      cwd: './school-cms',
      script: 'npm',
      args: 'start',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 1337,
      },
      error_file: './logs/strapi-error.log',
      out_file: './logs/strapi-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      // Exponential backoff restart delay
      exp_backoff_restart_delay: 100,
      min_uptime: '10s',
      max_restarts: 10,
    },
    {
      name: 'nextjs-frontend',
      cwd: './',
      script: 'npm',
      args: 'start',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: './logs/nextjs-error.log',
      out_file: './logs/nextjs-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      exp_backoff_restart_delay: 100,
      min_uptime: '10s',
      max_restarts: 10,
    },
  ],
};
