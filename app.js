// DOM Objects
const mainScreen = document.querySelector('.main-screen');

const pokemonName = document.querySelector('.pokemon-name');
const pokemonID = document.querySelector('.pokemon-id');
const pokemonFrontImage = document.querySelector('.pokemon-front-image');
const pokemonBackImage = document.querySelector('.pokemon-back-image');
const pokemonTypeOne = document.querySelector('.pokemon-type-one');
const pokemonTypeTwo = document.querySelector('.pokemon-type-two');
const pokemonWeight = document.querySelector('.pokemon-weight');
const pokemonHeight = document.querySelector('.pokemon-height');
const pokemonLists = document.querySelectorAll('.list-item');
const prevButton = document.querySelector('.left-button');
const nextButton = document.querySelector('.right-button');

let prevUrl = null;
let nextUrl = null;

// Functions ---> reset hide/mainscreen function
const resetScreen = () => {
    mainScreen.classList.remove('hide');
    const resetMain = mainScreen.classList.length;
    for(let i = 0; i < resetMain.length; i++) {
    mainScreen.classList.remove(mainScreen.classList[0]);
    }
    mainScreen.classList.add('main-screen');
}
// capitalize names/types
const capLetter = (str) => str[0].toUpperCase() + str.substr(1);

// get data for right side of screen
const fetchPokemonList = url => {
    fetch(url)
        .then(response => response.json())
        .then(data => {
         const { results, previous, next } = data;
         prevUrl = previous;
         nextUrl = next;

         for(let i = 0; i < pokemonLists.length; i++) {
            const pokemonList = pokemonLists[i];
            const resultData = results[i];
            const { name, url } = resultData;

            if(resultData) {
                const { name, url } = resultData;
                const urlArr = url.split('/');
                const id = urlArr[urlArr.length - 2];
                pokemonList.textContent = id + '. ' + capLetter(name);
            } else {
                pokemonList.textContent = '';
            }
        }
    });
};

// get data for left side of screen/hide
const fetchPokemonData = id => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    .then(response => response.json())
    .then(data => {
    resetScreen();
   
    const pokeTypes = data['types'];
    const pokeFirstType = pokeTypes[0];
    const pokeSecondType = pokeTypes[1];
    pokemonTypeOne.textContent = capLetter(pokeFirstType['type']['name']);
        if(pokeSecondType) {
            pokemonTypeTwo.classList.remove('hide');
            pokemonTypeTwo.textContent = capLetter(pokeSecondType['type']['name']);
        } else {
            pokemonTypeTwo.classList.add('hide');
            pokemonTypeTwo.textContent = '';
        }

    mainScreen.classList.add(pokeFirstType['type']['name']);
    mainScreen.classList.remove('hide');

    pokemonName.textContent = capLetter(data['name']);
    pokemonID.textContent = '#' + data['id'];
    pokemonWeight.textContent = data['weight'];
    pokemonHeight.textContent = data['height'];
    pokemonFrontImage.src = data['sprites']['front_default'] || ''; //set src to null if no img
    pokemonBackImage.src = data['sprites']['back_default'] || '';
});
}

// handleClick functions
const handlePrevButtonClick = () => {
    if(prevUrl) {
        fetchPokemonList(prevUrl);
    }
};

const handleNextButtonClick = () => {
    if(nextUrl) {
        fetchPokemonList(nextUrl);
    }
};

const handleListItemClick = (e) => {
    if(!e.target) return;

    const listItem = e.target;
    if(!listItem.textContent) return;
    
    const id = listItem.textContent.split('.')[0];
    fetchPokemonData(id);
};


// add eventListeners for buttons -- extract into function
prevButton.addEventListener('click', handlePrevButtonClick);
nextButton.addEventListener('click', handleNextButtonClick);
for(const pokeListItem of pokemonLists) {
    pokeListItem.addEventListener('click', handleListItemClick);
}


// start App
fetchPokemonList(`https://pokeapi.co/api/v2/pokemon?offset=0&limit=20`);


