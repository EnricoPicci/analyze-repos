import { compFoldersToCsvFiles } from '../commands';

const folder = '/Users/enricopiccinin/temp/camunda/2023-03-camunda-bpm-platform';
const folderForComparison = '/Users/enricopiccinin/temp/camunda/2021-10-camunda-bpm-platform';
const outDir = '/Users/enricopiccinin/temp/camunda-out/test-comparison-out';
const extensions = ['java'];
compFoldersToCsvFiles(folder, folderForComparison, outDir, extensions);
