module.exports = {
  apps : [{
    name   : "app",
    script : "./app.js",
   // max_memory_restart: '3G',
   // instances: 3,
   // exec_mode: 'cluster',
    out_file: "../out.log",
    error_file: "../error.log",
    max_restart: 10,
    autorestart: true,
    restart_delay: 4000,
    wait_ready: true,


    env: {
      NODE_ENV: "production",
      PORT: 443,
      JWT_SECRET: 'Dkfl',
      DATABASE: 'bitmex33',
      USERNAME : 'postgres',
      PASSWORD : '123',
      HOST :  'localhost',
    },

  },{
    name   : "monit",
    script : "./monit.js",
    out_file: "../out_monit.log",
    error_file: "../error_monit.log",
    max_restart: 10,
    autorestart: true,
    restart_delay: 4000,
    env: {
      NODE_ENV: "production",
    },

  }],
  deploy : {
    deploy : {
      production : {
        user: "root",
        host: "45.84.226.201",
        repo: "https://github.com/Nef007/bitMex2.git",
        ref: "origin/master",
        path: "/home/bitmex2",
        'post-deploy': " pm2 startOrRestart ecosystem.config.js",
        env: {
          NODE_ENV: "production",
        }
      }}}
}
