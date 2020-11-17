const buttonTheme = document.getElementById('change-theme');
const inputSearch = document.getElementById('input__search');
const selectedSearch = document.getElementById('region');
const mainContainer = document.getElementById('main__container');

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

    flag.src = urlFlag;
    flag.alt = country;
    flag.setAttribute('class', 'flag');

    card__img.append(flag);
    card__img.setAttribute('class', 'card__img');

    card__title.textContent = country;
    card__title.setAttribute('class', 'card__title');

    card__features.setAttribute('class', 'card__features');
    for (const key in features) {
        const li__feature = document.createElement('li');
        const strong = document.createElement('strong');
        li__feature.setAttribute('class', 'item');
        strong.setAttribute('class', 'feature');
        strong.textContent = key + ':';
        li__feature.append(strong);
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
    } else {
        paintCountry();
    }
});

paintCountry();