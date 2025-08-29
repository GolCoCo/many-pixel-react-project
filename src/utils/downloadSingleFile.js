const downloadSingleFile = (fileUrl, fileName, _Title, _, handleProgress, setAbort) => {
    const formattedFileName = fileName;

    const xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onprogress = (e) => {
        handleProgress(e.loaded / e.total * 100)
    }

    xhr.onload = () => {
        const a = document.createElement('a');
        a.href = window.URL.createObjectURL(xhr.response); // xhr.response is a blob
        a.download = formattedFileName;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };
    xhr.open('GET', fileUrl);
    xhr.send();
    
    if (setAbort) {
        setAbort(() => xhr.abort)
    }
};

export default downloadSingleFile;
