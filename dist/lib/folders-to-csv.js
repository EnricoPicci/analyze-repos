#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const exec_command_1 = require("../core/exec-command");
const program = new commander_1.Command();
program
    .description('A command to write details of the files in the subfolders of a directory to csv files')
    .requiredOption('-f, --folder <string>', `Path of the folder that contains the subfolders for which to generate the csv files`)
    .option('-o, --outdir <string>', `Path of the output directory where csv files are written (default is the current dir)`, '.')
    .option('-e, --extensions <string>', `comma separated list of file extensions to consider in the analysis`);
program.parse(process.argv);
const _options = program.opts();
(0, exec_command_1.foldersToCsvFiles)(_options.folder, _options.outdir, _options.extensions);
//# sourceMappingURL=folders-to-csv.js.map