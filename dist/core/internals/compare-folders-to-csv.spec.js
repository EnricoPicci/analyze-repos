"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const rxjs_1 = require("rxjs");
const path_1 = __importDefault(require("path"));
const compare_folders_to_csv_1 = require("./compare-folders-to-csv");
describe(`compareFoldersToFileRecs`, () => {
    it(`compares folderAnalyzed with folderToCompareAgainst. Should return a list of records representing all the files in folderAnalyzed. 
    Each record contains the number of lines which are different from a file with the same name in folderToCompareAgainst`, () => {
        const folderAnalyzed = path_1.default.join('.', 'testdata', 'compare', 'folderAnalyzed');
        const folderToCompareAgainst = path_1.default.join('.', 'testdata', 'compare', 'folderToCompareAgainst');
        const numFilesInFolderAnalyzed = 3;
        (0, compare_folders_to_csv_1.compareFoldersToFileRecs)(folderAnalyzed, folderToCompareAgainst)
            .pipe((0, rxjs_1.toArray)(), (0, rxjs_1.tap)({
            next: (fileRecs) => {
                // test that the number of file records is correct
                (0, chai_1.expect)(fileRecs.length).equal(numFilesInFolderAnalyzed);
                // the first file should have no lines which are different from the lines of the omonimous file
                const fNotChangedName = path_1.default.join(folderAnalyzed, 'f1.txt');
                const fNotChanged = fileRecs.find((fRec) => fRec.fullName === fNotChangedName);
                if (!fNotChanged) {
                    throw `There should be one file with name ${fNotChangedName}`;
                }
                (0, chai_1.expect)(fNotChanged.numDiffLines).equal(0);
                (0, chai_1.expect)(fNotChanged.new).to.be.false;
                // the second file should have lines which are different from the lines of the omonimous file
                const fChangedName = path_1.default.join(folderAnalyzed, 'f2.txt');
                const fChanged = fileRecs.find((fRec) => fRec.fullName === fChangedName);
                if (!fChanged) {
                    throw `There should be one file with name ${fChangedName}`;
                }
                // 2 lines have been added to f1.txt in folderAnalyzed if compared with f1.txt in folderToCompareAgainst
                // 2 lines have been removed to f1.txt in folderAnalyzed if compared with f1.txt in folderToCompareAgainst
                // therefore the number of different lines is 45
                (0, chai_1.expect)(fChanged.numDiffLines).equal(4);
                (0, chai_1.expect)(fChanged.new).to.be.false;
                // the third file is a new filed, added to folderAnalyzed and not present in folderToCompareAgainst
                const fNewName = path_1.default.join(folderAnalyzed, 'newfile.txt');
                const fNew = fileRecs.find((fRec) => fRec.fullName === fNewName);
                if (!fNew) {
                    throw `There should be one file with name ${fNewName}`;
                }
                (0, chai_1.expect)(fNew.new).to.be.true;
            },
        }))
            .subscribe({
            error: (err) => {
                throw err;
            },
        });
    }).timeout(20000);
});
//# sourceMappingURL=compare-folders-to-csv.spec.js.map