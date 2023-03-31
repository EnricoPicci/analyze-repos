"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareFoldersToCsvFile = exports.compareFoldersToCsv = exports.compareFoldersToFileRecs = void 0;
const path_1 = __importDefault(require("path"));
const rxjs_1 = require("rxjs");
const diff_1 = require("diff");
const observable_fs_1 = require("observable-fs");
const to_csv_1 = require("../../tools/csv/to-csv");
const folder_to_csv_1 = require("./folder-to-csv");
function compareFoldersToFileRecs(folder, folderForComparison, extensions, pathToRepoMaster) {
    const fileRecs = (0, folder_to_csv_1.folderToFileRecs)(folder, extensions, pathToRepoMaster).pipe((0, rxjs_1.toArray)());
    const filesRecsForCompare = (0, folder_to_csv_1.folderToFileRecs)(folderForComparison, extensions, pathToRepoMaster).pipe((0, rxjs_1.toArray)());
    console.log('>>>>>>????****', folder, folderForComparison, extensions, pathToRepoMaster);
    return (0, rxjs_1.forkJoin)([fileRecs, filesRecsForCompare]).pipe((0, rxjs_1.map)(([fRecs, fRecsForCompare]) => {
        const fileRecs = fRecs.map((_fRec) => {
            const _fRecForCompare = fRecsForCompare.find((_fr) => _fr.fileRec.path === _fRec.fileRec.path && _fr.fileRec.name === _fRec.fileRec.name);
            _fRec.fileRec.new = _fRecForCompare === undefined;
            let dLines = [];
            if (_fRecForCompare) {
                const changes = (0, diff_1.diffLines)(_fRecForCompare.content, _fRec.content);
                if (changes) {
                    dLines = (0, diff_1.diffLines)(_fRecForCompare.content, _fRec.content)
                        .filter((change) => change.added || change.removed)
                        .map((change) => change.value);
                }
            }
            _fRec.fileRec.numDiffLines = dLines.length;
            return _fRec.fileRec;
        });
        return fileRecs;
    }), (0, rxjs_1.concatMap)((fRecs) => (0, rxjs_1.from)(fRecs)));
}
exports.compareFoldersToFileRecs = compareFoldersToFileRecs;
function compareFoldersToCsv(folder, folderForComparison, extensions, pathToRepoMaster) {
    return compareFoldersToFileRecs(folder, folderForComparison, extensions, pathToRepoMaster).pipe((0, to_csv_1.toCsvObs)(), (0, rxjs_1.toArray)());
}
exports.compareFoldersToCsv = compareFoldersToCsv;
function compareFoldersToCsvFile(folder, folderForComparison, outDir, extensions, pathToRepoMaster) {
    folder = path_1.default.normalize(folder);
    folderForComparison = path_1.default.normalize(folderForComparison);
    const csvFileName = path_1.default.join(outDir, `${folder.replace(/\//g, '_')}_vs_${folderForComparison.replace(/\//g, '_')}.csv`);
    return compareFoldersToCsv(folder, folderForComparison, extensions, pathToRepoMaster).pipe((0, rxjs_1.concatMap)((csvLines) => (0, observable_fs_1.writeFileObs)(csvFileName, csvLines)), (0, rxjs_1.tap)(() => {
        console.log(`csv ${csvFileName} written in directory ${outDir}`);
        console.log(`Folder ${folder} compared with folder ${folderForComparison}`);
    }));
}
exports.compareFoldersToCsvFile = compareFoldersToCsvFile;
//# sourceMappingURL=compare-folders-to-csv.js.map