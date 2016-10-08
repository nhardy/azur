# Basic [Microsoft Azure App Service](https://azure.microsoft.com/en-us/services/app-service/) Automation

Supports deployment of a zip archive to Azure App Service via Git from within Node.js.

At this point in time, this is very much a work-in-progress and the API may be subject to change. Use at your own risk.

## Install

`npm install azur --save-dev`

## Usage

```javascript
import Application from 'azur';

const app = new Application({
  appName: '<your-site>', // http://<your-site>.azurewebsites.net/
  username: '<deployment-username>', // Microsoft Azure Git Deployment Username
  password: '<deployment-password>', // Microsoft Azure Git Deployment Password
  gitName: 'Automation', // Deployment Commit Author
  gitEmail: 'noreply@nhardy.id.au', // Deployment Commit E-mail
});

app.deploy({
  archiveFilePath: 'path/to/archive.zip',
}).then(() => {
  console.log('Done!'); // Post-deployment
});
```

`DEBUG=azur` may be set in your environment variables to enable some logging during the deployment process.

## Notable influences

- [beanstalkify](https://github.com/liamqma/beanstalkify) - AWS Elastic Beanstalk Automation
- [azure-deploy](https://github.com/m42jkuehle/node-azure-deploy) - Azure App Service Deployment automation (also using git)
