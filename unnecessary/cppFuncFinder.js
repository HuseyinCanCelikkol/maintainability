const fs = require('fs');
const readline = require('readline');
const { exec } = require('child_process');
const cppFile = 'cppfuncfinder';
const cppFunctionDeclareFinder = /\b(int|char|string|bool|float|double|void)\s+\w+\s*\([^()]*\)/;
const cppOperandFinder = /(int|float|double|bool)\s+([a-zA-Z_]\w*)|return\s+(\d+)|int\s+([a-zA-Z_]\w*)\s*,\s*([a-zA-Z_]\w*)\s*(?:,\s*([a-zA-Z_]\w*)\s*)?/g;
function buildRegexFromArray(arr) {
    const escapedArr = arr.map((item) => item.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const regexStr = `(${escapedArr.join('|')})`;
    return new RegExp(regexStr, 'g');
  }

function findFunctionsInFile(inputFilename, outputFilename) {

  const input = fs.createReadStream(inputFilename);
  const functionOutput = fs.createWriteStream(outputFilename);
  const operatorOutput = fs.createWriteStream("Operators.txt");
  const matchOutput = fs.createWriteStream("halstead.txt");
  const operandOutput = fs.createWriteStream("operands.txt")
  let functions = [];
  let operators = [];
  const rl = readline.createInterface({
    input: input,
    crlfDelay: Infinity
  });
  let foundFunction = 0;
  let foundOperator = 0;
  let functionOccurrence = 0;
  let operatorOccurrence = 0;
  rl.on('line', (line) => {
    const match = line.match(cppFunctionDeclareFinder);
    const match2 = line.match(cppOperandFinder);
    if (match) {
        match[0].trim();
        const trimmedCode = match[0].trim();; // Boşlukları kaldırır
        const startIndex = trimmedCode.indexOf(" "); // İlk boşluk karakterinin indeksini bulur
        const endIndex = trimmedCode.indexOf("("); // İlk açma parantezinin indeksini bulur
        const functionName = trimmedCode.substring(startIndex + 1, endIndex).trim();
       // console.log(functionName);
        functions.push(functionName);
        //functionOutput.write(`${functionName}\n`); 
        foundFunction+=1
        
    }
    if(match2){
        operandOutput.write(`${match2[0]}\n`);
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
        functionOccurrence += 1
      }
    });

    rl2.on('close', () => {
      matchOutput.write(`${foundFunction}\n` + `${functionOccurrence}\n`);

      input.close();
      functionOutput.close();
      operatorOutput.close();
      console.log('Fonksiyonlar başarıyla bulundu ve çıktı dosyasına yazıldı!');
      console.log('Bulunan fonksiyon sayısı =', foundFunction);
      console.log('Kullanılan toplam fonksiyon sayısı =', functionOccurrence);
      exec(`g++ ${cppFile}.cpp -o ${cppFile}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Compilation error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.error(`Compilation stderr: ${stderr}`);
          return;
        }
        
        console.log('Compilation successful. Running the C++ program...');
        
        // Replace './yourCppFile' with the actual name of the compiled C++ executable
        exec(`\cppfuncfinder`, (error, stdout, stderr) => {
          if (error) {
            console.error(`Execution error: ${error.message}`);
            return;
          }
          if (stderr) {
            console.error(`Execution stderr: ${stderr}`);
            return;
          }
          
          console.log('C++ program executed successfully.');
          console.log(stdout);
        });
      });
    });
  });
}

const inputFilename = 'example.txt';  // İşlenecek JavaScript kod dosyasının adı
const outputFilename = 'fonksiyonlar.txt';  // Fonksiyonların yazılacağı çıktı dosyasının adı (DEBUG)

findFunctionsInFile(inputFilename, outputFilename);