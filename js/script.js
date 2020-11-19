const buttonTheme = document.getElementById('change-theme');
const inputSearch = document.getElementById('input__search');
const selectedSearch = document.getElementById('region');
const container__countries = document.getElementById('container__countries');
const container__country = document.getElementById('container__country');
const iconSelected = document.getElementById('iconSelected');
const iconTheme = document.getElementById('iconTheme');
let cards__countries;

const getCountriesByRegion = async (region) => {
    const countries = await fetch(`https://restcountries.eu/rest/v2/region/${region}`).then(data => data.json())
    return countries;
};

const getCountriesByName = async (name) => {
    const countries = await fetch(`https://restcountries.eu/rest/v2/name/${name}`).then(data => data.json())
    return countries;
}

const getCountriesByFullName = async (fullName) => {
    const country = await fetch(`https://restcountries.eu/rest/v2/name/${fullName}?fullText=true`).then(data => data.json());
    return country;
}

const getCountryByCode = async (codeCountry) => {
    const country = await fetch(`https://restcountries.eu/rest/v2/alpha/${codeCountry}`).then(data => data.json());
    return country;
}

const getCountriesAll = async () => {
    const countries = await fetch('https://restcountries.eu/rest/v2/all').then(data => data.json());
    return countries;
}

const createListFeature = (object) => {
    const fragment = document.createDocumentFragment();

    for (const key in object) {

        const li = document.createElement('li');
        const span = document.createElement('span');

        li.setAttribute('class', 'item');
        span.setAttribute('class', 'feature')

        span.textContent = key.replace(/_/g, ' ') + ': ';

        li.append(span);
        li.append(object[key]);
        fragment.append(li);
    }

    return fragment;
};

const showDetailCountry = async (countryFullName = null, countryCode = null) => {
    let country;

    if(countryFullName) {
        country = await getCountriesByFullName(countryFullName);
    } else if (countryCode) {
        country = await getCountryByCode(countryCode);
    }
    localStorage.setItem('countrySelected', JSON.stringify(country));
    location.pathname = '/API_countries/detail.html';
    // location.pathname = '/detail.html';
}

const createBorderCountries = (countries) => {

    const fragment = document.createDocumentFragment();

    countries.forEach(country => {
        const a = document.createElement('a');
        a.setAttribute('href', './detail.html');
        a.setAttribute('class', 'btn btn-countries');
        a.textContent = country;
        a.addEventListener('click', e => {
            e.preventDefault();
            showDetailCountry(null, country);
        });
        fragment.append(a);
    });

    return fragment;

};

const createCard = (urlFlag, country, features) => {

    const section = document.createElement('section');
    const card__img = document.createElement('div');
    const flag = document.createElement('img');
    const card__body = document.createElement('div');
    const card__title = document.createElement('h2');
    const card__features = document.createElement('ul');


    section.setAttribute('class', 'card__country');
    section.setAttribute('data-name', country);
    card__img.setAttribute('class', 'card__img');
    flag.setAttribute('class', 'flag');
    card__body.setAttribute('class', 'card__body');
    card__title.setAttribute('class', 'card__title');
    card__features.setAttribute('class', 'card__features');

    flag.src = urlFlag;
    flag.alt = country;

    card__img.append(flag);

    card__title.textContent = country;
    card__features.append(createListFeature(features));

    card__body.append(card__title);
    card__body.append(card__features);

    section.append(card__img);
    section.append(card__body);

    return section;
}

const paintCountry = async (region = null, name = null) => {
    if (container__countries) {

        let countries;
    
        if (region) {
            countries = await getCountriesByRegion(region);
        } else if (name) {
            countries = await getCountriesByName(name);
        } else {
            countries = await getCountriesAll();
        }
    
        
        if(Array.isArray(countries) && countries.length > 0) {
            
            const fragment = document.createDocumentFragment();
            countries.forEach(country => {
                const card = createCard(country.flag , country.name, {
                    Population : country.population,
                    Region : country.region,
                    Capital : country.capital
                });
                fragment.append(card);
            });

            container__countries.innerHTML = '';
            container__countries.append(fragment);

            cards__countries = document.getElementsByClassName('card__country');

            [...cards__countries].forEach(card => {
                card.addEventListener('click', e => {
                    showDetailCountry(card.getAttribute('data-name'))
                });
            });
        } else {
            container__countries.innerHTML = `
                <h2>Not found results for ${inputSearch.value}</h2>
            `;
        }
    }
};

const listCountriesBy = (searchBy, dataText) => {
    if (searchBy === 'region') {
        if (dataText != 'default') {
            paintCountry(dataText, null);
        } else {
            paintCountry();
        }
    } else if (searchBy === 'name') {
        if (dataText.length >= 3) {
            paintCountry(null, dataText);
        } else if (dataText.length == 2) {
            paintCountry();
        }
    }
}

if (selectedSearch) {
    selectedSearch.addEventListener('change', e => {
        let region = selectedSearch.options[selectedSearch.selectedIndex].value;
        inputSearch.value = '';
        listCountriesBy('region', region);
    });
}

if (inputSearch) {
    inputSearch.addEventListener('keyup', e => {
        listCountriesBy('name', e.target.value);
    });
    
    inputSearch.addEventListener('change', e => {
        listCountriesBy('name', e.target.value);
    });
}

paintCountry();


buttonTheme.addEventListener('click', e => {
    if(localStorage.getItem('theme')) {
        let theme = JSON.parse(localStorage.getItem('theme'));
        if(theme === 'light') {
            document.body.classList.add('dark');
            iconTheme.setAttribute('src', `./img/moon-regular-dark.svg`);
            localStorage.setItem('theme', JSON.stringify('dark'));
        } else if (theme === 'dark') {
            document.body.classList.remove('dark');
            iconTheme.setAttribute('src', `./img/moon-regular.svg`);
            localStorage.setItem('theme', JSON.stringify('light'));
        }
    } else {
        document.body.classList.toggle('dark');
        if (document.body.classList.contains('dark')) {
            document.body.classList.add('dark');
            iconTheme.setAttribute('src', `./img/moon-regular-dark.svg`);
            localStorage.setItem('theme', JSON.stringify('dark'));
        } else {
            document.body.classList.remove('dark');
            iconTheme.setAttribute('src', `./img/moon-regular.svg`);
            localStorage.setItem('theme', JSON.stringify('light'));
        }
    }
});



if (container__country) {

    const data = JSON.parse(localStorage.getItem('countrySelected'));

    let flag, name, nativeName, population, region, subregion, capital, topLevelDomain, currencies, lenguages, bordersCountries;

    if (Array.isArray(data) && data) {

        flag = data[0].flag;
        name = data[0].name;
        nativeName = data[0].nativeName;
        population = data[0].population;
        region = data[0].region;
        subregion = data[0].subregion;
        capital = data[0].capital;
        
        topLevelDomain = data[0].topLevelDomain;
        currencies = data[0].currencies[0].name;
        lenguages = data[0].languages.map(lenguage => {
            return lenguage.name;
        });
        
        bordersCountries = data[0].borders;

    } else {
        
        flag = data.flag;
        name = data.name;
        nativeName = data.nativeName;
        population = data.population;
        region = data.region;
        subregion = data.subregion;
        capital = data.capital;
        
        topLevelDomain = data.topLevelDomain;
        currencies = data.currencies[0].name;
        lenguages = data.languages.map(lenguage => {
            return lenguage.name;
        });

        bordersCountries = data.borders;

    }

    const feature__primary = {
        'Native_Name' : nativeName,
        'Population' : population,
        'Region' : region,
        'Sub_Region' : subregion,
        'Capital' : capital
    }

    const feature__secondary = {
        'Top_Level_Domain' : topLevelDomain.join(' '),
        'Curriencies' : currencies,
        'Lenguages' : lenguages.join(' ')
    }

    const cardDetailFlag = document.getElementById('card-detail__flag');
    const cardDetailTitle = document.getElementById('card-detail__title');
    const cardFeaturePrimary = document.getElementById('card__features--primary');
    const cardFeatureSecondary = document.getElementById('card__features--secondary');
    const borderCountries = document.getElementById('border__countries');

    cardDetailFlag.setAttribute('src', flag);
    cardDetailFlag.setAttribute('alt', name);

    cardDetailTitle.textContent = name;

    cardFeaturePrimary.innerHTML = '';
    cardFeaturePrimary.append(createListFeature(feature__primary));
    cardFeatureSecondary.innerHTML = '';
    cardFeatureSecondary.append(createListFeature(feature__secondary));
    
    borderCountries.innerHTML = '';
    borderCountries.append(createBorderCountries(bordersCountries));

}

if (localStorage.getItem('theme')) {
    const theme = JSON.parse(localStorage.getItem('theme'));
    if(theme === 'light') {
        document.body.classList.remove('dark');
        iconTheme.setAttribute('src', `./img/moon-regular.svg`);
    } else if (theme === 'dark') {
        document.body.classList.add('dark');
        iconTheme.setAttribute('src', `./img/moon-regular-dark.svg`);
    }
}