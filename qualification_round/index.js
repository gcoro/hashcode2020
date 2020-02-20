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

	const end = now();
	console.log(`parseInput took ${(end - start).toFixed(3)} ms`);
	return // todo
};

const parseOutput = (content) => {
	const start = now();
	const end = now();
	console.log(`parseOutput took ${(end - start).toFixed(3)} ms`);
	return // todo
};

const getResult = () => {
	const start = now();
	// todo
	const end = now();
	console.log(`getResult took ${(end - start).toFixed(3)} ms`);
	return // todo
};

const content = readContent();
const a = parseInput(content);
const result = getResult(a);
const parsedOutput = parseOutput(result);
writeToFile(parsedOutput);