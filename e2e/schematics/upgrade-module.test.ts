import {
  ensureProject,
  expectTestsPass,
  newApp,
  newProject,
  runCLI,
  runCLIAsync,
  uniq,
  updateFile
} from '../utils';

describe('Upgrade', () => {
  it('should generate an UpgradeModule setup', async () => {
    ensureProject();
    const myapp = uniq('myapp');
    newApp(`${myapp} --unit-test-runner=karma`);

    updateFile(
      `apps/${myapp}/src/legacy.js`,
      `
      const angular = window.angular.module('legacy', []);
      angular.component('proj-root-legacy', {
        template: 'Expected Value'
      });
    `
    );

    updateFile(
      `apps/${myapp}/src/app/app.component.html`,
      `
      EXPECTED [<proj-root-legacy></proj-root-legacy>]
    `
    );

    updateFile(`apps/${myapp}/src/app/app.component.spec.ts`, ``);

    runCLI(
      'generate upgrade-module legacy --angularJsImport=./legacy ' +
        `--angularJsCmpSelector=proj-root-legacy --project=${myapp}`
    );

    runCLI(`build ${myapp}`);
    expectTestsPass(await runCLIAsync(`test ${myapp} --no-watch`));
  }, 1000000);
});
