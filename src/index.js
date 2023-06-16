import SlimSelect from 'slim-select';
import Notiflix from 'notiflix';
import { fetchBreeds, fetchCatByBreed } from './cat-api.js';

const selectEl = document.querySelector('.breed-select');
const catInfoEl = document.querySelector('.cat-info');
const loaderEl = document.querySelector('.loader');
const errorMessage = document.querySelector('.error');
loaderEl.style.display = 'none';
errorMessage.style.display = 'none';

let breeds = [];

function takeBreeds(response) {
  const breedData = Object.values(response);
  breeds = breedData.map(breed => ({ name: breed.name, id: breed.id }));
}

function addBreeds() {
  fetchBreeds(errorMessage)
    .then(response => {
      takeBreeds(response);
      let listOfBreedsEl = breeds.map(element => {
        let optionEl = document.createElement('option');
        optionEl.value = element.id;
        optionEl.textContent = element.name;
        return optionEl;
      });
      selectEl.append(...listOfBreedsEl);
    })
    .catch(error => {
      Notiflix.Notify.failure(errorMessage.textContent);
      loaderEl.style.display = 'none';
      selectEl.style.display = 'block';
    });
}

addBreeds();

function getElements(elements) {
  const name = elements[0].breeds[0].name;
  const description = elements[0].breeds[0].description;
  const temperament = elements[0].breeds[0].temperament;
  const image = elements[0].url;
  return { name: name, description: description, temperament: temperament, image: image };
}

function showBreed(returnedPromise) {
  const elements = getElements(returnedPromise);
  const { name, description, temperament, image } = elements;

  const containerEl = document.createElement('div');
  containerEl.classList.add('container');

  const imageEl = document.createElement('img');
  imageEl.src = image;
  imageEl.alt = name;
  imageEl.classList.add('image');
    
  const infoContainerEl = document.createElement('div');
  infoContainerEl.classList.add('info');

  const titleEl = document.createElement('h1');
  titleEl.classList.add('title');
  titleEl.textContent = name;

  const descriptionEl = document.createElement('p');
  descriptionEl.classList.add('description');
  descriptionEl.textContent = description;

  const temperamentEl = document.createElement('p');
  temperamentEl.classList.add('temperament');
  temperamentEl.innerHTML = `<b class="title-temperament">Temperament: </b>${temperament}`;

  infoContainerEl.appendChild(titleEl);
  infoContainerEl.appendChild(descriptionEl);
  infoContainerEl.appendChild(temperamentEl);

  containerEl.appendChild(imageEl);
  containerEl.appendChild(infoContainerEl);

  catInfoEl.innerHTML = '';

  catInfoEl.appendChild(containerEl);

  loaderEl.style.display = 'none';
}

function onSelectChange(event) {
  const breedId = selectEl.options[selectEl.selectedIndex].value;
  selectEl.style.display = 'none';
  catInfoEl.style.display = 'none';
  loaderEl.style.display = 'block';
  fetchCatByBreed(breedId, errorMessage, loaderEl, selectEl)
    .then(returnedPromise => {
      showBreed(returnedPromise);
      catInfoEl.style.display = 'block';
      selectEl.style.display = 'block';
    })
    .catch(error => {
      Notiflix.Notify.failure(errorMessage.textContent);
      loaderEl.style.display = 'none';
      selectEl.style.display = 'block';
    });
}

new SlimSelect({
  select: '.select-breed'
});

selectEl.addEventListener('change', onSelectChange);