module.exports = {
  // more http://pm2.keymetrics.io/docs/usage/environment/
  apps : [{
    name      : 'server',
    script    : './app/server.ts',
    instances : 4,
    env: {
      NODE_ENV: 'production'
    }
  }],

  // more http://pm2.keymetrics.io/docs/usage/deployment/
  deploy : {
    production : {
      
      key: "/root/.ssh/newKey_private.perm",

      user : 'simon',
      // Multi host is possible, just by passing IPs/hostname as an array
      host : ["192.168.1.68"],

      ssh_options: "StrictHostKeyChecking=no",
      // Branch
      ref  : 'origin/master',
      // Git repository to clone
      repo : 'git@github.com:simonlelut/node-api-rest.git',
      // Path of the application on target servers
      path : '/var/www/myapp',
      // Commands to be executed on the server after the repo has been cloned
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js'
    }
  }
};
