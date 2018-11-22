const semver = require('semver');
const chalk = require('chalk');
const axios = require('axios');
const { fatal } = require('../helper/logger');
const packageConfig = require('../../package.json');

module.exports = done => {
  // Ensure minimum supported node version is used
  if (!semver.satisfies(process.version, packageConfig.engines.node)) {
    return fatal(
      '  You must upgrade node to >=' + packageConfig.engines.node + '.x to use shares-cli'
    )
  }

  axios({
    url: 'https://registry.npmjs.org/sakitam-cli',
    method: 'get',
    timeout: 5000
  }).then((res) => {
    if (res.status === 200) {
      const latestVersion = res.data['dist-tags'].latest;
      const localVersion = packageConfig.version;
      if (semver.lt(localVersion, latestVersion)) {
        console.log(chalk.yellow('  A newer version of shares-cli is available.'));
        console.log();
        console.log('  latest:    ' + chalk.green(latestVersion));
        console.log('  installed: ' + chalk.red(localVersion));
        console.log('  update shares-cli latest: npm update -g shares-cli ');
        console.log();
      }
      done();
    }
  }).catch((err) => {
    if (err) {
      fatal('The cli version check error');
      done();
    }
  });
};
