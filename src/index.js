import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;
const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');



function onInputForm() {
    const nameCountry = input.value.trim();

    countryList.innerHTML = '';
    countryInfo.innerHTML = '';

    if (!nameCountry) {
        return;
    }

    fetchCountries(nameCountry)
        .then((item) => {

            if (item.length > 10) {
                Notiflix.Notify.info('Too many matches found. Please enter a more specific name');
                return;
            }
            if (item.length === 1) {
                renderCountryInfo(item);
                return;
            }
            if (item.length > 1) {
                renderCountriesList(item);
                return;
            }
            renderCountryInfo(item);
        })
        .catch(error => {
            return Notiflix.Notify.failure("Oops, there is no country with that name");
        })
}

input.addEventListener('input', debounce(onInputForm, DEBOUNCE_DELAY));

function renderCountriesList(item) {
    countryInfo.innerHTML = '';
    const markupList = item
        .map(country => {
            return `
        <li class="country-list-item">
        <img src='${country.flags.svg}' alt='${country.name} flag' width='40px' />
        <p>${country.name}</p>
        </li>`;
        })
        .join('');
    countryList.innerHTML = markupList;
}

function renderCountryInfo(country) {
    countryList.innerHTML = '';

    const markupInfo = country
        .map((country) => {
            const languagesList = country.languages.map(lang => lang.name);
            return `
        <div>
        <img src='${country.flags.svg}' alt='${country.name} flag' width='200px' height='100px'/>
        <h2>${country.name}</h2>
        </div>
        <p><b>Capital</b>: ${country.capital}</p>
        <p><b>Population</b>: ${country.population}</p>
        <p><b>Languages</b>: ${languagesList}</p>`;
        }).join("");

    countryInfo.innerHTML = markupInfo;
};

