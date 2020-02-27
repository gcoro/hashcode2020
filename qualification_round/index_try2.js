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
	const [, totalLibraries, totalDays] = lines[0].split(' ');
	const books = lines[1].split(' ');
	//	.map((el, index) => ({ idBook: index, score: +el })); // nb if you uncomment, it breaks later
	// .sort((a, b) => b.score - a.score); // sorts from most score to less

	const libraries = [];
	let index = 0;

	for (let i = 0; index < +totalLibraries; i = i + 2) {
		const idLibrary = index;
		const [, signupDays, booksInADay] = lines[i + 2].split(' ');
		const booksInLibrary = lines[i + 3].split(' ')
			.map(el => ({ idBook: +el, score: +books[+el] }));
			// .sort((a, b) => b.score - a.score); // sorts from most score to less - not necessary in this case
		libraries.push({
			idLibrary, signupDays: +signupDays, booksInADay: +booksInADay, booksInLibrary
		});
		index++;
	}

	const end = now();
	console.log(`parseInput took ${(end - start).toFixed(3)} ms`);
	return { totalDays: +totalDays, libraries };
};

const parseOutput = (data) => {
	const start = now();
	const rows = [];
	rows.push(data.length);
	for (let i = 0, l = data.length; i < l; i++) {
		const { idLibrary, books } = data[i];
		rows.push(`${idLibrary} ${books.length}`);
		if(books.length > 0) rows.push(books.join(' '));
	}
	const end = now();
	console.log(`parsedOutput took ${(end - start).toFixed(3)} ms`);
	return rows;
};

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

    // make only one array of all books 
    const cumulativeBooksArr = libraries.reduce((acc, library) => {
        library.booksInLibrary.forEach(book => {
            // search if book is already in the array 
            const foundBook = acc.find(el => el.idBook === book.idBook);
            if(foundBook) { // if it is, we add the library ref
                foundBook.librariesBookIsIn.push(library.idLibrary);
            } else { // else we add it
                acc.push({...book, librariesBookIsIn: [library.idLibrary]});
            }
        });
        return acc;
    }, []); // we now have a list of all books, with the info of which library it's in

    libraries.forEach(el => el.booksRecomposed = []); // new attribute will be booksRecomposed

    // recompose the libraries putting the books just once, in the more convenient place
    cumulativeBooksArr.forEach(book =>{
        if(book.librariesBookIsIn.length === 1) { // book is only in one library, put it there
            const selectedLibrary = libraries.find(el => el.idLibrary === book.librariesBookIsIn[0]);
            selectedLibrary.booksRecomposed.push(book);
        } else { // book is in more libraries
            const minSignupDaysLibraryId = libraries.reduce((acc, el) => el.signupDays < acc.value ? 
            {id: el.idLibrary, value: el.signupDays} : acc,{id: null, value: Number.MAX_SAFE_INTEGER}).id;
            const selectedLibrary = libraries.find(el => el.idLibrary === minSignupDaysLibraryId);
            selectedLibrary.booksRecomposed.push(book);
        }
    });

    //console.log(JSON.stringify(libraries));

    // apply previous logic to order the books for score
    libraries.forEach(library => {
         library.booksRecomposed.sort((a, b) => b.score - a.score);
    });

    // order libraries for signup days
    libraries.sort((a, b) => a.signupDays - b.signupDays);

    // filter out empty libraries
	let filteredLibraries = libraries.filter(lib => lib.booksRecomposed.length !== 0);

	const results = filteredLibraries.map(el => ({
		idLibrary: el.idLibrary,
		books: el.booksInLibrary.map(book => book.idBook)
	}));

	const end = now();
	console.log(`getResult took ${(end - start).toFixed(3)} ms`);
	return results;
};

const content = readContent();
const { totalDays, libraries } = parseInput(content);
const result = getResult(totalDays, libraries);
const parsedOutput = parseOutput(result);
writeToFile(parsedOutput);