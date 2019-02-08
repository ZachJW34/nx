import {
  newProject,
  runCLI,
  newLib,
  runCLIAsync,
  newApp,
  copyMissingPackages,
  ensureProject,
  uniq
} from '../utils';

describe('Karma', () => {
  it('should be able to generate a testable library using karma', async done => {
    ensureProject();
    const mylib = uniq('mylib');
    newLib(`${mylib} --unit-test-runner karma`);

    await Promise.all([
      runCLIAsync(`generate service test --project ${mylib}`),
      runCLIAsync(`generate component test --project ${mylib}`)
    ]);
    const jestResult = await runCLIAsync(`test ${mylib}`);
    expect(jestResult.stderr).toContain('Executed 3 of 3 SUCCESS');
    done();
  }, 10000);

  it('should be able to generate a testable application using karma', async () => {
    ensureProject();
    const myapp = uniq('myapp');
    newApp(`${myapp} --unit-test-runner karma`);

    await Promise.all([
      runCLIAsync(`generate service test --project ${myapp}`),
      runCLIAsync(`generate component test --project ${myapp}`)
    ]);
    const jestResult = await runCLIAsync(`test ${myapp}`);
    expect(jestResult.stderr).toContain('Executed 3 of 3 SUCCESS');
  }, 10000);
});
