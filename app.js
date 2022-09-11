const URL = 'https://kasha-rages-db-default-rtdb.firebaseio.com/rages.json';

let sampleDate = {
	name: 'dupa',
	champion: 'Gnar',
	date: '08-10-2012',
};

fetch(URL)
	.then(res => res.json())
	.then(data => console.log(data));