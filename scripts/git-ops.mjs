import git from 'isomorphic-git';
import fs from 'fs';
import path from 'path';

async function main() {
  const dir = path.resolve('.');
  console.log('Initializing git repository in:', dir);

  // 1. Initialize
  await git.init({ fs, dir, defaultBranch: 'main' });
  console.log('Git repository initialized with default branch: main');

  // 2. Scan and add files
  console.log('Scanning files based on .gitignore...');
  const matrix = await git.statusMatrix({
    fs,
    dir,
    filter: (filePath) => {
      // Safety exclusion of critical paths
      if (
        filePath.startsWith('node_modules') ||
        filePath.startsWith('.git') ||
        filePath.startsWith('dist') ||
        filePath.includes('.env') ||
        filePath.includes('test_ai')
      ) {
        return false;
      }
      return true;
    },
  });

  let stagedCount = 0;
  for (const [filepath, head, workdir, stage] of matrix) {
    if (workdir !== 0) {
      await git.add({ fs, dir, filepath });
      stagedCount++;
    }
  }

  console.log(`Staged ${stagedCount} files.`);

  // 3. Commit
  const sha = await git.commit({
    fs,
    dir,
    author: {
      name: 'Hadassah Mehata',
      email: 'hadasshmehata@users.noreply.github.com',
    },
    message: 'Initial commit: Finance Legacy — AI-Powered Forgotten Financial Asset Discovery & Recovery Platform',
  });

  console.log('Successfully created initial commit:', sha);

  // 4. Set remote
  const remoteUrl = 'https://github.com/hadasshmehata/FINANCE-LEGACY--Recover-what-matters.git';
  await git.addRemote({
    fs,
    dir,
    remote: 'origin',
    url: remoteUrl,
    force: true,
  });
  console.log(`Remote 'origin' set to: ${remoteUrl}`);
}

main().catch((err) => {
  console.error('Git error:', err);
  process.exit(1);
});
