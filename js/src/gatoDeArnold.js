let newProcessedImage = new Image();

const imagesPath = {
  0: "../../assets/airplane.pgm",
};

const filterSelector = document.getElementById("input-filter");
const imgSelector = document.getElementById("img-selector");
let iterationText = document.getElementById("count-img");

let img = new Image();
let processedImg = new Image();

function compararArrays(array1, array2) {
  // Verificar o tamanho dos arrays
  if (array1.length !== array2.length) {
    return false;
  }

  // Percorrer os elementos dos arrays
  for (let i = 0; i < array1.length; i++) {
    // Comparar os valores dos elementos
    if (array1[i] !== array2[i]) {
      return false;
    }
  }

  // Se nenhum valor diferente foi encontrado, os arrays são iguais
  return true;
}

function gatoDeArnold(imagem, iteracoes) {
  // Obtém as dimensões da imagem
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
  return novaImagem;
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
    readImage("../assets/airplane.pgm", sketch, img);
    readImage("../assets/airplane.pgm", sketch, processedImg);
  };

  imgSelector.onchange = (_) =>
    readImage(imagesPath[imgSelector.value], sketch, img);
};

let processedCanvas = function (sketch) {
  sketch.setup = function () {
    sketch.createCanvas(256, 256).parent("processed-img");
  };

  filterSelector.onclick = function () {
    newProcessedImage.type = processedImg.type;
    newProcessedImage.w = processedImg.w;
    newProcessedImage.h = processedImg.h;
    newProcessedImage.data = processedImg.data;

    let iterarions = 0;
    gatoDeArnold(newProcessedImage.data, 1);
    function loopComTimeout() {
      // Condição de saída do loop
      if (_.isEqual(img.data, newProcessedImage.data, 1)) {
        return;
      }

      gatoDeArnold(newProcessedImage.data, 1);
      paintImage(sketch, newProcessedImage);

      iterationText.innerHTML = iterarions++;

      // Chama a função novamente após um certo período de tempo (1000ms = 1 segundo)
      setTimeout(loopComTimeout, 70);
    }

    loopComTimeout();

    // do {
    //   xx = gatoDeArnold(newProcessedImage.data, 1);
    //   paintImage(sketch, newProcessedImage);
    //   console.log('entrou', x);
    // } while (saoIguais(img, newProcessedImage));

    // paintImage(sketch, processedImg);
  };
};

new p5(mainCanvas, "p5sketch");
new p5(processedCanvas, "p5sketch");
