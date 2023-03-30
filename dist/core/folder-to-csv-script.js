"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const exec_command_1 = require("./exec-command");
const topFolder = './test-repos';
const outDir = './testdata/out/test-repos-out';
const extensions = ['ts'];
(0, exec_command_1.foldersToCsvFiles)(topFolder, outDir, extensions);
//# sourceMappingURL=folder-to-csv-script.js.map