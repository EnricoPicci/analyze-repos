#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const commands_1 = require("../core/commands");
const program = new commander_1.Command();
program
    .description('A command to compare the files containted in 2 folders and write the details to a csv file')
    .requiredOption('-f, --folder <string>', `Path of the first folder`)
    .requiredOption('-c, --compFolder <string>', `Path of the second folder`)
    .option('-o, --outdir <string>', `Path of the output directory where csv files are written (default is the current dir)`, '.')
    .option('-e, --extensions <string>', `comma separated list of file extensions to consider in the analysis`)
    .option('-r, --repo <string>', `path to the repo (e.g. the url to the remote git repo on github)`);
program.parse(process.argv);
const _options = program.opts();
const _extensions = _options.extensions.split(',');
(0, commands_1.compFoldersToCsvFiles)(_options.folder, _options.compFolder, _options.outdir, _extensions, _options.repo);
//# sourceMappingURL=compare-to-csv.js.map