import { expect } from 'chai';
import { tap, toArray } from 'rxjs';
import path from 'path';

import { compareFoldersToFileRecs } from './compare-folders-to-csv';

describe(`compareFoldersToFileRecs`, () => {
    it(`compares folderAnalyzed with folderToCompareAgainst. Should return a list of records representing all the files in folderAnalyzed. 
    Each record contains the number of lines which are different from a file with the same name in folderToCompareAgainst`, () => {
        const folderAnalyzed = path.join('.', 'testdata', 'compare', 'folderAnalyzed');
        const folderToCompareAgainst = path.join('.', 'testdata', 'compare', 'folderToCompareAgainst');

        const numFilesInFolderAnalyzed = 3;

        compareFoldersToFileRecs(folderAnalyzed, folderToCompareAgainst)
            .pipe(
                toArray(),
                tap({
                    next: (fileRecs) => {
                        // test that the number of file records is correct
                        expect(fileRecs.length).equal(numFilesInFolderAnalyzed);
                        // the first file should have no lines which are different from the lines of the omonimous file
                        const fNotChangedName = path.join(folderAnalyzed, 'f1.txt');
                        const fNotChanged = fileRecs.find((fRec) => fRec.fullName === fNotChangedName);
                        if (!fNotChanged) {
                            throw `There should be one file with name ${fNotChangedName}`;
                        }
                        expect(fNotChanged.numDiffLines).equal(0);
                        expect(fNotChanged.new).to.be.false;

                        // the second file should have lines which are different from the lines of the omonimous file
                        const fChangedName = path.join(folderAnalyzed, 'f2.txt');
                        const fChanged = fileRecs.find((fRec) => fRec.fullName === fChangedName);
                        if (!fChanged) {
                            throw `There should be one file with name ${fChangedName}`;
                        }
                        // 2 lines have been added to f1.txt in folderAnalyzed if compared with f1.txt in folderToCompareAgainst
                        // 2 lines have been removed to f1.txt in folderAnalyzed if compared with f1.txt in folderToCompareAgainst
                        // therefore the number of different lines is 45
                        expect(fChanged.numDiffLines).equal(4);
                        expect(fChanged.new).to.be.false;

                        // the third file is a new filed, added to folderAnalyzed and not present in folderToCompareAgainst
                        const fNewName = path.join(folderAnalyzed, 'newfile.txt');
                        const fNew = fileRecs.find((fRec) => fRec.fullName === fNewName);
                        if (!fNew) {
                            throw `There should be one file with name ${fNewName}`;
                        }
                        expect(fNew.new).to.be.true;
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
