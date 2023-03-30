import { compareFoldersToCsvFile } from './internals/compare-folders-to-csv';
import { subfoldersToCsvFiles } from './internals/folder-to-csv';

export function foldersToCsvFiles(topFolder: string, outDir: string, extensions: string[]) {
    subfoldersToCsvFiles(topFolder, outDir, 10, extensions).subscribe({
        error: (err) => {
            throw err;
        },
    });
}

export function compFoldersToCsvFiles(
    folder: string,
    folderForComparison: string,
    outDir: string,
    extensions: string[],
) {
    compareFoldersToCsvFile(folder, folderForComparison, outDir, extensions).subscribe({
        error: (err) => {
            throw err;
        },
    });
}
