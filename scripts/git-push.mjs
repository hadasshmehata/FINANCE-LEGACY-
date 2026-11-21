import git from 'isomorphic-git';
import http from 'isomorphic-git/http/node';
import fs from 'fs';
import path from 'path';

function getEnvToken() {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN;
  try {
    const envPath = path.resolve('.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf-8');
      const match = content.match(/^\s*GITHUB_TOKEN\s*=\s*(.+)$/m);
      if (match && match[1]) {
        return match[1].trim().replace(/^["']|["']$/g, '');
      }
    }
  } catch {
    // ignore
  }
  return null;
}

async function push(token, repoUrl) {
  const dir = path.resolve('.');
  const url = repoUrl || 'https://github.com/hadasshmehata/FINANCE-LEGACY--Recover-what-matters.git';

  await git.addRemote({
    fs,
    dir,
    remote: 'origin',
    url,
    force: true,
  });

  console.log(`Pushing 'main' branch to ${url}...`);

  const pushResult = await git.push({
    fs,
    http,
    dir,
    remote: 'origin',
    ref: 'main',
    force: true,
    onAuth: () => ({
      username: token,
      password: '',
    }),
  });

  console.log('Push completed successfully!', pushResult);
}

const token = process.argv[2] || getEnvToken();
const repo = process.argv[3];

if (!token) {
  console.error('Usage: node scripts/git-push.mjs <GITHUB_PERSONAL_ACCESS_TOKEN> [REPO_URL]');
  console.error('Or set GITHUB_TOKEN in your .env file and run: node scripts/git-push.mjs');
  process.exit(1);
}

push(token, repo).catch((err) => {
  console.error('Push failed:', err.message || err);
  process.exit(1);
});
