import { compFoldersToCsvFiles } from './exec-command';

const folder = './test-repos/io-backend-mar-2023';
const folderForComparison = './test-repos/io-backend-feb-2022';
const outDir = './testdata/out/test-comparison-out';
const extensions = ['ts'];
compFoldersToCsvFiles(folder, folderForComparison, outDir, extensions);
