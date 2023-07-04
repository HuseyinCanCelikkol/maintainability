#include <iostream>
#include <fstream>
#include <regex>
#include <algorithm>
#include <vector>
#include <string>
#include <cstring>
int main(int argc, char *argv[]) {

    std::ifstream inputFile(argv[1]);
    if (!inputFile) {
        std::cerr << "Error opening input file: " << argv[1] << std::endl;
        return 1;
    }
    std::ofstream dataFile;
    std::vector<std::string> regexfound;
    std::vector<std::string> operandfound;

    std::regex cppRegex("(==|!=|<=|>=|\\+=|-=|\\*=|/=|%=|<<=|>>=|&=|\\^=|\\|=|\\+\\+|--|&&|\\|\\||\\||<<|\\(|\\)|>>|->|=|-|\\*|\\/|%|<|>|&|\\^|\\||\\{|int|char|string|bool|float|double|if|for|do|return|\\~|\\+|!)");
    std::regex pyRegex("(==|!=|<=|>=|\\+=|-=|\\*=|/=|%=|<<=|>>=|&=|\\^=|\\|=|\\+\\+|--|&&|\\|\\||\\||<<|\\(|\\)|>>|->|=|-|\\*|\\/|%|<|>|&|\\^|\\||\\{|if|for|do|try|catch|while|return|\\~|!)");
    std::regex jsRegex("(==|!=|<=|>=|\\+=|-=|\\*=|/=|%=|<<=|>>=|&=|\\^=|\\|=|\\+\\+|--|&&|\\|\\||\\||<<|\\(|\\)|>>|->|=|-|\\*|\\/|%|<|>|&|\\^|\\||\\{|if|for|do|try|forEach|catch|while|return|\\~|!)");
    std::regex regexPattern;

    if(std::strcmp(argv[2], "cpp") == 0){
        regexPattern = cppRegex;
        std::cout << "regex cpp";
    }
    
    if(std::strcmp(argv[2], "js") == 0){
        regexPattern = jsRegex;
    }
    
    if(std::strcmp(argv[2], "py") == 0){
        regexPattern = pyRegex;
    }

    int counter = 0;
    std::string line;
    while (std::getline(inputFile, line)) {
        std::smatch matches;
        std::smatch opeMatch;
        while (std::regex_search(line, matches, regexPattern)) {
            for (const auto& match : matches) {
                 auto it = std::find(regexfound.begin(), regexfound.end(), match);

                if (it != regexfound.end()) {
                    counter++;
                } else {
                    counter++;
                    regexfound.push_back(match);
                }
            }
            line = matches.suffix().str();
        }
    }
    inputFile.close();

    std::cout<< "operator_occurrence" << counter/2 << std::endl;
    std::cout<< "operator_count" << regexfound.size() << std::endl;

    return 0;
}