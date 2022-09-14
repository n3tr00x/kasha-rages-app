import champions from './champions.js';

const setPresentDay = () => {
	const date = new Date();
	const result = date.toLocaleDateString('af-ZA', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	});
	document.querySelector('.input__field--date').value = result;
};

const assignChampionsToDatalist = () => {
	for (const iterator of champions) {
		const option = document.createElement('option');
		option.setAttribute('value', iterator);
		document.querySelector('#champions').appendChild(option);
	}
};

const dataHandler = () => {
	const date = document.querySelector('.input__field--date');
	const champion = document.querySelector('.input__field--champion');
	const description = document.querySelector('.input__field--desc');

	let errorsState = {};

	if (!checkChampionValidity(champion.value)) {
		errorsState = {
			...errorsState,
			championError: 'Wpisz poprawną nazwę postaci!',
		};
	}

	if (!description.value) {
		errorsState = {
			...errorsState,
			descError: 'Wpisz opis inwektywy',
		};
	}

	if (Object.keys(errorsState).length) throw errorsState;

	return {
		id: Date.now(),
		date: new Date(date.value).toISOString().slice(0, 10),
		champion: champion.value,
		description: description.value,
	};
};

const submitData = async event => {
	event.preventDefault();

	const form = document.querySelector('.form-container');
	const errorModal = document.querySelector('.error-container');

	try {
		await fetch('https://sheetdb.io/api/v1/uprq1nzevlt46', {
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(dataHandler()),
		});
		modalHandler({ text: 'Pomyślnie przesłano formularz!' });
	} catch (error) {
		console.error(error);

		formErrorHandler();
		modalHandler(error);
	}

	resetInputs();
};

const formErrorHandler = () => {
	const form = document.querySelector('.form-container');

	form.classList.add('error');
	setTimeout(() => {
		form.classList.remove('error');
	}, 201);
};

const modalHandler = error => {
	const modal = document.querySelector('.modal');

	modal.classList.add('show');

	for (const value of Object.values(error)) {
		const p = document.createElement('p');
		p.classList.add('modal__message');
		p.textContent = value;
		modal.appendChild(p);
	}

	const messages = document.getElementsByClassName('modal__message');

	setTimeout(() => {
		modal.classList.remove('show');
		Array.from(messages).forEach(child => child.remove());
	}, 1500);
};

const checkChampionValidity = value => {
	if (champions.includes(value)) return true;
	return false;
};

const resetInputs = () => {
	document.querySelectorAll('.input__field').forEach(field => (field.value = ''));
	setPresentDay();
};

const init = () => {
	setPresentDay();
	assignChampionsToDatalist();
	document.querySelector('.submit-btn').addEventListener('click', submitData);
};

init();
