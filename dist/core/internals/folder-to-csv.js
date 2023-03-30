"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subfoldersToCsvFiles = exports.folderToCsvFile = exports.folderToCsv = exports.folderToFileRecs = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const crypto_1 = __importDefault(require("crypto"));
const rxjs_1 = require("rxjs");
const observable_fs_1 = require("observable-fs");
const to_csv_1 = require("../../tools/csv/to-csv");
const pathToRepoMaster = 'https://github.com/pagopa/io-backend/blob/master';
function folderToFileRecs(folder, extensions) {
    return (0, observable_fs_1.filesObs)(folder).pipe((0, rxjs_1.filter)((fName) => {
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
    }), (0, rxjs_1.map)((fName) => {
        const pPath = parsePath(fName, folder);
        // calculate hash
        // https://ilikekillnerds.com/2020/04/how-to-get-the-hash-of-a-file-in-node-js/
        const fileBuffer = fs_1.default.readFileSync(fName);
        const hashSum = crypto_1.default.createHash('sha1');
        hashSum.update(fileBuffer);
        const hash = hashSum.digest('base64');
        const content = fileBuffer.toString();
        const lines = content.split(`\n`);
        const numLines = lines.length;
        const fileRec = {
            fullName: fName,
            folder,
            path: pPath.dir,
            name: pPath.base,
            numLines,
            hash,
            pathToRepo: pathToRepoMaster + pPath.dir + '/' + pPath.base,
        };
        const fRecWithCoontent = { fileRec, content };
        return fRecWithCoontent;
    }));
}
exports.folderToFileRecs = folderToFileRecs;
// remove the top folder from the file path and then parse the file path
// in this way we can get the path to the file, ignoring the top folder, i.e. relative to the folder where the repo has been placed
// Example
// fName = 'topFolder/repo1/src/file.txt
// folder = 'topFolder/repo1'
// the file path we parse is 'src/file.txt'
function parsePath(fName, folder) {
    const fNameNorm = path_1.default.normalize(fName);
    const folderNorm = path_1.default.normalize(folder);
    const fNameFromFolder = fNameNorm.substring(folderNorm.length);
    return path_1.default.parse(fNameFromFolder);
}
function folderToCsv(folder, extensions) {
    return folderToFileRecs(folder, extensions).pipe((0, rxjs_1.map)((rec) => rec.fileRec), (0, to_csv_1.toCsvObs)(), (0, rxjs_1.toArray)());
}
exports.folderToCsv = folderToCsv;
function folderToCsvFile(folder, csvFileName, extensions) {
    return folderToCsv(folder, extensions).pipe((0, rxjs_1.concatMap)((csvLines) => (0, observable_fs_1.writeFileObs)(csvFileName, csvLines)), (0, rxjs_1.tap)(() => console.log(`csv ${csvFileName} written for folder ${folder}`)));
}
exports.folderToCsvFile = folderToCsvFile;
// reads all the subfolders that are contained, at the top level, into the folder passed as parameter
// and for each of these subfolders writes a file with csv records for all its files
function subfoldersToCsvFiles(topFolder, outDir, concurrent = 10, extensions) {
    return (0, observable_fs_1.deleteDirObs)(outDir).pipe((0, rxjs_1.concatMap)(() => (0, observable_fs_1.dirNamesListObs)(topFolder)), (0, rxjs_1.concatMap)((dirs) => (0, rxjs_1.from)(dirs)), (0, rxjs_1.mergeMap)((dir) => {
        const dirFullPath = path_1.default.join(topFolder, dir);
        const csvFileName = path_1.default.join(outDir, `${dir}.csv`);
        return folderToCsvFile(dirFullPath, csvFileName, extensions);
    }, concurrent), (0, rxjs_1.toArray)());
}
exports.subfoldersToCsvFiles = subfoldersToCsvFiles;
//# sourceMappingURL=folder-to-csv.js.map