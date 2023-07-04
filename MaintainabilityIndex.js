//operand finder.
const { execSync } = require('child_process');
const fs = require('fs');
const id = process.argv[2];
const lang = process.argv[3];
let code = process.argv[4];
function MaintainabilityIndexFinder(id, code, language){
   const myCode = Buffer.from(code, 'base64').toString('utf-8'); // decode base64 code
   const filename = `${id}.txt`; // assign id.txt
   try {
      fs.writeFileSync(filename, myCode); // write decoded code to txt

    } catch (err) {
      console.error('Error writing file:', err);
      return;
    }


   let regex = /\b([a-zA-Z_]\w*)\b/g; // find all words
   let CPP_KEYS = /(?:^|[^:.])\b(case|while|if|for|int|return|float|double|iostream|include|cout|cin|endl|std|void)\b(?![:.])/; //exclude these words for finding operands
   let PYTHON_KEYS = /\b(def|range|input|print|int|in|for|return|from|import|format|len|str|split|while|if|switch|case)\b/;
   let JS_KEYS = /\b(function|var|let|for|while|return|forEach|try|catch|const|require|if|switch|case)\b/;
   let SELECTED_KEY;
   if(language === `py`){
      SELECTED_KEY=PYTHON_KEYS;
   }
   else if(language === `cpp`){
      SELECTED_KEY = CPP_KEYS;
   }
   else if(language === `js`){
      SELECTED_KEY = JS_KEYS;

   }
   else{
      console.log("INVALID LANGUAGE");
      return -1;
   }
   let regexCount;
   let operatorCount;
   let cyclomaticComplexity;
   let codeLength;
   function runCppProgram() {
      try {
         execSync('g++ cppfuncfinder.cpp -o cppfuncfinder'); // Compile the C++ program
         const command = `\cppfuncfinder ${filename} ${language}`;
         const output = execSync(command).toString(); // Execute the compiled program
       
         // Extract the desired values from the C++ program output
          const operatorMatch = output.match(/operator_occurrence(\d+)/);
          operatorCount = operatorMatch ? parseInt(operatorMatch[1], 10) : 0;
       
         const regexMatch = output.match(/operator_count(\d+)/);
         regexCount = regexMatch ? parseInt(regexMatch[1], 10) : 0;
       
         console.log('Operator Occurrence:', operatorCount);
         console.log('Operator Count:', regexCount);
       } catch (error) {
         console.error('Error executing C++ program:', error);
       }
       
    }
    function runCyclomatic() {
      try {
         execSync('g++ cyclomaticComplexity.cpp -o cyclomaticComplexity'); // Compile the C++ program
         const command = `\cyclomaticComplexity ${filename} ${language}`;
         const output = execSync(command).toString(); // Execute the compiled program
       
         // Extract the desired values from the C++ program output
          const operatorMatch = output.match(/cyclomatic_complexity(\d+)/);
          cyclomaticComplexity = operatorMatch ? parseInt(operatorMatch[1], 10) : 0;
       
         const regexMatch = output.match(/code_row_length(\d+)/);
         codeLength = regexMatch ? parseInt(regexMatch[1], 10) : 0;
       
         //console.log('Operator Occurrence:', operatorCount);
        //console.log('Operator Count:', regexCount);
       } catch (error) {
         console.error('Error executing C++ program:', error);
       }
       
    }
   
   fs.open(filename, "r", (err, file) => {
      if (err) throw err;
   });
   
   let codeLines = fs.readFileSync(filename).toString();
   
   // Remove content within double quotation marks
   let codeWithoutQuotes = codeLines.replace(/"([^"\\]*(\\.[^"\\]*)*)"/g, "");
   
   var words = codeWithoutQuotes.match(regex);
   
   // SELECTED_KEY excluding
   var filteredWords = words.filter(word => !SELECTED_KEY.test(word));
   
   //console.log(filteredWords);
   var allOperands = [];
   
   filteredWords.forEach(element => {
      if(!allOperands.includes(element)){
         allOperands.push(element);
      }
   })
   //console.log(allOperands);
   runCppProgram()
   runCyclomatic()
   let operandCount = allOperands.length; // 
   let operandOccurrence = filteredWords.length;

   // Halstead Metrics
   let n1 = operatorCount; // Unique operator count
   let n2 = operandCount; // Unique operand count
   let N = n1 + n2; // Program length
   let n = n1 + n2; // Program vocabulary
   
   let V = N * Math.log2(n); // Program volume
   let D = n1 / (2 * n2); // Program difficulty
   let E = V * D;
   let exTime = E/18;
   let maintainabilityIndex = 171 - 5.2 * Math.log(V) - 0.23 * cyclomaticComplexity - 16.2 * Math.log(codeLength) 
   /*
   Maintainability Index - Calculates an index value between 0 and 100 that
   represents the relative ease of maintaining the code. A high value means
   better maintainability. Color coded ratings can be used to quickly identify
   trouble spots in your code. A green rating is between 20 and 100 and indicates 
   that the code has good maintainability. A yellow rating is between 10 and 19 and 
   indicates that the code is moderately maintainable. A red rating is a rating
    between 0 and 9 and indicates low maintainability.(https://learn.microsoft.com/en-us/visualstudio/code-quality/code-metrics-values?view=vs-2022)
   */
  let result = {
   codeLength:codeLength,
   halsteadVolume: V,
   operandCount:operandCount,
   operatorCount:operatorCount,
   halsteadDifficulty: D,
   halsteadEffort:E,
   halsteadEstimatedTime:exTime,
   cyclomaticComplexity: cyclomaticComplexity,
   maintainabilityIndex: maintainabilityIndex
  }
  return result;
}

let value = MaintainabilityIndexFinder(id,code,lang);

console.log(value);
