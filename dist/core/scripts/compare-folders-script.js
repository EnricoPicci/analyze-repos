"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commands_1 = require("../commands");
const folder = '/Users/enricopiccinin/temp/camunda/2023-03-camunda-bpm-platform';
const folderForComparison = '/Users/enricopiccinin/temp/camunda/2021-10-camunda-bpm-platform';
const outDir = '/Users/enricopiccinin/temp/camunda-out/test-comparison-out';
const extensions = ['java'];
(0, commands_1.compFoldersToCsvFiles)(folder, folderForComparison, outDir, extensions);
// node dist/lib/compare-to-csv.js -f ~/temp/camunda/2023-03-camunda-bpm-platform -c ~/temp/camunda/2021-10-camunda-bpm-platform -e java -r https://github.com/camunda/camunda-bpm-platform -o ~/temp/camunda-out1
// node dist/lib/compare-to-csv.js -f /Users/enricopiccinin/temp/camunda/2023-03-camunda-bpm-platform -c /Users/enricopiccinin/temp/camunda/2021-10-camunda-bpm-platform -e java -r https://github.com/camunda/camunda-bpm-platform -o /Users/enricopiccinin/temp/camunda-out1
//# sourceMappingURL=compare-folders-script.js.map