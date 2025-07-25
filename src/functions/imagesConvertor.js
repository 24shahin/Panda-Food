export default function dataURLtoBlob(dataURL) {
  let dataString;
  if (dataURL.split(",")[0].indexOf("base64") >= 0) {
    dataString = atob(dataURL.split(",")[1]);
  } else {
    dataString = decodeURI(dataURL.split(",")[1]);
  }
  let mimeString = dataURL.split(",")[0].split(":")[1].split(";")[0];
  let image = new Uint8Array(dataString.length);
  for (let i = 0; i < dataString.length; i++) {
    image[i] = dataString.charCodeAt(i);
  }
  return new Blob([image], { type: mimeString });
}
