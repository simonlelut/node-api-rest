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
      
      key: "C:/Users/GANON/.ssh/keyDebainPri.ppk",
      user : 'root',
      // Multi host is possible, just by passing IPs/hostname as an array
      host : ["51.38.49.215"],

      // Branch
      ref  : 'origin/master',
      // Git repository to clone
      repo : 'https://github.com/simonlelut/node-api-rest.git',
      // Path of the application on target servers
      path : '/var/www/test',
      
      // Commands to be executed on the server after the repo has been cloned
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js'
    }
  }
};
