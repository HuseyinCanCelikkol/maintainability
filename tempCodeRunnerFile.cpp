#include <iostream>
#include <fstream>
#include <regex>

int main() {
    std::ifstream inputFile("example.txt");
    std::ofstream outputFile("operators.txt");

    std::regex regexPattern("(==|\\!=|<=|>=|\\+=|-=|\\*=|\\/=|%=|<<=|>>=|&=|\\^=|\\|=|\\+\\+|--|&&|\\|\\||\\||<<|\\[\\(|\\)|>>|->|==|!=|<=|>=|\\+|-|\\*|\\/|%|<|>|&|\\^|\\||=|}|int|char|string|bool|float|double|if|for|do|return|\\~|!)");
    int counter = 0;
    std::string line;
    while (std::getline(inputFile, line)) {
        std::smatch matches;
        while (std::regex_search(line, matches, regexPattern)) {
            for (const auto& match : matches) {
                outputFile << matches[0] << std::endl;
                counter++;
            }
            line = matches.suffix().str();
        }
    }

    inputFile.close();
    outputFile.close();
    std::cout << counter /2 << std::endl;
    return 0;
}