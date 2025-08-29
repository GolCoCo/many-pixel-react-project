import JSZip from 'jszip';
import { saveAs } from 'file-saver';

/**
 * Seacrh in a folder if the file is preset or not
 * @param {Object[]} folder List of files present in the folder
 * @param {String} filename The name of the file to search
 * @return {Boolean} Return true if the file is in this folder or else false
 * */

const searchInFolder = (folder, fileid) => {
    if (folder.length === 0) {
        return false;
    }

    const find = folder.find(f => f.id === fileid);

    return find !== undefined;
};

const downloadBrandAsZip = async (logos, guides, fonts, extra, folderName, onChangePercent) => {
    const zip = new JSZip();
    const folderNestedName = ['logos', 'guides', 'fonts', 'extra'];
    const nbFiles = logos.length + guides.length + fonts.length + extra.length;
    const percentPart = 100 / (2 * nbFiles);
    let percent = 0;
    const addPercent = completedPercent => {
        percent += completedPercent;
        if (onChangePercent) {
            onChangePercent(percent);
        }
    };

    // Link all the file together for keeping the organization of the previous developer
    const files = [...logos, ...guides, ...fonts, ...extra];
    const blobFiles = await Promise.all(
        files.map(async file => {
            const response = await fetch(file.url, {
                method: 'GET',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    Origin: window.location.origin,
                },
            });
            addPercent(percentPart);
            return response.blob();
        })
    );

    blobFiles.forEach((blobFile, index) => {
        const fileid = files[index].id;

        // Search in which folder the files is part of
        const searchFolder = [
            searchInFolder(logos, fileid),
            searchInFolder(guides, fileid),
            searchInFolder(fonts, fileid),
            searchInFolder(extra, fileid),
        ];

        // Get the index from the only folder returning true
        const folderIndex = searchFolder.findIndex(f => f);

        zip.file(`${folderNestedName[folderIndex]}/${files[index].name}`, blobFile);
        addPercent(percentPart);
    });

    const blobZipFolder = await zip.generateAsync({ type: 'blob' });
    saveAs(blobZipFolder, `${folderName}.zip`);

    return blobZipFolder;
};

export default downloadBrandAsZip;
