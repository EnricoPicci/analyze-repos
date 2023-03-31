import { foldersToCsvFiles } from '../commands';

const topFolder = './test-repos';
const outDir = './testdata/out/test-repos-out';
const extensions = ['ts'];
foldersToCsvFiles(topFolder, outDir, extensions);
