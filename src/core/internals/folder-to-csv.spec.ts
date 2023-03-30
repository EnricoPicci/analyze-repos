import { expect } from 'chai';
import { tap, concatMap, toArray } from 'rxjs';
import path from 'path';

import { folderToCsvFile, folderToFileRecs, subfoldersToCsvFiles } from './folder-to-csv';
import { readLinesObs } from 'observable-fs';

const numFilesInTestFolder = 6;

describe(`folderToFileRecs`, () => {
    it(`should return a list of records representing all the files in the test folder and its subfolders
    two files have the same content and therefore have the same hash`, () => {
        const folder = path.join('.', 'testdata', 'testfolder');

        const fileWithSameContent_1 = path.join(folder, 'dir1', 'f1.txt');
        const fileWithSameContent_2 = path.join(folder, 'dir2', 'dir2.1', 'same_as_f1_in_dir1.txt');

        folderToFileRecs(folder)
            .pipe(
                toArray(),
                tap({
                    next: (fileRecs) => {
                        // test that the number of file records is correct
                        expect(fileRecs.length).equal(numFilesInTestFolder);
                        // test that the 2 files which have the same content have the same hash
                        const fSame_1 = fileRecs.filter((fRec) => fRec.fileRec.fullName === fileWithSameContent_1);
                        const fSame_2 = fileRecs.filter((fRec) => fRec.fileRec.fullName === fileWithSameContent_2);
                        if (fSame_1.length !== 1) {
                            throw `There should be only one file with name ${fileWithSameContent_1}`;
                        }
                        if (fSame_2.length !== 1) {
                            throw `There should be only one file with name ${fileWithSameContent_2}`;
                        }
                        expect(fSame_1[0].fileRec.hash === fSame_2[0].fileRec.hash).to.be.true;
                        // test that apart the 2 files with same content, all the others have different hash values
                        const hashValues = new Set(fileRecs.map((r) => r.fileRec.hash)); // collect hash values as a set
                        expect(hashValues.size).equal(fileRecs.length - 1); // there are only 2 files which have the same hash
                    },
                }),
            )
            .subscribe({
                error: (err) => {
                    throw err;
                },
            });
    }).timeout(20000);

    it(`should return a list of records representing all the files in the test folder and its subfolders
    filtered by specific extensions`, () => {
        const folder = path.join('.', 'testdata', 'testfolder');

        const extensions = ['txtx', 'ttt'];

        const expectedNumFilteredFiles = 3;

        folderToFileRecs(folder, extensions)
            .pipe(
                toArray(),
                tap({
                    next: (fileRecs) => {
                        // test that the number of file records is correct after filtering the ones with the specified extensions
                        expect(fileRecs.length).equal(expectedNumFilteredFiles);
                    },
                }),
            )
            .subscribe({
                error: (err) => {
                    throw err;
                },
            });
    }).timeout(20000);
});

describe(`folderToCsvFile`, () => {
    it(`should write a csv file with each record representing a file in the folder`, () => {
        const folder = path.join('.', 'testdata', 'testfolder');

        const csvFile = path.join('.', 'testdata', 'out', 'testdata_testfolder');

        folderToCsvFile(folder, csvFile)
            .pipe(
                // after writing the file, read it again
                concatMap(() => readLinesObs(csvFile)),
                tap({
                    next: (csvLines) => {
                        // test that the number of lines in the file is correct, i.e. is equal to the number of files plus the header line
                        expect(csvLines.length).equal(numFilesInTestFolder + 1);
                    },
                }),
            )
            .subscribe({
                error: (err) => {
                    throw err;
                },
            });
    }).timeout(20000);
});

describe(`subfoldersToCsvFiles`, () => {
    it(`should write a csv file for each subfolder found at the top level of the folder passed as input`, () => {
        const topFolder = path.join('.', 'testdata', 'testfolder');

        const outDir = path.join('.', 'testdata', 'out', 'subfolders_csvs');

        subfoldersToCsvFiles(topFolder, outDir)
            .pipe(
                tap({
                    next: (csvFiles) => {
                        // test that the number of csv files written is correct
                        expect(csvFiles.length).equal(3);
                    },
                }),
            )
            .subscribe({
                error: (err) => {
                    throw err;
                },
            });
    }).timeout(20000);
});
