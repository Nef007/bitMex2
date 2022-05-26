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
      DATABASE: 'bitMex',
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
    production : {
      user : "root",
      host : "10.40.52.222",
      repo : "http://10.40.52.236/nef007/parsiv.git",
      ref  : "origin/master",
      path : "/home/parsiv",
      'post-deploy' : "pm2 startOrRestart ecosystem.config.js",
      env: {
        NODE_ENV: "production"
      }
    },

  }
}
