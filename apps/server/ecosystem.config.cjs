module.exports = {
  apps: [
    {
      name: "royalclub",
      script: "dist/index.mjs",
      exec_mode: "fork",
      instances: 1,

      // Restart policy
      watch: false,
      autorestart: true,
      min_uptime: "5s",
      max_restarts: 10,
      restart_delay: 3000,

      // Shutdown handling — important given your 10s forceExit timeout
      kill_timeout: 12_000,
      wait_ready: false,
      listen_timeout: 10_000,

      out_file: "./logs/server-out.log",
      error_file: "./logs/server-error.log",
      merge_logs: true,

      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
