const buttonTheme = document.getElementById('change-theme');
const inputSearch = document.getElementById('input__search');
const selectedSearch = document.getElementById('region');
const mainContainer = document.getElementById('main__container');
const iconSelected = document.getElementById('iconSelected');
const iconTheme = document.getElementById('iconTheme');
let cards__countries;
let theme = 'light';

const getCountriesByRegion = async (region) => {
    const countries = await fetch(`https://restcountries.eu/rest/v2/region/${region}`).then(data => data.json())
    return countries;
};

const getCountriesByName = async (name) => {
    const countries = await fetch(`https://restcountries.eu/rest/v2/name/${name}`).then(data => data.json())
    return countries;
}

const getCountriesAll = async () => {
    const countries = await fetch('https://restcountries.eu/rest/v2/all').then(data => data.json());
    return countries;
}

const createCard = (urlFlag, country, features) => {

    const section = document.createElement('section');
    const card__img = document.createElement('div');
    const flag = document.createElement('img');
    const card__body = document.createElement('div');
    const card__title = document.createElement('h2');
    const card__features = document.createElement('ul');

    section.setAttribute('class', 'card__country');
    section.setAttribute('data-name', country);

    flag.setAttribute('class', 'flag');
    flag.src = urlFlag;
    flag.alt = country;

    card__img.setAttribute('class', 'card__img');
    card__img.append(flag);

    card__title.setAttribute('class', 'card__title');
    card__title.textContent = country;

    card__features.setAttribute('class', 'card__features');
    for (const key in features) {
        const li__feature = document.createElement('li');
        const span = document.createElement('span');
        li__feature.setAttribute('class', 'item');
        span.setAttribute('class', 'feature');
        span.textContent = key + ':';
        li__feature.append(span);
        li__feature.append(' '+features[key]);
        card__features.append(li__feature);
    }

    card__body.append(card__title);
    card__body.append(card__features);
    card__body.setAttribute('class', 'card__body');

    section.append(card__img);
    section.append(card__body);

    return section;
}

const paintCountry = async (region = null, name = null) => {
    let countries;

    if (region) {
        countries = await getCountriesByRegion(region);
    } else if (name) {
        countries = await getCountriesByName(name);
    } else {
        countries = await getCountriesAll();
    }

    const fragment = document.createDocumentFragment();

    if(countries.length > 0) {
        countries.forEach(country => {
            const card = createCard(country.flag , country.name, {
                Population : country.population,
                Region : country.region,
                Capital : country.capital
            });
            fragment.append(card);
        });
        mainContainer.innerHTML = '';
        mainContainer.append(fragment);
        cards__countries = document.getElementsByClassName('card__country');
        [...cards__countries].forEach(card => {
            card.addEventListener('click', e => {
                localStorage.setItem('countrySelected', {
                    name : card.getAttribute('data-name')
                });
                location.pathname = '/detail.html';
            });
        });
    } else {
        mainContainer.innerHTML = `
            <h2>Not found results for ${inputSearch.value}</h2>
        `;
    }
};

selectedSearch.addEventListener('change', e => {
    let region = selectedSearch.options[selectedSearch.selectedIndex].value;
    inputSearch.value = '';
    if (region != 'default') { 
        paintCountry(region, null);
    } else {
        paintCountry();
    }
});

inputSearch.addEventListener('keyup', e => {
    const name = e.target.value;
    if (name.length >= 3) { 
        paintCountry(null, name);
    } else if (name.length == 2) {
        paintCountry();
    }
});

inputSearch.addEventListener('cl', e => {
    const name = e.target.value;
    if (name.length >= 3) { 
        paintCountry(null, name);
    } else if (name.length == 2) {
        paintCountry();
    }
});

paintCountry();

buttonTheme.addEventListener('click', e => {
    document.body.classList.toggle('dark');
    if (document.body.classList.contains('dark')) {
        iconTheme.setAttribute('src', `./img/moon-regular-dark.svg`);
    } else {
        iconTheme.setAttribute('src', `./img/moon-regular.svg`);
    }
});