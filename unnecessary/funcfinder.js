const fs = require('fs');
const readline = require('readline');
const cppFunctionDeclareFinder = /\b(int|char|string|bool|float|double|void)\s+\w+\s*\([^()]*\)/;
let cppFunctionOccurrenceFinder;
const cppOperatorFinder = /(==|\!=|<=|>=|\+=|-=|\*=|\/=|%=|<<=|>>=|&=|\^=|\|=|\+\+|--|&&|[(]|\|\||<<|>>|->|==|!=|<=|>=|\+|-|\*|\/|%|<|>|&|\^|\||=|\~|!)/

const jsFunctionFinder = /^\s*function\s+([a-zA-Z_$][0-9a-zA-Z_$]*)\s*\(/;

const pyFunctionFinder =  /def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/gm;
function buildRegexFromArray(arr) {
    const escapedArr = arr.map((item) => item.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const regexStr = `(${escapedArr.join('|')})`;
    return new RegExp(regexStr, 'g');
  }

function findFunctionsInFile(inputFilename, outputFilename) {
  const functionRegex = /^\s*function\s+([a-zA-Z_$][0-9a-zA-Z_$]*)\s*\(/;

  const input = fs.createReadStream(inputFilename);
  const functionOutput = fs.createWriteStream(outputFilename);
  const operatorOutput = fs.createWriteStream("Operators.txt");
  let functions = [];
  const rl = readline.createInterface({
    input: input,
    crlfDelay: Infinity
  });
  let foundFunction = 0;
  let foundOperator = 0;
  rl.on('line', (line) => {
    const match = line.match(cppFunctionDeclareFinder);
    const match2 = line.match(cppOperatorFinder);
    if (match) {
        match[0].trim();
        const trimmedCode = match[0].trim();; // Boşlukları kaldırır
        const startIndex = trimmedCode.indexOf(" "); // İlk boşluk karakterinin indeksini bulur
        const endIndex = trimmedCode.indexOf("("); // İlk açma parantezinin indeksini bulur
        const functionName = trimmedCode.substring(startIndex + 1, endIndex).trim();
        console.log(functionName);
        functions.push(functionName);
        //functionOutput.write(`${functionName}\n`); 
        
        foundFunction+=1
    }
    if(match2){
        console.log(`${match2[0]}\n`)
        operatorOutput.write(`${match2[0]}\n`)
    }
  });

  rl.on('close', () => {
    const cppFunctionOccurrenceFinder = buildRegexFromArray(functions);
    const input2 = fs.createReadStream(inputFilename);
    const rl2 = readline.createInterface({
      input: input2,
      crlfDelay: Infinity
    });

    rl2.on('line', (line) => {
      const match2 = line.match(cppFunctionOccurrenceFinder);
      
      if (match2) {
        functionOutput.write(`${match2[0]}\n`);
      }
    });

    rl2.on('close', () => {
      input.close();
      functionOutput.close();
      operatorOutput.close();
      console.log('Fonksiyonlar başarıyla bulundu ve çıktı dosyasına yazıldı!');
      console.log('Bulunan fonksiyon sayısı =', foundFunction);
      console.log('Bulunan operator sayısı =', foundOperator);
    });
  });
}

const inputFilename = 'example.txt';  // İşlenecek JavaScript kod dosyasının adı
const outputFilename = 'fonksiyonlar.txt';  // Fonksiyonların yazılacağı çıktı dosyasının adı (DEBUG)

findFunctionsInFile(inputFilename, outputFilename);