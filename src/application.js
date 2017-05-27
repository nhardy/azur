import debug from 'debug';
import del from 'del';
import git from 'nodegit';

import * as tmp from './lib/tmp';
import extract from './lib/extract';


const log = debug('azur');
log.log = console.log.bind(console); // eslint-disable-line no-console

export default class Application {
  constructor({ appName, username, password, gitName, gitEmail }) {
    this.appName = appName;
    this.credentials = {
      username,
      password,
    };
    this.gitName = gitName;
    this.gitEmail = gitEmail;
    this.gitUrl = `https://${username}:${password}@${appName}.scm.azurewebsites.net:443/${appName}.git`;
  }

  async deploy({ archiveFilePath }) {
    log('Starting deployment...');

    log('Creating tmp directory...');
    const { path, cleanup } = await tmp.dir();
    log('Created new tmp dir:', path);

    try {
      log('Cloning Azure Git Repository...');
      const repo = await git.Clone(this.gitUrl, path, {
        fetchOpts: {
          callbacks: {
            credentials: () => git.Cred.userpassPlaintextNew(this.credentials.username, this.credentials.password),
          },
        },
      });
      log('Cloned successfully');

      log('Cleaning repository...');
      await del([`${path}/**/*`, `!${path}/.git`], { force: true });
      log('Cleaned repository successfully');

      log('Extracting new application version...');
      await extract(archiveFilePath, path);
      log('Extracted new application successfully');

      log('Tracking files in Git...');
      const statuses = await repo.getStatusExt();
      const paths = statuses.map(status => status.path());
      const index = await repo.index();
      await index.read(1);
      await index.addAll();
      paths.forEach((p) => {
        // eslint-disable-next-line no-bitwise
        if (git.Status.file(repo, p) & git.Status.STATUS.WT_DELETED) {
          index.removeByPath(p);
        } else {
          index.addByPath(p);
        }
      });
      await index.write();
      log('Tracked files in Git successfully');

      log('Writing commit...');
      const oid = await index.writeTree();
      const head = await git.Reference.nameToId(repo, 'HEAD');
      const parent = await repo.getCommit(head);
      const signature = git.Signature.create(this.gitName, this.gitEmail, Date.now(), 0);
      await repo.createCommit('HEAD', signature, signature, 'Deployment', oid, [parent]);
      log('Wrote commit successfully');

      const remote = await repo.getRemote('origin');

      log('Pushing changes to Azure App Service... (this may take a while)');
      await remote.push(['refs/heads/master:refs/heads/master']);
      log('Finished deployment');
    } finally {
      cleanup();
    }
  }
}
