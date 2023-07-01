#include <iostream>
#include <fstream>
#include <regex>
#include <algorithm>
#include <vector>
#include <string>

int main(int argc, char *argv[]) {

    std::ifstream inputFile(argv[1]);
    if (!inputFile) {
        std::cerr << "Error opening input file: " << argv[1] << std::endl;
        return 1;
    }
    /* std::ifstream inputFile("example.txt"); */
/*     std::ofstream outputFile("Operatorsss.txt");
    std::ofstream operandFile("operands.txt"); */
    
    std::ofstream dataFile;
    std::vector<std::string> regexfound;
    std::vector<std::string> operandfound;
/*     dataFile.open("halstead.txt", std::ios_base::app); */
    std::regex cppRegex("(==|\\!=|<=|>=|\\+=|-=|\\*=|\\/=|%=|<<=|>>=|&=|\\^=|\\|=|\\+\\+|--|&&|\\|\\||\\||<<|\\[\\(|\\)|>>|->|==|!=|<=|>=|\\+|-|\\*|\\/|%|<|>|&|\\^|\\||=|}|int|char|string|bool|while|float|double|if|for|do|return|\\~|!)");
    std::regex pyRegex("(==|\\!=|<=|>=|\\+=|-=|\\*=|\\/=|%=|<<=|>>=|&=|\\^=|\\|=|\\+\\+|--|&&|\\|\\||\\||<<|\\[\\(|\\)|>>|->|==|!=|<=|>=|\\+|-|\\*|\\/|%|<|>|&|\\^|\\||=|}|if|for|do|try|catch|while|return|\\~|!)");
    std::regex jsRegex("(==|\\!=|<=|>=|\\+=|-=|\\*=|\\/=|%=|<<=|>>=|&=|\\^=|\\|=|\\+\\+|--|&&|\\|\\||\\||<<|\\[\\(|\\)|>>|->|==|!=|<=|>=|\\+|-|\\*|\\/|%|<|>|&|\\^|\\||=|}|if|for|forEach|do|try|catch|while|return|\\~|!)");;
    std::regex regexPattern;

    if(argv[2] == "cpp"){
        regexPattern = cppRegex;
    }
    
    if(argv[2] == "js"){
        regexPattern = jsRegex;
    }
    
    if(argv[2] == "py"){
        regexPattern = pyRegex;
    }
    
/*   
  std::regex operandRegex("/(int|float|double|bool)\\s+([a-zA-Z_]\\w*)|return\\s+(\\d+)|int\\s+([a-zA-Z_]\\w*)\\s*,\\s*([a-zA-Z_]\\w*)\\s*(?:,\\s*([a-zA-Z_]\\w*)\\s*)?/g");
    std::regex operandfinder("\b([a-zA-Z_]\\w*)\b\\s*=\\s*\1\b"); */
    int counter = 0;
    std::string line;
    while (std::getline(inputFile, line)) {
        std::smatch matches;
        std::smatch opeMatch;
        while (std::regex_search(line, matches, regexPattern)) {
            for (const auto& match : matches) {
                 auto it = std::find(regexfound.begin(), regexfound.end(), match);

                if (it != regexfound.end()) {
                    //std::cout << "Vector contains " << match << std::endl;
                    counter++;
                } else {
                   // std::cout << "Vector does not contain " << match << std::endl;
                    /* outputFile << match << std::endl; */
                    counter++;
                    regexfound.push_back(match);
                }
            }
            line = matches.suffix().str();
        }
    }

    inputFile.close();
    /* outputFile.close(); */
/*     dataFile << counter /2 << std::endl;
    dataFile << regexfound.size() << std::endl; */
    
    std::cout<< "operator_occurrence" << counter/2 << std::endl;
    std::cout<< "operator_count" << regexfound.size() << std::endl;

    return 0;
}