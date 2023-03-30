import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

import { map, toArray, concatMap, tap, from, mergeMap, filter } from 'rxjs';

import { writeFileObs, filesObs, dirNamesListObs, deleteDirObs } from 'observable-fs';
import { toCsvObs } from '../../tools/csv/to-csv';

const pathToRepoMaster = 'https://github.com/pagopa/io-backend/blob/master';

export type FileRec = {
    fullName: string;
    folder: string;
    path: string;
    name: string;
    numLines: number;
    hash: string;
    new?: boolean;
    numDiffLines?: number;
    pathToRepo: string;
};

export type FileRecWithContent = {
    fileRec: FileRec;
    content: string;
};

export function folderToFileRecs(folder: string, extensions?: string[]) {
    return filesObs(folder).pipe(
        filter((fName) => {
            if (extensions === undefined) {
                return true;
            }
            const pPath = parsePath(fName, folder);
            let ext = pPath.ext;
            if (ext.length > 0) {
                const firstChar = ext[0];
                if (firstChar !== '.') {
                    throw `First char of extension ${ext} is not "." (the dot char) as expected`;
                }
                ext = ext.substring(1);
            }
            return extensions.includes(ext);
        }),
        map((fName) => {
            const pPath = parsePath(fName, folder);
            // calculate hash
            // https://ilikekillnerds.com/2020/04/how-to-get-the-hash-of-a-file-in-node-js/
            const fileBuffer = fs.readFileSync(fName);
            const hashSum = crypto.createHash('sha1');
            hashSum.update(fileBuffer);
            const hash = hashSum.digest('base64');
            const content = fileBuffer.toString();
            const lines = content.split(`\n`);
            const numLines = lines.length;
            const fileRec: FileRec = {
                fullName: fName,
                folder,
                path: pPath.dir,
                name: pPath.base,
                numLines,
                hash,
                pathToRepo: pathToRepoMaster + pPath.dir + '/' + pPath.base,
            };
            const fRecWithCoontent: FileRecWithContent = { fileRec, content };
            return fRecWithCoontent;
        }),
    );
}

// remove the top folder from the file path and then parse the file path
// in this way we can get the path to the file, ignoring the top folder, i.e. relative to the folder where the repo has been placed
// Example
// fName = 'topFolder/repo1/src/file.txt
// folder = 'topFolder/repo1'
// the file path we parse is 'src/file.txt'
function parsePath(fName: string, folder: string) {
    const fNameNorm = path.normalize(fName);
    const folderNorm = path.normalize(folder);
    const fNameFromFolder = fNameNorm.substring(folderNorm.length);
    return path.parse(fNameFromFolder);
}

export function folderToCsv(folder: string, extensions?: string[]) {
    return folderToFileRecs(folder, extensions).pipe(
        map((rec) => rec.fileRec),
        toCsvObs(),
        toArray(),
    );
}

export function folderToCsvFile(folder: string, csvFileName: string, extensions?: string[]) {
    return folderToCsv(folder, extensions).pipe(
        concatMap((csvLines) => writeFileObs(csvFileName, csvLines)),
        tap(() => console.log(`csv ${csvFileName} written for folder ${folder}`)),
    );
}

// reads all the subfolders that are contained, at the top level, into the folder passed as parameter
// and for each of these subfolders writes a file with csv records for all its files
export function subfoldersToCsvFiles(topFolder: string, outDir: string, concurrent = 10, extensions?: string[]) {
    return deleteDirObs(outDir).pipe(
        concatMap(() => dirNamesListObs(topFolder)),
        concatMap((dirs) => from(dirs)),
        mergeMap((dir) => {
            const dirFullPath = path.join(topFolder, dir);
            const csvFileName = path.join(outDir, `${dir}.csv`);
            return folderToCsvFile(dirFullPath, csvFileName, extensions);
        }, concurrent),
        toArray(),
    );
}
