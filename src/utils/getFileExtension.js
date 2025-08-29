
export const isExtensionImage = (extension) => ['.png','.jpg','.jpeg','.svg'].indexOf(extension) > -1;

export default (filename) => {
  const regex = /(?:\.([^.]+))?$/;
  const [extension] = regex.exec(filename);
  return extension;
};
