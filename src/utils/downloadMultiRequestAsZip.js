import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const downloadMultiRequestAsZip = async (requests, zipName, onChangePercent, setAbort) => {
    const zip = new JSZip();
    const nbFiles = requests.reduce((c, request) => {
      const requestNumFiles = request.previews.reduce((p, folder) => {
        return p + folder.files.length
      }, 0);
      return requestNumFiles + c;
    }, 0)

    const percentPart = 100 / (2 * nbFiles);
    let percent = 0;
    const addPercent = completedPercent => {
        percent += completedPercent;
        if (onChangePercent) {
            onChangePercent(Math.ceil(percent));
        }
    };

    const controller  = new AbortController();
    const signal = controller.signal;
    const abort = () => {
      controller.abort()
    }

    if (setAbort) {
      setAbort(() => abort);
    }

    for (const request of requests) {
      const requestFolder = zip.folder(`#${request.id} - ${request.name}` || 'folder')
      const folders = request.previews;
      for (const f of folders) {
        const files = f.files
        const folder = requestFolder.folder(f.name)
        const blobFiles = await Promise.all(
          files.map(async file => {
            const response = await fetch(file.url, {
                  method: 'GET',
                  mode: 'cors',
                  cache: 'no-cache',
                  signal,
                  headers: {
                      Origin: window.location.origin,
                  },
              });
              addPercent(percentPart);
              return response.blob();
          })
        );
  
        blobFiles.forEach((blobFile, index) => {
          folder.file(files[index].name, blobFile);
          addPercent(percentPart);
        });
      }
    }
    
    const blobZipFolder = await zip.generateAsync({ type: 'blob' });
    saveAs(blobZipFolder, `${zipName}.zip`);

    return blobZipFolder;
};

export default downloadMultiRequestAsZip;
