"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compFoldersToCsvFiles = exports.foldersToCsvFiles = void 0;
const compare_folders_to_csv_1 = require("./internals/compare-folders-to-csv");
const folder_to_csv_1 = require("./internals/folder-to-csv");
function foldersToCsvFiles(topFolder, outDir, extensions) {
    (0, folder_to_csv_1.subfoldersToCsvFiles)(topFolder, outDir, 10, extensions).subscribe({
        error: (err) => {
            throw err;
        },
    });
}
exports.foldersToCsvFiles = foldersToCsvFiles;
function compFoldersToCsvFiles(folder, folderForComparison, outDir, extensions, pathToRepoMaster) {
    (0, compare_folders_to_csv_1.compareFoldersToCsvFile)(folder, folderForComparison, outDir, extensions, pathToRepoMaster).subscribe({
        error: (err) => {
            throw err;
        },
    });
}
exports.compFoldersToCsvFiles = compFoldersToCsvFiles;
//# sourceMappingURL=commands.js.map