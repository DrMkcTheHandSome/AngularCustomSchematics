import { Tree, SchematicContext } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import * as path from 'path';

import * as angularJsonStub from './stubs/angular.json'; 
import * as appModuleStub from './stubs/app.module.json'; 
import * as packageJsonStub from './stubs/package.json'; 
import * as packageJsonMaterialStub from './stubs/package-material.json';
import { installMaterial } from '../registration/index';

const collectionPath = path.join(__dirname, '../collection.json');
let testTree: Tree;

beforeEach(() => {
  testTree = Tree.empty();
  testTree.create('./angular.json', JSON.stringify(angularJsonStub));
  testTree.create('./src/app/app.module.ts', JSON.stringify(appModuleStub.content));
  testTree.create('./package.json', JSON.stringify(packageJsonStub));
}); 

describe('registration', () => {
  describe('when creating files', () => { 
    it('creates the right number of files', async () => {
      const runner = new SchematicTestRunner('schematics', collectionPath);
      const tree = await runner.runSchematicAsync('registration', {name: "test"},testTree).toPromise();
  
      expect(tree.files.length).toEqual(8); 
    });

    it('gives files the correct names', async () => { 
      const nameOption = 'test';
      const runner = new SchematicTestRunner('schematics', collectionPath);
      const tree = await runner.runSchematicAsync('registration', { name: nameOption }, testTree);

      tree.subscribe(result => {
         result.files.slice(3).forEach((filePath: string) => {
          expect(filePath.includes(`/${nameOption}/${nameOption}`)).toEqual(true);
        });
      })
    });

    it('can create files under a deeper path', async () => { 
      const nameOption = 'test';
      const pathOption = 'fake-path';
      const runner = new SchematicTestRunner('schematics', collectionPath);
      const tree = await runner.runSchematicAsync('registration', { name: nameOption, path: pathOption }, testTree);

      tree.subscribe(result => {
        result.files.slice(3).forEach((filePath: string) => {
          expect(filePath.includes(`/${pathOption}/`)).toEqual(true);
        });
      })
    });

    it('does not create test files when spec is false', async () => { 
      const runner = new SchematicTestRunner('schematics', collectionPath);
      const tree = await runner.runSchematicAsync('registration', { name: 'test', spec: 'false' }, testTree);
      tree.subscribe(result => {
        expect(result.files.length).toEqual(7);
      })
    });
  });

  describe('when inserting content',  () => {
    it('adds a new import to the root module', async () => {
      const runner = new SchematicTestRunner('schematics', collectionPath);
      const tree = await runner.runSchematicAsync('registration', { name: 'test' }, testTree);
      tree.subscribe(result => {
        const module = result.read('./src/app/app.module.ts');

        expect(module).toContain(`import { TestModule } from './/test/test.module';`);
      })
    });

    it('adds a new module to the imports array in the root module', async () => {
      const runner = new SchematicTestRunner('schematics', collectionPath);
      const tree = await runner.runSchematicAsync('registration', { name: 'test' }, testTree);
      tree.subscribe(result => {
        const module = result.read('./src/app/app.module.ts');

        expect(module).toContain(', TestModule');
      })
    });

  })

  describe('when installing dependencies', () => { 
    let contextStub: SchematicContext;
    beforeEach(() => {
      contextStub = {
        debug: false,
        engine: jasmine.createSpyObj('engine', [
          'createCollection', 'createContext', 'createSchematic',
          'createSourceFromUrl', 'transformOptions', 'executePostTasks'
        ]),
        logger: jasmine.createSpyObj('logger', ['info']),
        schematic: jasmine.createSpyObj('schematic', ['call']),
        strategy: 0,
        interactive: false,
        addTask: jasmine.createSpy('addTask')
      };
    });

    it('schedules an npm install task if Flex-Layout is not installed', () => {
      const rule = installMaterial();
      rule(testTree, contextStub);

      expect(contextStub.addTask).toHaveBeenCalled();
      expect(contextStub.logger.info).toHaveBeenCalledWith('Installing Angular Flex-Layout');
    });

    it('does not schedule a task if Flex-Layout is installed', () => {
      testTree.overwrite('./package.json', JSON.stringify(packageJsonMaterialStub));
      const rule = installMaterial();
      rule(testTree, contextStub);

      expect(contextStub.addTask).not.toHaveBeenCalled();
      expect(contextStub.logger.info).toHaveBeenCalledWith('Angular Flex-Layout already installed');
    });
    
  });
});
