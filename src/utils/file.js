function urlToImage(url, fn) {
  var img = new Image();
  img.src = url;
  img.onload = function () {
    fn(img);
  };
}

function imageToCanvas(image) {
  var cvs = document.createElement("canvas");
  var ctx = cvs.getContext("2d");
  cvs.width = image.width;
  cvs.height = image.height;
  ctx && ctx.drawImage(image, 0, 0, cvs.width, cvs.height);
  return cvs;
}

function canvasResizeToFile(file, canvas, quality, fn) {
  canvas.toBlob(
    function (blob) {
      fn(
        new window.File([blob], file.name, {
          type: "image/jpeg",
          lastModified: file.lastModified,
        })
      );
    },
    "image/jpeg",
    quality
  );
}

function canvasResizeToDataUrl(canvas, quality) {
  return canvas.todataurl("image/jpeg", quality);
}

function fileToDataUrl(file, fn) {
  var reader = new FileReader();
  reader.onloadend = function (e) {
    fn(e.target.result);
  };
  reader.readAsDataURL(file);
}

function dataUrlToImage(dataurl, fn) {
  var img = new Image();
  img.src = dataurl;
  img.onload = function () {
    fn(img);
  };
}

function dataUrlToFile(dataUrl) {
  var arr = dataUrl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

function fileResizeToFile(file, quality, fn) {
  if (quality === 1) {
    fn(file);
  }
  fileToDataUrl(file, function (dataurl) {
    dataUrlToImage(dataurl, (image) => {
      canvasResizeToFile(file, imageToCanvas(image), quality, fn);
    });
  });
}

const FileUtils = {
  fileResizeToFile,
  dataUrlToFile,
  dataUrlToImage,
  fileToDataUrl,
  canvasResizeToFile,
  canvasResizeToDataUrl,
  imageToCanvas,
  urlToImage,
};

export default FileUtils;
