#!/usr/bin/env node

import { Command } from 'commander';
import { foldersToCsvFiles } from '../core/commands';

const program = new Command();

program
    .description('A command to write details of the files in the subfolders of a directory to csv files')
    .requiredOption(
        '-f, --folder <string>',
        `Path of the folder that contains the subfolders for which to generate the csv files`,
    )
    .option(
        '-o, --outdir <string>',
        `Path of the output directory where csv files are written (default is the current dir)`,
        '.',
    )
    .option('-e, --extensions <string>', `comma separated list of file extensions to consider in the analysis`);

program.parse(process.argv);
const _options = program.opts();

foldersToCsvFiles(_options.folder, _options.outdir, _options.extensions);
