"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const exec_command_1 = require("./exec-command");
const folder = './test-repos/io-backend-mar-2023';
const folderForComparison = './test-repos/io-backend-feb-2022';
const outDir = './testdata/out/test-comparison-out';
const extensions = ['ts'];
(0, exec_command_1.compFoldersToCsvFiles)(folder, folderForComparison, outDir, extensions);
//# sourceMappingURL=compare-folders-script.js.map