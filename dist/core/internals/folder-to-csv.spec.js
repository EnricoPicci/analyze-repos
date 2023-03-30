"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const rxjs_1 = require("rxjs");
const path_1 = __importDefault(require("path"));
const folder_to_csv_1 = require("./folder-to-csv");
const observable_fs_1 = require("observable-fs");
const numFilesInTestFolder = 6;
describe(`folderToFileRecs`, () => {
    it(`should return a list of records representing all the files in the test folder and its subfolders
    two files have the same content and therefore have the same hash`, () => {
        const folder = path_1.default.join('.', 'testdata', 'testfolder');
        const fileWithSameContent_1 = path_1.default.join(folder, 'dir1', 'f1.txt');
        const fileWithSameContent_2 = path_1.default.join(folder, 'dir2', 'dir2.1', 'same_as_f1_in_dir1.txt');
        (0, folder_to_csv_1.folderToFileRecs)(folder)
            .pipe((0, rxjs_1.toArray)(), (0, rxjs_1.tap)({
            next: (fileRecs) => {
                // test that the number of file records is correct
                (0, chai_1.expect)(fileRecs.length).equal(numFilesInTestFolder);
                // test that the 2 files which have the same content have the same hash
                const fSame_1 = fileRecs.filter((fRec) => fRec.fileRec.fullName === fileWithSameContent_1);
                const fSame_2 = fileRecs.filter((fRec) => fRec.fileRec.fullName === fileWithSameContent_2);
                if (fSame_1.length !== 1) {
                    throw `There should be only one file with name ${fileWithSameContent_1}`;
                }
                if (fSame_2.length !== 1) {
                    throw `There should be only one file with name ${fileWithSameContent_2}`;
                }
                (0, chai_1.expect)(fSame_1[0].fileRec.hash === fSame_2[0].fileRec.hash).to.be.true;
                // test that apart the 2 files with same content, all the others have different hash values
                const hashValues = new Set(fileRecs.map((r) => r.fileRec.hash)); // collect hash values as a set
                (0, chai_1.expect)(hashValues.size).equal(fileRecs.length - 1); // there are only 2 files which have the same hash
            },
        }))
            .subscribe({
            error: (err) => {
                throw err;
            },
        });
    }).timeout(20000);
    it(`should return a list of records representing all the files in the test folder and its subfolders
    filtered by specific extensions`, () => {
        const folder = path_1.default.join('.', 'testdata', 'testfolder');
        const extensions = ['txtx', 'ttt'];
        const expectedNumFilteredFiles = 3;
        (0, folder_to_csv_1.folderToFileRecs)(folder, extensions)
            .pipe((0, rxjs_1.toArray)(), (0, rxjs_1.tap)({
            next: (fileRecs) => {
                // test that the number of file records is correct after filtering the ones with the specified extensions
                (0, chai_1.expect)(fileRecs.length).equal(expectedNumFilteredFiles);
            },
        }))
            .subscribe({
            error: (err) => {
                throw err;
            },
        });
    }).timeout(20000);
});
describe(`folderToCsvFile`, () => {
    it(`should write a csv file with each record representing a file in the folder`, () => {
        const folder = path_1.default.join('.', 'testdata', 'testfolder');
        const csvFile = path_1.default.join('.', 'testdata', 'out', 'testdata_testfolder');
        (0, folder_to_csv_1.folderToCsvFile)(folder, csvFile)
            .pipe(
        // after writing the file, read it again
        (0, rxjs_1.concatMap)(() => (0, observable_fs_1.readLinesObs)(csvFile)), (0, rxjs_1.tap)({
            next: (csvLines) => {
                // test that the number of lines in the file is correct, i.e. is equal to the number of files plus the header line
                (0, chai_1.expect)(csvLines.length).equal(numFilesInTestFolder + 1);
            },
        }))
            .subscribe({
            error: (err) => {
                throw err;
            },
        });
    }).timeout(20000);
});
describe(`subfoldersToCsvFiles`, () => {
    it(`should write a csv file for each subfolder found at the top level of the folder passed as input`, () => {
        const topFolder = path_1.default.join('.', 'testdata', 'testfolder');
        const outDir = path_1.default.join('.', 'testdata', 'out', 'subfolders_csvs');
        (0, folder_to_csv_1.subfoldersToCsvFiles)(topFolder, outDir)
            .pipe((0, rxjs_1.tap)({
            next: (csvFiles) => {
                // test that the number of csv files written is correct
                (0, chai_1.expect)(csvFiles.length).equal(3);
            },
        }))
            .subscribe({
            error: (err) => {
                throw err;
            },
        });
    }).timeout(20000);
});
//# sourceMappingURL=folder-to-csv.spec.js.map