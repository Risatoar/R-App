/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-sequences */
/** eslint-disabled */
// @ts-nocheck

function filterImageData(data: any) {
  let res = new Array(8 * 8 * 8 * 8).fill(0);
  let device = (val: any) => {
    let mapVal = 0;
    if (val > 223) {
      // [224 ~ 255]
      mapVal = 7;
    } else if (val > 191) {
      // [192 ~ 223]
      mapVal = 6;
    } else if (val > 159) {
      // [160 ~ 191]
      mapVal = 5;
    } else if (val > 127) {
      // [128 ~ 159]
      mapVal = 4;
    } else if (val > 95) {
      // [96 ~ 127]
      mapVal = 3;
    } else if (val > 63) {
      // [64 ~ 95]
      mapVal = 2;
    } else if (val > 31) {
      // [32 ~ 63]
      mapVal = 1;
    } else {
      // [0 ~ 31]
      mapVal = 0;
    }
    return mapVal;
  };
  for (let index = 0; index < data.length; index += 4) {
    let key =
      device(data[index]) * 8 * 8 * 8 +
      device(data[index + 1]) * 8 * 8 +
      device(data[index + 2]) * 8 +
      device(data[index + 3]);

    res[key] += 1;
  }
  return res;
}
// 余玄相似度
function vectorCosine(p1: any, p2: any) {
  if (p1.length != p2.length) return false;

  let fenzi = 0,
    sqrt1 = 0,
    sqrt2 = 0;
  for (let i = 0; i < p1.length; i++) {
    fenzi += p1[i] * p2[i];
    sqrt1 += p1[i] * p1[i];
    sqrt2 += Math.pow(p2[i], 2);
  }

  let res = fenzi / (Math.sqrt(sqrt1) * Math.sqrt(sqrt2));
  return res;
}

const loadImage = (src: string) =>
  new Promise((resolve) => {
    const img = new Image();

    img.src = src;

    img.onload = () => {
      resolve(img);
    };
  });

export const imageSimilarity = async (image1: any, image2: any) => {
  const imgData = [];

  for (const src of [image1, image2]) {
    const image = await loadImage(src);
    const canvas = document.createElement("canvas");

    canvas.width = 100;
    canvas.height = 100;

    const ctx = canvas.getContext("2d");
    ctx?.drawImage(image as any, 0, 0, 100, 100);
    let imageData = ctx?.getImageData(0, 0, 100, 100);

    const data = filterImageData(imageData?.data);

    imgData.push(data);
  }

  return vectorCosine(imgData[0], imgData[1]);
};

export const searchImage = async (imageUrl1, imageUrl2, tmplw, tmplh) => {
  const image1 = await loadImage(imageUrl1);
  const image2 = await loadImage(imageUrl2);
  var canvas = document.createElement("canvas"),
    ctx = canvas.getContext("2d"),
    sw = image1.width, // 原图宽度
    sh = image1.height, // 原图高度
    tw = tmplw || 8, // 模板宽度
    th = tmplh || 8; // 模板高度
  canvas.width = tw;
  canvas.height = th;
  ctx.drawImage(image1, 0, 0, sw, sh, 0, 0, tw, th);
  var pixels = ctx.getImageData(0, 0, tw, th);
  pixels = toGrayBinary(pixels, true, null, true);
  var canvas2 = document.createElement("canvas");
  var ctx2 = canvas2.getContext("2d");
  canvas2.width = tw;
  canvas2.height = th;
  ctx2.drawImage(image2, 0, 0, image2.width, image2.height, 0, 0, tw, th);
  var pixels2 = ctx2.getImageData(0, 0, tw, th);
  pixels2 = toGrayBinary(pixels2, true, null, true);
  var similar = 0;
  for (var i = 0, len = tw * th; i < len; i++) {
    if (pixels[i] == pixels2[i]) similar++;
  }
  similar = (similar / (tw * th)) * 100;
  return similar;
};

export const toGrayBinary = (pixels, binary, value, sn) => {
  var r,
    g,
    b,
    g,
    avg = 0,
    len = pixels.data.length,
    s = "";
  for (var i = 0; i < len; i += 4) {
    avg +=
      0.299 * pixels.data[i] +
      0.587 * pixels.data[i + 1] +
      0.114 * pixels.data[i + 2];
  }
  avg /= len / 4;
  for (var i = 0; i < len; i += 4) {
    (r = 0.299 * pixels.data[i]),
      (g = 0.587 * pixels.data[i + 1]),
      (b = 0.114 * pixels.data[i + 2]);
    if (binary) {
      if (r + g + b >= (value || avg)) {
        g = 255;
        if (sn) s += "1";
      } else {
        g = 0;
        if (sn) s += "0";
      }
      g = r + g + b > (value || avg) ? 255 : 0;
    } else {
      g = r + g + b;
    }
    (pixels.data[i] = g), (pixels.data[i + 1] = g), (pixels.data[i + 2] = g);
  }
  if (sn) return s;
  else return pixels;
};
