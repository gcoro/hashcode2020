const path = process.argv[2];
const name = path.split('/')[path.split('/').length - 1].split('.')[0];
const fs = require('fs');
const now = require('performance-now');

/**
 * scannedBooks = {
 * 	[idBook]: {}
 * }
 */
const scannedBookes = {}

/**
 * check if book was previously scanned
 * @param {*} idBook 
 */
const isBookScanned = (idBook) => {
	return !!scannedBookes[idBook]
}

/**
 * set book as scanned
 * @param {*} idBook 
 */
const setBookScanned = (idBook) => {
	scannedBookes[idBook] = {}
}

const printDebugOutput = (results, filename) => {
	fs.writeFileSync('./' + filename, JSON.stringify(results), 'utf8');
};

const readContent = () => {
	return fs.readFileSync(path, 'utf8');
};

const writeToFile = (rows) => {
	fs.writeFileSync('./' + name + '.out', rows.join('\n'), 'utf8');
};

writeToCustomFile = (content, filename) => {
	fs.writeFileSync('./' + filename + '.out', JSON.stringify(content), 'utf8');
};

const parseInput = (contentToParse) => {
	const start = now();
	const lines = contentToParse.split('\n');
	const [totalBooks, totalLibraries, totalDays] = lines[0].split(' ');
	const books = lines[1].split(' ');
	//	.map((el, index) => ({ idBook: index, score: +el })); // nb if you uncomment, it breaks later
	// .sort((a, b) => b.score - a.score); // sorts from most score to less

	const libraries = [];
	let index = 0;

	for (let i = 0; index < +totalLibraries; i = i + 2) {
		const idLibrary = index;
		const [numberOfBooks, signupDays, booksInADay] = lines[i + 2].split(' ');
		const booksInLibrary = lines[i + 3].split(' ')
			.map(el => ({ idBook: +el, score: +books[+el] }))
			.sort((a, b) => b.score - a.score); // sorts from most score to less
		libraries.push({
			idLibrary, signupDays: +signupDays, booksInADay: +booksInADay, booksInLibrary
		});
		index++;
	}

	const end = now();
	console.log(`parseInput took ${(end - start).toFixed(3)} ms`);
	return { totalDays: +totalDays, libraries };
};


const orderBySignupDays = (data) => {

	return data.sort( (a,b) => a.signupDays - b.signupDays)
}

const libraryScores = (totalDays, data) => {
		
	const result = JSON.parse(JSON.stringify(data))

	for(let i=0, l=result.length; i<l; i++) {
		const {signupDays, booksInLibrary, booksInADay} = result[i]
		const daysUtils = totalDays - signupDays;
		const maxIdx = Math.min([booksInLibrary.length-1, (booksInADay * daysUtils)]);

		const score = booksInLibrary.slice(0, maxIdx).reduce((accumulator, currentValue) => accumulator + parseInt(currentValue.score), 0);

		result[i].daysUtils = daysUtils;
		result[i].scoreInDaysUtils = score
	}

	return result.sort((a,b) => b.scoreInDaysUtils - a.scoreInDaysUtils);

}

/**
 * prepare output
 * @param {*} data 
 */
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

const getResult = (totalDays, libraries) => {
	/**
	 * 
	 * return = [
	 * 		{ idLibrary, books: [<idBook>] },....
	 * ]
	 * 
	 * @param {*} totalDays 
	 * @param {*} books 
	 * @param {*} libraries 
	 */
	const start = now();
	console.log(JSON.stringify({ totalDays, libraries }));


	const results = [
		{ idLibrary: 4, books: [2, 3, 4] },
		{ idLibrary: 2, books: [5, 6] },
		{ idLibrary: 1, books: [7] }
	];

	const sortedLibraries = orderBySignupDays(libraries);
	writeToCustomFile(sortedLibraries, 'sorted');

	const libraryScore = libraryScores(totalDays, sortedLibraries);
	writeToCustomFile(libraryScore, 'libraryScores');

	const end = now();
	console.log(`getResult took ${(end - start).toFixed(3)} ms`);
	return results;
};

const content = readContent();
const { totalDays, libraries } = parseInput(content);
const result = getResult(totalDays, libraries);
const parsedOutput = parseOutput(result);
writeToFile(parsedOutput);