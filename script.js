'use strict';

let language = 'RU';
let countries;
let listSelectDisplay = false;

const listDefault = document.querySelector('.dropdown-lists__list--default'),
  label = document.querySelector('.label'),
  listSelect = document.querySelector('.dropdown-lists__list--select'),
  listAutocomplete = document.querySelector('.dropdown-lists__list--autocomplete'),
  selectCities = document.getElementById('select-cities'),
  dropdownLists = document.querySelector('.dropdown-lists'),
  button = document.querySelector('.button');

const getCountries = () => {
  const countries = {};
  data[language].forEach(item => {
    countries[item.country] = {
      count: item.count,
      cities: item.cities
    };
  });
  return countries;
};

countries = getCountries();

const getCity = (country, city) => {
  return `
    <div class="dropdown-lists__line" data-link="${countries[country].cities[city].link}">
      <div class="dropdown-lists__city">${countries[country].cities[city].name}</div>
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
  } else {
    if (!target.closest('.button')) {
      button.setAttribute('href', '#');
      label.textContent = 'Страна или город';
    }
  }
};

const getListSelect = (country) => {
  listSelect.textContent = '';
  if (!listSelectDisplay) {
    listDefault.style.display = 'none';
    listSelect.style.display = 'block';
    listSelectDisplay = true;
  } else {
    listSelect.style.display = 'none';
    listDefault.style.display = 'block';
    listSelectDisplay = false;
  }

  listSelect.insertAdjacentHTML('afterbegin', `
    <div class="dropdown-lists__col">
      ${getCountry(country, -1)}
    </div>
    `
  );
};

const getListAutocomplete = () => {
  const getAllCity = (value) => {
    let text = '';
    for (let country in countries){
      for (let city in countries[country].cities) {
        if (countries[country].cities[city].name.toLowerCase().indexOf(value) === 0) {
          text += getCity(country, city);
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
