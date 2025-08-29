import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const downloadFoldersAsZip = async (folders, zipName, onChangePercent, setAbort) => {
    const zip = new JSZip();

    const nbFiles = folders.reduce((p, folder) => {
      return p + folder.files.length
    }, 0);
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

    for (const f of folders) {
      const folder = zip.folder(f.name || 'folder');
      const files = f.files
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
            }).then((res) => {
              const contentLength = res.headers.get("content-length");
              let loaded = 0;
        
              return new Response(
                new ReadableStream({
                  start(controller) {
                    const reader = res.body.getReader();
        
                    read()
                    function read() {
                      reader.read()
                        .then((progressEvent) => {
                          if (progressEvent.done === true) {
                            controller.close();
                            return;
                          }
                          loaded = progressEvent.value.byteLength;
                          let downloadedPercent = loaded / contentLength;
                          addPercent(percentPart * downloadedPercent);
                          // console.log(downloadedPercent);
                          controller.enqueue(progressEvent.value);
                          read();
                        })
                    }
                  }
                })
              )
            });
;
            return response.blob();
        })
      );

      blobFiles.forEach((blobFile, index) => {
        folder.file(files[index].name, blobFile);
        addPercent(percentPart);
      });
    }

    if(percent < 100) {
      onChangePercent(100)
    }
    
    const blobZipFolder = await zip.generateAsync({ type: 'blob' });
    saveAs(blobZipFolder, `${zipName}.zip`);

    return blobZipFolder;
};

export default downloadFoldersAsZip;
