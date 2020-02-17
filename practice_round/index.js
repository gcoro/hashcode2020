const path = process.argv[2];
const name = path.split('/')[path.split('/').length - 1].split('.')[0];
const fs = require('fs');
const now = require('performance-now');

const readContent = () => {
    return fs.readFileSync(path, 'utf8');
};

const writeToFile = (rows) => {
    fs.writeFileSync('./' + name + '.out', rows.join('\n'), 'utf8');
};

const parseInput = (contentToParse) => {
    const start = now();
    const lines = contentToParse.split('\n');
    const [max, differentTypes] = lines[0].split(' ');
    const pizzas = lines[1].split(' ');
    const end = now();
    console.log(`parseInput took ${(end - start).toFixed(3)} ms`);
    return { max, differentTypes, pizzas };
};

const parseOutput = (selectedPizzas) => {
    const start = now();
    const end = now();
    console.log(`parseOutput took ${(end - start).toFixed(3)} ms`);
    return [selectedPizzas.length.toString(), selectedPizzas.join(' ')];
};

const getResult = (max, pizzas) => {
    const start = now();

    const selected = [];
    let sum = 0;

    // reverse loop pizzas
    for (let i = pizzas.length - 1; i >= 0; i--) {
        if (sum + +pizzas[i] < +max) {
            sum = sum + +pizzas[i];
            selected.push(i);
        }
    }

    const end = now();
    console.log(`getResult took ${(end - start).toFixed(3)} ms`);
    return selected.reverse();
};

const content = readContent();
const { max, differentTypes, pizzas } = parseInput(content);
const selectedPizzas = getResult(max, pizzas);
const parsedOutput = parseOutput(selectedPizzas);
writeToFile(parsedOutput);