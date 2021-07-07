'use strict';

let language = 'RU';
let countries = {};
let listSelectDisplay = false;

const listDefault = document.querySelector('.dropdown-lists__list--default'),
  label = document.querySelector('.label'),
  listSelect = document.querySelector('.dropdown-lists__list--select'),
  listAutocomplete = document.querySelector('.dropdown-lists__list--autocomplete'),
  selectCities = document.getElementById('select-cities'),
  dropdownLists = document.querySelector('.dropdown-lists'),
  button = document.querySelector('.button'),
  preloader = document.querySelector('.preloader'),
  closeButton = document.querySelector('.close-button');

button.setAttribute('disabled', true);

const getCountries = () => {
  const countries = {};
  fetch('./db_cities.json')
  .then((response) => {
    if (response.status !== 200) {
      throw new Error('status network not 200!');
    }
    return response.json();
  })
  .then((response) => {
    response[language];
    data[language].forEach(item => {
      countries[item.country] = {
        count: item.count,
        cities: item.cities
      };
    });
    preloader.style.display = 'none';
    runCities(countries);
  })
  .catch(error => {
    console.error(error);
  });
};

countries = getCountries();

const runCities = (countries) => {
  const getCity = (country, city, value) => {
    return `
      <div class="dropdown-lists__line" data-link="${countries[country].cities[city].link}">
        <div class="dropdown-lists__city">${value ? ('<b>' + countries[country].cities[city].name.substr(0, value ? value.length : 0) + '</b>') : ''}${countries[country].cities[city].name.slice(value ? value.length : 0).trim()}</div>
        <div class="dropdown-lists__count">${countries[country].cities[city].count}</div>
      </div>
    `;
  };
  
  const getCities = (country, all = 3) => {
    let text = '';
    if (all < 0) {
      all = countries[country].cities.length;
    }
    for (let i = 0; i < all; i++) {
      if (i < countries[country].cities.length) {
        text += getCity(country, i);
      }
    }
    return text;
  }
  
  const getCountry = (country, all) => {
    let text = '';
  
    const getData = (key) => {
      text += `
        <div class="dropdown-lists__countryBlock">
          <div class="dropdown-lists__total-line">
            <div class="dropdown-lists__country">${key}</div>
            <div class="dropdown-lists__count">${countries[key].count}</div>
          </div>
          ${getCities(key, all)}
        </div>
      `;
    };
    if (!country) {
      for (let key in countries) {
        getData(key);
      }
    } else {
      getData(country);
    }
    return text;
  };
  
  const getListDefault = () => {
    listDefault.style.display = 'block';
    if (!selectCities.value) listDefault.style.display = 'block';
    listDefault.textContent = '';
  
    listDefault.insertAdjacentHTML('afterbegin', `
      <div class="dropdown-lists__col">
        ${getCountry()}
      </div>
      `
    );      
  };
  
  const getLink = (target) => {
    let targetLink = target.closest('.dropdown-lists__line');
    if (targetLink) {
      listDefault.style.display = 'none';
      listSelect.style.display = 'none';
      listAutocomplete.style.display = 'none';
      label.textContent = targetLink.querySelector('.dropdown-lists__city').textContent;
      button.setAttribute('href', targetLink.dataset.link);
      closeButton.style.display = 'block';
      button.removeAttribute('disabled');
    } else {
      if (!target.closest('.button')) {
        button.setAttribute('href', '#');
        label.textContent = 'Страна или город';
        closeButton.style.display = 'none';
        button.setAttribute('disabled', true);
      }
    }
  };
  
  const getListSelect = (country) => {
    listSelect.style.display = 'block';

    listSelect.textContent = '';
    if (!listSelectDisplay) {
      listSelectDisplay = true;
    } else {
      listSelectDisplay = false;
    }

    listSelect.insertAdjacentHTML('afterbegin', `
      <div class="dropdown-lists__col">
        ${getCountry(country, -1)}
      </div>
      `
    );

    let position,
      direction;
    if (listSelectDisplay) {
      position = 0;
      direction = -5;
    } else {
      position = -100;
      direction = 5;
    }
    console.log(direction);
    const animate = () => {
      if ((listSelectDisplay && position > -100) || (!listSelectDisplay && position < 0)) {
        position += direction;
        listSelect.style.left = position + '%';
        listDefault.style.left = position + '%';
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  };
  
  const getListAutocomplete = () => {
    const getAllCity = (value) => {
      console.log(value);
      let text = '';
      for (let country in countries){
        for (let city in countries[country].cities) {
          if (countries[country].cities[city].name.toLowerCase().indexOf(value) === 0) {
            text += getCity(country, city, value);
          }
        }
      }
      return text;
    };
  
    if (selectCities.value) {
      listSelect.style.display = 'none';
      listDefault.style.display = 'none';
      listAutocomplete.style.display = 'block';
      listAutocomplete.textContent = '';
  
      let value = selectCities.value;
  
      listAutocomplete.insertAdjacentHTML('afterbegin', `
        <div class="dropdown-lists__col">
          <div class="dropdown-lists__countryBlock">
            ${getAllCity(value.toLowerCase())}
          </div>
        </div>
        `
      );
    } else {
      listAutocomplete.style.display = 'none';
      if (listSelectDisplay) {
        listSelect.style.display = 'block';
      } else {
        listDefault.style.display = 'none';
      }
    }
  };
  
  selectCities.addEventListener('click', getListDefault);
  
  document.addEventListener('click', event => {
    const target = event.target.closest('.dropdown-lists__total-line');
    if (target) {
      getListSelect(target.querySelector('.dropdown-lists__country').textContent);
    }
    getLink(event.target);
  });
  
  selectCities.addEventListener('input', getListAutocomplete);

  closeButton.addEventListener('click', () => {
    selectCities.value = '';
    listSelect.style.left = 0;
    listDefault.style.left = 0;
    listSelectDisplay = false;
  });
}
