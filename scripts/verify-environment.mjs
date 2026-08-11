import { spawnSync } from 'node:child_process';

const pnpmExecutable = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
const pnpmRunner = process.env.npm_execpath
  ? {
      command: process.execPath,
      prefixArgs: [process.env.npm_execpath],
      shell: false,
    }
  : {
      command: pnpmExecutable,
      prefixArgs: [],
      shell: process.platform === 'win32',
    };

const fail = (message) => {
  console.error(`\nERROR: ${message}`);
  process.exit(1);
};

const runPnpm = (args, label) => {
  console.log(`\n${label}`);
  const result = spawnSync(pnpmRunner.command, [...pnpmRunner.prefixArgs, ...args], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      ASTRO_TELEMETRY_DISABLED: '1',
    },
    shell: pnpmRunner.shell,
    stdio: 'inherit',
  });

  if (result.error) {
    fail(result.error.message);
  }

  if (result.status !== 0) {
    fail(`${label} failed with exit code ${result.status}.`);
  }
};

const [nodeMajor, nodeMinor] = process.versions.node.split('.').map(Number);
if (nodeMajor < 22 || (nodeMajor === 22 && nodeMinor < 12)) {
  fail(`Node.js 22.12.0 or newer is required. Installed: ${process.versions.node}.`);
}

const pnpmVersionResult = spawnSync(
  pnpmRunner.command,
  [...pnpmRunner.prefixArgs, '--version'],
  {
  cwd: process.cwd(),
  encoding: 'utf8',
    shell: pnpmRunner.shell,
  },
);

if (pnpmVersionResult.error || pnpmVersionResult.status !== 0) {
  fail('pnpm was not found. Install it with: npm.cmd install --global pnpm@11.16.0');
}

const pnpmVersion = pnpmVersionResult.stdout.trim();
const pnpmMajor = Number(pnpmVersion.split('.')[0]);
if (!Number.isFinite(pnpmMajor) || pnpmMajor < 11) {
  fail(`pnpm 11 or newer is required. Installed: ${pnpmVersion || 'unknown'}.`);
}

console.log('Windows 11 compatibility check');
console.log(`Operating system: ${process.platform} ${process.arch}`);
console.log(`Node.js: ${process.versions.node}`);
console.log(`pnpm: ${pnpmVersion}`);

runPnpm(['install', '--frozen-lockfile'], 'Checking the locked dependencies...');
runPnpm(['build'], 'Creating a production build...');

console.log('\nSUCCESS: the project is ready to run on this environment.');
