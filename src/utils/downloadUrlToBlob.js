const downloadUrlToBlob = async (url) => {
  const response = await fetch(url, {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      Origin: window.location.origin,
    },
  });
  return response.blob();
};

export default downloadUrlToBlob;
