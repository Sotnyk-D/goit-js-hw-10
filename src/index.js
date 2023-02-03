import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;
const inputRef = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
// console.log(inputRef);

inputRef.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch() {
  // console.log(inputRef.value);
  const name = inputRef.value.trim();
  if (name === '') {
    countryInfo.innerHTML = '';
    countryList.innerHTML = '';
    return;
  }

  fetchCountries(name)
    .then(countries => {
      countryList.innerHTML = '';
      countryInfo.innerHTML = '';
      if (countries.length === 1) {
        countryList.insertAdjacentHTML(
          'beforeend',
          renderCountryList(countries)
        );
        countryInfo.insertAdjacentHTML(
          'beforeend',
          renderCountryInfo(countries)
        );
      } else if (countries.length >= 10) {
        alertManyMatches();
      } else {
        countryList.insertAdjacentHTML(
          'beforeend',
          renderCountryList(countries)
        );
      }
    })
    .catch(alertWrongName);
}

function renderCountryList(countries) {
  const markup = countries
    .map(({ name, flags }) => {
      countryList.style.listStyleType = 'none';
      return `
         <li class="country-list__item">
               <img class="country-list__flag" src="${flags.svg}" alt="Flag of ${name.official}">
               <h2 class="country-list__name">${name.official}</h2>
           </li>
           `;
    })
    .join('');
  return markup;
}

function renderCountryInfo(countries) {
  const markup = countries
    .map(({ capital, population, languages }) => {
      return `
         <ul class="country-info__list" style="list-style-type: none;">
             <li class="country-info__item"><p><b>Capital: </b>${capital}</p></li>
             <li class="country-info__item"><p><b>Population: </b>${population}</p></li>
             <li class="country-info__item"><p><b>Languages: </b>${Object.values(
               languages
             ).join(', ')}</p></li>
         </ul>
         `;
    })
    .join('');
  return markup;
}

function alertWrongName() {
  Notiflix.Notify.failure('Oops, there is no country with that name');
}

function alertManyMatches() {
  Notiflix.Notify.info(
    'Too many matches found. Please enter a more specific name.'
  );
}
