import {
  Rule,
  Tree,
  mergeWith,
  chain,
  url,
  apply,
  SchematicContext,
  move,
  template,
  noop,
  filter,
  schematic
} from '@angular-devkit/schematics';
import {
  getProjectConfig,
  readJsonInTree,
  updateJsonInTree
} from '../../utils/ast-utils';
import { offsetFromRoot } from '../../utils/common';
import { join, normalize } from '@angular-devkit/core';

export interface KarmaProjectSchema {
  project: string;
}

function generateFiles(options: KarmaProjectSchema): Rule {
  return (host, context) => {
    const projectConfig = getProjectConfig(host, options.project);
    return mergeWith(
      apply(url('./files'), [
        template({
          tmpl: '',
          ...options,
          projectRoot: projectConfig.root,
          offsetFromRoot: offsetFromRoot(projectConfig.root)
        }),
        move(projectConfig.root)
      ])
    )(host, context);
  };
}

function updateTsConfig(options: KarmaProjectSchema): Rule {
  return (host: Tree, context: SchematicContext) => {
    const projectConfig = getProjectConfig(host, options.project);
    return updateJsonInTree(join(projectConfig.root, 'tsconfig.json'), json => {
      return {
        ...json,
        compilerOptions: {
          ...json.compilerOptions,
          types: Array.from(
            new Set([...(json.compilerOptions.types || []), 'jasmine'])
          )
        }
      };
    });
  };
}

function updateAngularJson(options: KarmaProjectSchema): Rule {
  return updateJsonInTree('angular.json', json => {
    const projectConfig = json.projects[options.project];

    projectConfig.architect.test = {
      builder: '@angular-devkit/build-angular:karma',
      options: {
        main: join(normalize(projectConfig.sourceRoot), 'test.ts'),
        polyfills: join(normalize(projectConfig.sourceRoot), 'polyfills.ts'),
        tsConfig: join(normalize(projectConfig.root), 'tsconfig.spec.json'),
        karmaConfig: join(normalize(projectConfig.root), 'karma.conf.js'),
        styles: [],
        scripts: [],
        assets: []
      }
    };

    if (projectConfig.architect.lint) {
      projectConfig.architect.lint.options.tsConfig = [
        ...projectConfig.architect.lint.options.tsConfig,
        join(normalize(projectConfig.root), 'tsconfig.spec.json')
      ];
    }
    return json;
  });
}

function check(options: KarmaProjectSchema): Rule {
  return (host: Tree, context: SchematicContext) => {
    const projectConfig = getProjectConfig(host, options.project);
    if (projectConfig.architect.test) {
      throw new Error(
        `${options.project} already has a test architect option.`
      );
    }
    const packageJson = readJsonInTree(host, 'package.json');
    if (!packageJson.devDependencies.karma) {
      return schematic('karma', {});
    }
  };
}

export default function(options: KarmaProjectSchema): Rule {
  return chain([
    check(options),
    generateFiles(options),
    updateTsConfig(options),
    updateAngularJson(options)
  ]);
}
