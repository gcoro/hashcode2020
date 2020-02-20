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
	const [totalBooks, totalLibraries, totalDays] = lines[0].split(' ');
	const books = lines[1].split(' ')
		.map((el, index) => ({ idBook: index, score: +el }))
		.sort((a, b) => b.score - a.score); // sorts from most score to less

	const libraries = [];
	let index = 0;

	for (let i = 0; index < +totalLibraries; i = i + 2) {
		const idLibrary = index;
		const [numberOfBooks, signupDays, booksInADay] = lines[i + 2].split(' ');
		const booksInLibrary = lines[i + 3].split(' ').map(el => +el);
		libraries.push({
			idLibrary, signupDays: +signupDays, booksInADay: +booksInADay, booksInLibrary
		});
		index++;
	}

	const end = now();
	console.log(`parseInput took ${(end - start).toFixed(3)} ms`);
	return { totalDays: +totalDays, books, libraries };
};

const parseOutput = (content) => {
	const start = now();
	const end = now();
	console.log(`parseOutput took ${(end - start).toFixed(3)} ms`);
	return // todo
};

const getResult = (totalDays, books, libraries) => {
	const start = now();
	console.log(JSON.stringify({ totalDays, books, libraries }));

	// todo
	const end = now();
	console.log(`getResult took ${(end - start).toFixed(3)} ms`);
	return // todo
};

const content = readContent();
const { totalDays, books, libraries } = parseInput(content);
const result = getResult(totalDays, books, libraries);
const parsedOutput = parseOutput(result);
writeToFile(parsedOutput);