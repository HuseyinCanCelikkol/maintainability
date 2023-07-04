#include <iostream>
#include <string>
#include <fstream>
#include <istream>
#include <ostream>
#include <algorithm>
#include <cctype>
#include <vector>

bool FoundKey = false;
using namespace std;
ifstream Code;
string rowOfCode;
vector<string> CPP_KEYS = {"if(","while(","for(","?", "&&","||","case","default:"};
vector<string> PY_KEYS = {"if","while","for","?","&&","||","case","default"};
vector<string> JS_KEYS = {"if(","while(","for(","?","&&","||","case","default","forEach(","try{"};
vector<string> SELECTED_KEY;

int cyclomaticComplexityVal = 0;
int CodeLineVal=0;
int main(int argc, char* argv[]) {
    if (argc < 2) {
        cout << "Usage: " << argv[0] << " <filename>" << endl;
        return 1;
    }

    Code.open(argv[1]); // open the txt
    string language = argv[2];
    std::cout << argv[2];
    if(language == "js"){
        SELECTED_KEY = JS_KEYS;
        std::cout << "js selected";
        for(int i = 0;i<SELECTED_KEY.size();i++){
            cout << SELECTED_KEY[i] << ", ";
        }
    }
    else if(language == "cpp"){
        SELECTED_KEY = CPP_KEYS;
        cout << "cpp selected";
        for(int i = 0;i<SELECTED_KEY.size();i++){
            cout << SELECTED_KEY[i] << ", ";
        }
    }
    else if(language == "py"){
        SELECTED_KEY = PY_KEYS;
        cout << "py selected";
        for(int i = 0;i<SELECTED_KEY.size();i++){
            cout << SELECTED_KEY[i] << ", ";
        }
    }
    else{
        cout << "INVALID LANGUAGE" << endl;
    }

while(!Code.eof()){
    getline(Code, rowOfCode, '\n'); // take each line on temp.txt
    CodeLineVal++;
    rowOfCode.erase(remove_if(rowOfCode.begin(), rowOfCode.end(), ::isspace), rowOfCode.end()); // delete whitespaces
    //cout << rowOfCode << endl; //for printing your code

   for(int rowIterator = 0;rowIterator<rowOfCode.length();rowIterator++){ // i'th letter of row
        for(int keysIterator = 0;keysIterator<SELECTED_KEY.size();keysIterator++){
            if(FoundKey == true){ // if we found a key, it shouldn't continue to inspect current key. instead, it need to go find another one.
                FoundKey = false;
                break;
                } 
            if(SELECTED_KEY[keysIterator][0] == rowOfCode[rowIterator]){// if that keys first letter hits with current letter
                if(SELECTED_KEY[keysIterator][0] == SELECTED_KEY[3][0]){ // it cannot find ? operator. thats why i used that condition
                    cyclomaticComplexityVal++;
                    break;
                }
                
                
            int tempRowIterator = rowIterator+1; // temp row iterator. If it finds a key, simply goes afterwards of found key.
            for(int letterOfKeyIterator = 1;letterOfKeyIterator<SELECTED_KEY[keysIterator].size();letterOfKeyIterator++){ // here we controlling key and letter if really meshes together
                if(SELECTED_KEY[keysIterator][letterOfKeyIterator] == rowOfCode[tempRowIterator]){// if continues to mesh, just control until end
                    
                    if(letterOfKeyIterator == SELECTED_KEY[keysIterator].size()-1 && SELECTED_KEY[keysIterator].at(SELECTED_KEY[keysIterator].size()-1) == rowOfCode[tempRowIterator]){ // if last letter also meshes
                    if(keysIterator==6){
                        for(int i = 0;i<rowOfCode.length()-tempRowIterator;i++){
                            if(rowOfCode[tempRowIterator+i] == ':'){ // if finds : in same row after finding "case", it increases complexity +1.
                        cyclomaticComplexityVal++; // increase complexity value
                        rowIterator = tempRowIterator+1;// continue from afterwards of found key
                        FoundKey = true; // yeah that's what you're searching for. if i don't put that condition it continues to iterate keys. I and nobody don't want that
                        break;
                            }
                        }
                    }
                    else{
                        cyclomaticComplexityVal++; // increase complexity value
                        rowIterator = tempRowIterator+1;// continue from afterwards of found key
                        FoundKey = true; // yeah that's what you're searching for. if i don't put that condition it continues to iterate keys. I and nobody don't want that
                        break; // go out from letter iteration
                        }
                    }
                    tempRowIterator++;

                    }
                    else{break; // if any of letter doesn't obey order, just break and go 
                    }
                }
            }
            
        }
    }
}

cyclomaticComplexityVal = cyclomaticComplexityVal+1; // formula = found complexity + 1 
cout << "cyclomatic_complexity" << cyclomaticComplexityVal << endl; // thats the value
cout << "code_row_length" << CodeLineVal << endl;
Code.close(); // dont forget to close directory...
}
