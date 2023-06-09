import path from 'path';

import { map, toArray, concatMap, tap, forkJoin, from } from 'rxjs';

import { diffLines } from 'diff';

import { writeFileObs } from 'observable-fs';
import { toCsvObs } from '../../tools/csv/to-csv';
import { folderToFileRecs } from './folder-to-csv';

export function compareFoldersToFileRecs(
    folder: string,
    folderForComparison: string,
    extensions?: string[],
    pathToRepoMaster?: string,
) {
    const fileRecs = folderToFileRecs(folder, extensions, pathToRepoMaster).pipe(toArray());
    const filesRecsForCompare = folderToFileRecs(folderForComparison, extensions, pathToRepoMaster).pipe(toArray());
    console.log('>>>>>>????****', folder, folderForComparison, extensions, pathToRepoMaster);
    return forkJoin([fileRecs, filesRecsForCompare]).pipe(
        map(([fRecs, fRecsForCompare]) => {
            const fileRecs = fRecs.map((_fRec) => {
                const _fRecForCompare = fRecsForCompare.find(
                    (_fr) => _fr.fileRec.path === _fRec.fileRec.path && _fr.fileRec.name === _fRec.fileRec.name,
                );
                _fRec.fileRec.new = _fRecForCompare === undefined;
                let dLines: string[] = [];
                if (_fRecForCompare) {
                    const changes = diffLines(_fRecForCompare.content, _fRec.content);
                    if (changes) {
                        dLines = diffLines(_fRecForCompare.content, _fRec.content)
                            .filter((change) => change.added || change.removed)
                            .map((change) => change.value);
                    }
                }
                _fRec.fileRec.numDiffLines = dLines.length;
                return _fRec.fileRec;
            });
            return fileRecs;
        }),
        concatMap((fRecs) => from(fRecs)),
    );
}

export function compareFoldersToCsv(
    folder: string,
    folderForComparison: string,
    extensions?: string[],
    pathToRepoMaster?: string,
) {
    return compareFoldersToFileRecs(folder, folderForComparison, extensions, pathToRepoMaster).pipe(
        toCsvObs(),
        toArray(),
    );
}

export function compareFoldersToCsvFile(
    folder: string,
    folderForComparison: string,
    outDir: string,
    extensions?: string[],
    pathToRepoMaster?: string,
) {
    folder = path.normalize(folder);
    folderForComparison = path.normalize(folderForComparison);
    const csvFileName = path.join(
        outDir,
        `${folder.replace(/\//g, '_')}_vs_${folderForComparison.replace(/\//g, '_')}.csv`,
    );

    return compareFoldersToCsv(folder, folderForComparison, extensions, pathToRepoMaster).pipe(
        concatMap((csvLines) => writeFileObs(csvFileName, csvLines)),
        tap(() => {
            console.log(`csv ${csvFileName} written in directory ${outDir}`);
            console.log(`Folder ${folder} compared with folder ${folderForComparison}`);
        }),
    );
}
