#!/usr/bin/env node

// node dist/lib/compare-to-csv.js -f ~/temp/camunda/2023-03-camunda-bpm-platform -c ~/temp/camunda/2021-10-camunda-bpm-platform -e java -r https://github.com/camunda/camunda-bpm-platform -o ~/temp/camunda-out1

import { Command } from 'commander';
import { compFoldersToCsvFiles } from '../core/commands';

const program = new Command();

program
    .description('A command to compare the files containted in 2 folders and write the details to a csv file')
    .requiredOption('-f, --folder <string>', `Path of the first folder`)
    .requiredOption('-c, --compFolder <string>', `Path of the second folder`)
    .option(
        '-o, --outdir <string>',
        `Path of the output directory where csv files are written (default is the current dir)`,
        '.',
    )
    .option('-e, --extensions <string>', `comma separated list of file extensions to consider in the analysis`)
    .option('-r, --repo <string>', `path to the repo (e.g. the url to the remote git repo on github)`);

program.parse(process.argv);
const _options = program.opts();

const _extensions = _options.extensions.split(',');

compFoldersToCsvFiles(_options.folder, _options.compFolder, _options.outdir, _extensions, _options.repo);
