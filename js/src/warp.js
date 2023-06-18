let gammaValue = 1;
let logScalarValue = 1;
let aValue = 1;
let bValue = 1;
let targetValue = 255;
let greyCenterValue = 127;
let sigmaValue = 25;

let maxValue = 255;
let minValue = 0;

let ttt = new Image();
var count = 0;

const negative = (r) => maxValue - r;
const gamma = (r) => Math.round(((1 + r) / maxValue) ** gammaValue * maxValue);
const logarithmic = (r) =>
  Math.round(logScalarValue * Math.log(1 + r / maxValue) * maxValue);
const linear = (r) => Math.round(aValue * r + bValue);
const dynamicRange = (r) => Math.round((r / maxValue) * targetValue);
const sigmoid = (r) =>
  Math.round(
    maxValue * (1 / (1 + Math.exp(-(r - greyCenterValue) / sigmaValue)))
  );

let currentOperator = null;

const operators = {
  1: negative,
  2: gamma,
  3: logarithmic,
  4: linear,
  5: dynamicRange,
  6: sigmoid,
};

const imagesPath = {
  0: "../../assets/lena.pgm",
  1: "../../assets/cameraman.pgm",
  2: "../../assets/airplane.pgm",
  3: "../../assets/pepper.pgm",
  4: "../../assets/brain.pgm",
  5: "../../assets/barbara.pgm",
  6: "../../assets/tyre.pgm",
  7: "../../assets/einstein.pgm",
  8: "../../assets/sea.pgm",
};

let kernelList = [];

const downloadBtn = document.getElementById("download-btn");

const filterSelector = document.getElementById("input-filter");
const inputMatrix = document.getElementById("input-matrix");
const inputMatrixValues = document.getElementsByName("array[]");
const imgSelector = document.getElementById("img-selector");

const normalizeSwitch = document.getElementById("normalizeSwitch");

let doNormalize = false;

let img = new Image();
let processedImg = new Image();

function gatoDeArnold(imagem, iteracoes) {
  // Obtém as dimensões da imagem
  count++;
  const altura = imagem.length;
  const largura = imagem[0].length;

  // Cria uma nova imagem para armazenar o resultado
  const novaImagem = new Array(altura);
  for (let i = 0; i < altura; i++) {
    novaImagem[i] = new Array(largura);
  }
  // Aplica a transformação de Arnold
  for (let k = 0; k < iteracoes; k++) {
    for (let y = 0; y < altura; y++) {
      for (let x = 0; x < largura; x++) {
        const novoX = (2 * x + y) % largura;
        const novoY = (x + y) % altura;
        novaImagem[novoY][novoX] = imagem[y][x];
      }
    }
    // Atualiza a imagem original com a imagem transformada
    for (let y = 0; y < altura; y++) {
      for (let x = 0; x < largura; x++) {
        imagem[y][x] = novaImagem[y][x];
      }
    }
  }

  // Retorna a imagem transformada
  console.log(count);
  return imagem;
}

function saoIguais(array1, array2) {
  // Verifica se os arrays têm o mesmo comprimento
  if (array1.length !== array2.length) {
    return false;
  }

  // Compara elemento por elemento
  for (let i = 0; i < array1.length; i++) {
    if (array1[i] !== array2[i]) {
      return false;
    }
  }

  // Se todos os elementos são iguais, retorna true
  return true;
}

const mainCanvas = function (sketch) {
  sketch.setup = function () {
    sketch.createCanvas(256, 256).parent("original-img");
    readImage("../assets/lena.pgm", sketch, img);
  };

  imgSelector.onchange = (_) =>
    readImage(imagesPath[imgSelector.value], sketch, img);
};

let processedCanvas = function (sketch) {
  sketch.setup = function () {
    sketch.createCanvas(256, 256).parent("processed-img");
  };

  filterSelector.onclick = function () {
    let value = filterSelector.value;

    processedImg.type = img.type;
    processedImg.w = img.w;
    processedImg.h = img.h;

    ttt.type = img.type;
    ttt.w = img.w;
    ttt.h = img.h;

    currentOperator = null;
    processedImg.data = img.data;

    ttt.data = img.data;
    const timer = setInterval(minhaFuncao, 70);
    setTimeout(() => {
      clearInterval(timer);
    }, 13440);
    function minhaFuncao() {
      let x = gatoDeArnold(ttt.data, 1);
      paintImage(sketch, processedImg);
    }

    paintImage(sketch, processedImg);
  };
};

new p5(mainCanvas, "p5sketch");
new p5(processedCanvas, "p5sketch");
