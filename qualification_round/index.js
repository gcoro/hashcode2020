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
		.map((el, index) => ({ idBook: index, score: +el }));
	// .sort((a, b) => b.score - a.score); // sorts from most score to less

	const libraries = [];
	let index = 0;

	for (let i = 0; index < +totalLibraries; i = i + 2) {
		const idLibrary = index;
		const [numberOfBooks, signupDays, booksInADay] = lines[i + 2].split(' ');
		const booksInLibrary = lines[i + 3].split(' ')
			// .map(el => ({ idBook: +el, score: }));
		libraries.push({
			idLibrary, signupDays: +signupDays, booksInADay: +booksInADay, booksInLibrary
		});
		index++;
	}

	const end = now();
	console.log(`parseInput took ${(end - start).toFixed(3)} ms`);
	return { totalDays: +totalDays, books, libraries };
};

const parseOutput = (data) => {
	const start = now();
	const rows = [];
	rows.push(data.length);
	for (let i = 0, l = data.length; i < l; i++) {
		const { idLibrary, books } = data[i];
		rows.push(`${idLibrary} ${books.length}`)
		rows.push(books.join(' '))
	}
	const end = now();
	console.log(`parsedOutput took ${(end - start).toFixed(3)} ms`);
	return rows;
}

const getResult = (totalDays, books, libraries) => {
	const start = now();
	console.log(JSON.stringify({ totalDays, books, libraries }));
	// todo
	const results = [
		{ idLibrary: 4, books: [2, 3, 4] },
		{ idLibrary: 2, books: [5, 6] },
		{ idLibrary: 1, books: [7] }
	];
	const end = now();
	console.log(`getResult took ${(end - start).toFixed(3)} ms`);
	return results;
};

const content = readContent();
const { totalDays, books, libraries } = parseInput(content);
const result = getResult(totalDays, books, libraries);
const parsedOutput = parseOutput(result);
writeToFile(parsedOutput);