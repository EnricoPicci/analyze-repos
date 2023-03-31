"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commands_1 = require("../commands");
const topFolder = './test-repos';
const outDir = './testdata/out/test-repos-out';
const extensions = ['ts'];
(0, commands_1.foldersToCsvFiles)(topFolder, outDir, extensions);
//# sourceMappingURL=folder-to-csv-script.js.map