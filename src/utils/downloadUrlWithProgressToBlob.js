const downloadUrlWithProgressToBlob = async (url, onProgress, setAbort) => {
  const encodedUrl = encodeURI(url);
  const controller = new AbortController();
  const signal = controller.signal;
  const response = await fetch(encodedUrl, {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    signal,
    headers: {
      Origin: window.location.origin,
    },
  });

  const reader = response.body.getReader();
  const contentLength = +response.headers.get('Content-Length');

  let receivedLength = 0;
  let chunks = [];
  let oldReceived = 0;
  let octBySeconds = 0;
  let downloadTimeoutCounter = 0;
  const intervalCalculateBySec = setInterval(() => {
    const calculatedOctBySeconds = (receivedLength - oldReceived);
    oldReceived = receivedLength;
    if (calculatedOctBySeconds === 0) {
      downloadTimeoutCounter++;
    } else {
      octBySeconds = calculatedOctBySeconds;
      downloadTimeoutCounter = 0;
    }
    if (downloadTimeoutCounter >= 5) {
      octBySeconds = calculatedOctBySeconds;
    }

    if (onProgress) {
      onProgress({
        received: receivedLength,
        total: contentLength,
        octBySeconds,
        intervalCalculateBySec,
      });
    }
  }, 1000);

  const abort = () => {
    controller.abort()
    clearInterval(intervalCalculateBySec);
  }

  if (setAbort) {
    setAbort(() => abort)
  }
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      if (onProgress) {
        onProgress({
          received: receivedLength,
          total: contentLength,
        })
      }
      break;
    }
    chunks.push(value);
    receivedLength += value.length;
  }

  clearTimeout(intervalCalculateBySec);
  return new Blob(chunks);
};

export default downloadUrlWithProgressToBlob;
