// Global Variables //

const villagerQuotes = [
  {
    name: 'Sly',
    quote: 'I want my face on a bag of chips.'
  },
  {
    name: 'Cube',
    quote: 'Would I need an ice pick?'
  },
  {
    name: 'Audie',
    quote: 'Be the kind of person your future self won\'t regret having been.'
  }
];

const allVillagers = [];
const thisWeeksEvents = [];
const $defaultText = createDefaultText();
const $birthdayDefText = createBirthdayDefaultText();

// Event Listeners //

const $fruitContainer = document.querySelector('.fruit-container');
const $fruits = document.querySelectorAll('.fruit-img');
const $searchVillagerBtn = document.querySelector('.search-villager-btn');
const $addVillagerInput = document.querySelector('.new-villager-input');
const $addVillagerBtn = document.querySelector('.add-villager-btn');
const $removeVillagerBtn = document.querySelector('.remove-villager-btn');
const $villagerDatalist = document.querySelector('.villager-datalist');
const $villagerEntryList = document.querySelector('.villager-entry-list');
const $townForm = document.querySelector('.town-form');
const $formTitle = document.querySelector('.town-form-title');
const $imageInput = document.querySelector('.image-input');
const $townImage = document.querySelector('.town-img');
const $townDeleteBtn = document.querySelector('.town-delete-btn');
const $townContainer = document.querySelector('.town-container');
const $slideContainer = document.querySelector('.slider-container');

// New Town Input Form //

window.addEventListener('DOMContentLoaded', function (event) {
  getCurrentEvents();
  if (data.towns.length === 0) {
    $townContainer.append($defaultText);
  }
  if (data.view === 'town-entry-form' && data.editing) {
    prefillEditForm();
  }

  for (let i = 0; i < data.towns.length; i++) {
    const previousTown = renderTown(data.towns[i]);
    $townContainer.append(previousTown);
  }
  viewSwap(data.view);
});

$imageInput.addEventListener('change', function (event) {
  getImgData();
});

function getImgData() {
  const files = $imageInput.files[0];
  if (files) {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(files);
    fileReader.addEventListener('load', function () {
      $townImage.src = this.result;
    });
  }
}

$fruitContainer.addEventListener('click', handleFruitClick);

function handleFruitClick(event) { // highlight the clicked fruit with a soft yellow background
  if (event.target.tagName === 'INPUT') {
    const parentDiv = (event.target.closest('div'));
    const labelChild = parentDiv.firstElementChild;
    const fruitImg = labelChild.firstElementChild;
    for (let i = 0; i < $fruits.length; i++) {
      if ($fruits[i] === fruitImg) {
        $fruits[i].classList.add('light-yellow-bg');
      } else {
        $fruits[i].classList.remove('light-yellow-bg');
      }
    }
  }
}

function clearFruits() { // resets the fruits on page reload
  for (let i = 0; i < $fruits.length; i++) {
    $fruits[i].classList.remove('light-yellow-bg');
    $fruits[i].closest('div').children[1].removeAttribute('checked');
  }
}

$searchVillagerBtn.addEventListener('click', function (event) {
  if (allVillagers.length === 0) {
    getVillagerNames();
  }
});

function searchVillagers(event) { // search through the villagers and show them to the user
  $villagerDatalist.textContent = '';
  $addVillagerInput.classList.toggle('hidden');
  $addVillagerBtn.classList.toggle('hidden');
  $removeVillagerBtn.classList.toggle('hidden');
  for (let i = 0; i < allVillagers.length; i++) {
    const $villagerDataTag = document.createElement('option');
    $villagerDataTag.value = allVillagers[i].name;
    $villagerDatalist.append($villagerDataTag);
  }
}

$addVillagerBtn.addEventListener('click', addVillager);

function addVillager() { // add a villager to both the DOM and the data model
  for (let i = 0; i < allVillagers.length; i++) {
    if (allVillagers[i].name === $addVillagerInput.value && data.currentVillagers.length < 10) {
      for (let j = 0; j < data.currentVillagers.length; j++) { // check for same villagers
        if (data.currentVillagers[j].name === allVillagers[i].name) {
          $addVillagerInput.value = '';
          return;
        }
      }
      $villagerEntryList.append(createVillagerIcon(allVillagers[i].name, allVillagers[i].icon));
      data.currentVillagers.push(allVillagers[i]);
    }
  }
  $addVillagerInput.value = '';
}

$removeVillagerBtn.addEventListener('click', removeVillager);

function removeVillager() {
  for (let i = 0; i < data.currentVillagers.length; i++) {
    if (data.currentVillagers[i].name === $addVillagerInput.value) { // ensure the villager we're deleting is in currentVillagers
      const $entryChildren = $villagerEntryList.children;
      for (let j = 1; i < $entryChildren.length; j++) { // start iterating at 1 because 0 index is add button
        if ($entryChildren[j].getAttribute('data-villager-id') === $addVillagerInput.value) {
          $entryChildren[j].remove();
          data.currentVillagers.splice(i, 1);
          break;
        }
      }
    }
  }
}

function createVillagerIcon(villagerName, imageUrl) { // create a villager icon and return it
  /*
  * <li data-villager-id="villagerName">
  *  <div class="villager-card justify-and-align-center">
  *    <img class="villager-icon" src="images/sample_villager.png">
  *  </div>
  * </li>
  */
  const $newLi = document.createElement('li');
  $newLi.setAttribute('data-villager-id', villagerName);

  const $newDiv = document.createElement('div');
  $newDiv.className = 'villager-card justify-and-align-center';

  const $villagerIcon = document.createElement('img');
  $villagerIcon.className = 'villager-icon';
  $villagerIcon.src = imageUrl;

  $newDiv.append($villagerIcon);
  $newLi.append($newDiv);

  return $newLi;
}

function createVillagerBDIcon(villagerName, imageUrl) { // create a villager birthday icon and returns it
  /*
  * <li class="row-no-wrap pl-1-rem align-center" data-villager-id="villagerName">
  *   <div class="villager-card justify-and-align-center">
  *     <img class="villager-icon" src="images/sample_villager.png">
  *   </div>
  *   <div class="birthday-text row align-center">
  *     <h3 class="pl-1-rem event-text fw-500">Tangy's Birthday!</h3>
  *   </div>
  * </li>
  */
  const $newBDLi = document.createElement('li');
  $newBDLi.setAttribute('data-villager-id', villagerName);
  $newBDLi.className = 'row-no-wrap pl-1-rem align-center';

  const $newIconDiv = document.createElement('div');
  $newIconDiv.className = 'villager-card justify-and-align-center';

  const $villagerIcon = document.createElement('img');
  $villagerIcon.className = 'villager-icon';
  $villagerIcon.src = imageUrl;

  const $bdTextDiv = document.createElement('div');
  $bdTextDiv.className = 'birthday-text row align-center';

  const $bdTextH3 = document.createElement('h3');
  $bdTextH3.textContent = villagerName + '\'s' + ' birthday!';
  $bdTextH3.className = 'pl-1-rem fw-500';

  $newIconDiv.append($villagerIcon);
  $bdTextDiv.append($bdTextH3);
  $newBDLi.append($newIconDiv, $bdTextDiv);

  return $newBDLi;
}

function clearVillagers() { // clears villagers from the DOM
  while ($villagerEntryList.children.length > 1) {
    const $lastVillager = $villagerEntryList.lastChild;
    $lastVillager.remove();
  }
}

$townForm.addEventListener('submit', function (event) { // handle submitting a town (either new or edit)
  if (!data.editing) {
    handleNewSubmit(event);
  } else {
    handleEditSubmit(event);
  }
  if (data.towns.length !== 0) {
    $defaultText.remove();
  }
  $townForm.reset();
  clearFruits();
  clearVillagers();
  viewSwap('town-entries');
});

function handleNewSubmit(event) { // handle the form data from a new town submit
  event.preventDefault();
  const formData = {};
  formData.playerName = $townForm.elements['char-name'].value;
  formData.townName = $townForm.elements['town-name'].value;
  formData.townFruit = $townForm.elements.fruit.value;
  formData.townVillagers = data.currentVillagers;
  formData.imageLink = $townImage.src;
  data.currentVillagers = [];
  $townImage.src = 'images/placeholder-image-square.jpg';
  formData.entryID = data.nextEntryId;
  data.nextEntryId++;
  data.towns.unshift(formData);
  $townContainer.prepend(renderTown(formData));
}

function handleEditSubmit(event) {
  event.preventDefault();
  data.editing.playerName = $townForm.elements['char-name'].value;
  data.editing.townName = $townForm.elements['town-name'].value;
  data.editing.townFruit = $townForm.elements.fruit.value;
  data.editing.townVillagers = data.currentVillagers;
  data.editing.imageLink = $townImage.src;
  data.currentVillagers = [];
  $townImage.src = 'images/placeholder-image-square.jpg';
  const $nodeToReplace = document.querySelector(`li[data-entry-id="${data.editing.entryID}"]`);
  $nodeToReplace.replaceWith(renderTown(data.editing));
  for (let i = 0; i < data.towns.length; i++) {
    if (data.towns[i].entryID === data.editing.entryID) {
      data.towns[i] = data.editing;
    }
  }
  data.editing = null;
}

// Town View Form //

function renderTown(townObj) {
  /* <li data-entry-id="" class="row mb-1-rem">
  *    <div class="row column-full">
  *      <h2 class="fw-500">Acorn Cove</h2>
  *    </div>
  *    <div class="column-half">
  *      <div class="town-hero-img justify-and-align-center">
  *        <div class="overlay"></div>
  *        <button class="overlay-town-btn" type="button">Jump back in!</button>
  *     </div>
  *    </div>
  *    <div class="column-half">
  *      <ul class="villager-icon-holder row gap-1-rem"></ul>
  *    </div>
  *  </li>
  */
  const $parentLi = document.createElement('li');
  $parentLi.setAttribute('data-entry-id', townObj.entryID);
  $parentLi.className = 'row mb-1-rem';

  const $titleDiv = document.createElement('div');
  $titleDiv.className = 'row column-full';

  const $titleH2 = document.createElement('h2');
  $titleH2.className = 'fw-500';
  $titleH2.textContent = townObj.townName;

  const $imageColumnDiv = document.createElement('div');
  $imageColumnDiv.className = 'column-half';

  const $imageHeroDiv = document.createElement('div');
  $imageHeroDiv.className = 'town-hero-img justify-and-align-center';
  if (townObj.imageLink !== 'http://localhost:5500/images/placeholder-image-square.jpg') {
    $imageHeroDiv.style.backgroundImage = 'url(' + townObj.imageLink + ')';
  } else {
    $imageHeroDiv.classList.add('default-hero-img');
  }

  const $overlayDiv = document.createElement('div');
  $overlayDiv.className = 'overlay';

  const $jumpInButton = document.createElement('button');
  $jumpInButton.type = 'button';
  $jumpInButton.className = 'overlay-town-btn';
  $jumpInButton.textContent = 'Jump back in!';

  const $villagerColumnDiv = document.createElement('div');
  $villagerColumnDiv.className = 'column-half';

  const $villagerUl = document.createElement('ul');
  $villagerUl.className = 'home-villager-icon-holder row gap-1-rem';

  for (let i = 0; i < townObj.townVillagers.length; i++) {
    $villagerUl.append(createVillagerIcon(townObj.townVillagers[i].name, townObj.townVillagers[i].icon));
  }

  $villagerColumnDiv.append($villagerUl);
  $imageHeroDiv.append($overlayDiv, $jumpInButton);
  $imageColumnDiv.append($imageHeroDiv);
  $titleDiv.append($titleH2);
  $parentLi.append($titleDiv, $imageColumnDiv, $villagerColumnDiv);

  return $parentLi;
}

function createDefaultText() {
  const $textDiv = document.createElement('div');
  $textDiv.className = 'row justify-and-align-center';

  const $textP = document.createElement('p');
  $textP.className = 'default-text';
  $textP.textContent = 'No towns have been recorded... yet!';

  $textDiv.append($textP);
  return $textDiv;
}

function createBirthdayDefaultText() {
  /* <li class="birthday-default-text row align-center">
  *   <h3 class="pl-1-rem event-text fw-500">No Birthdays Today...</h3>
  * </li>
  */
  const $parentLi = document.createElement('li');
  $parentLi.className = 'birthday-default-text row align-center';

  const $childh3 = document.createElement('h3');
  $childh3.className = 'pl-1-rem event-text fw-500';
  $childh3.textContent = 'No Birthdays Today...';

  $parentLi.append($childh3);
  return $parentLi;
}

// Edit Town //

const $editTownBtn = document.querySelector('.edit-icon');
const $deleteTownModal = document.querySelector('.del-modal');
const $cancelDeleteBtn = document.querySelector('.cancel-delete-btn');
const $confirmDeleteBtn = document.querySelector('.confirm-delete-btn');

$editTownBtn.addEventListener('click', function (event) { // preload all town information into the town form for editing
  data.editing = data.currentTown;
  addEditTownText();
  prefillEditForm();
  viewSwap('town-entry-form');
});

$townDeleteBtn.addEventListener('click', function (event) {
  $deleteTownModal.classList.remove('hidden');
});

$cancelDeleteBtn.addEventListener('click', function (event) {
  $deleteTownModal.classList.add('hidden');
});

$confirmDeleteBtn.addEventListener('click', function (event) {
  if (data.editing) {
    deleteTown();
  }
  $deleteTownModal.classList.add('hidden');
  viewSwap('town-entries');
});

function prefillEditForm() {
  $townForm.elements['char-name'].value = data.editing.playerName;
  $townForm.elements['town-name'].value = data.editing.townName;
  $townImage.src = data.editing.imageLink;
  for (let i = 0; i < $fruits.length; i++) {
    if ($fruits[i].classList.contains(data.editing.townFruit)) {
      $fruits[i].classList.add('light-yellow-bg');
      $fruits[i].closest('div').children[1].setAttribute('checked', '');
    } else {
      $fruits[i].classList.remove('light-yellow-bg');
      $fruits[i].closest('div').children[1].removeAttribute('checked');
    }
  }
  clearVillagers();
  data.currentVillagers = [];
  for (let i = 0; i < data.editing.townVillagers.length; i++) {
    $villagerEntryList.append(createVillagerIcon(data.editing.townVillagers[i].name, data.editing.townVillagers[i].icon));
    data.currentVillagers.push(data.editing.townVillagers[i]);
  }
}

function addEditTownText() {
  $formTitle.textContent = 'Edit Town';
}

function deleteTown() {
  const idToDelete = data.editing.entryID;
  const $nodeToDelete = document.querySelector(`li[data-entry-id="${idToDelete}"]`);
  $nodeToDelete.remove();
  for (let i = 0; i < data.towns.length; i++) {
    if (data.towns[i].entryID === idToDelete) {
      data.towns.splice(i, 1);
    }
  }
  signOut();
  viewSwap('town-entries');
}

// Town Home Page //

const $allFruit = document.querySelectorAll('.town-fruit-header');
const $allDates = document.querySelectorAll('.today-date');
const $homeTownName = document.querySelector('.home-page-town-name');
const $homeVillagerUl = document.querySelector('.home-page-villagers');
const $homeImageCont = document.querySelector('.home-page-image');
const $birthdayUl = document.querySelector('.birthday-container');
const $villagerQuote = document.querySelector('.villager-quote');
const $villagerQuoteTag = document.querySelector('.villager-quote-tag');
const $eventsContainer = document.querySelector('.events-container');

$townContainer.addEventListener('click', function (event) { // on 'jump back in' btn press, pass correct townObj to rendertown function
  if (event.target.tagName === 'BUTTON') {
    const dataID = parseInt(event.target.closest('li').getAttribute(['data-entry-id']));
    for (let i = 0; i < data.towns.length; i++) {
      if (data.towns[i].entryID === dataID) {
        renderHomePage(data.towns[i]);
        viewSwap('town-home-page');
      }
    }
  }
});

function renderHomePage(townObj) {
  const birthdayVillagers = [];

  // render the town data //
  data.currentTown = townObj;
  for (let i = 0; i < $allFruit.length; i++) {
    $allFruit[i].src = 'images/Fruits/' + townObj.townFruit + '.png';
  }
  for (let i = 0; i < $allDates.length; i++) {
    $allDates[i].textContent = getDate();
  }
  $homeTownName.textContent = townObj.townName;
  $homeImageCont.src = townObj.imageLink;
  $homeVillagerUl.textContent = '';

  // render the town news //
  for (let i = 0; i < townObj.townVillagers.length; i++) { // append villagers to top of page
    $homeVillagerUl.append(createVillagerIcon(townObj.townVillagers[i].name, townObj.townVillagers[i].icon));
    if (isBirthday(townObj.townVillagers[i])) { // check for birthdays
      birthdayVillagers.push(townObj.townVillagers[i]);
    }
  }
  $birthdayUl.textContent = '';
  if (birthdayVillagers.length !== 0) {
    for (let i = 0; i < birthdayVillagers.length; i++) {
      $birthdayUl.append(createVillagerBDIcon(birthdayVillagers[i].name, birthdayVillagers[i].icon));
    }
  } else {
    $birthdayUl.append($birthdayDefText);
  }
  getRandomQuote();
  $eventsContainer.textContent = '';
  const eventsToRender = filterEvents(thisWeeksEvents);
  for (let i = 0; i < eventsToRender.length; i++) {
    $eventsContainer.append(renderEvent(eventsToRender[i]));
  }
  if (townObj.collectionData) { // if there is previous collection data, assign it to collections
    data.collectionData = townObj.collectionData;
  }
  updateHomeCollectionProgress();
}

function getRandomQuote() {
  const randomQuote = villagerQuotes[Math.floor(Math.random() * villagerQuotes.length)];
  $villagerQuote.textContent = randomQuote.quote;
  $villagerQuoteTag.textContent = '--' + randomQuote.name;
}

function filterEvents(eventArray) { // filter the events to only show relevant events to user
  const eventsToShow = [];
  const validDays = get10DaysForward();
  for (let i = 0; i < eventArray.length; i++) {
    if (eventArray[i].type === 'Recipe') {
      eventsToShow.push(eventArray[i]);
    } else if (validDays.includes(eventArray[i].date)) {
      eventsToShow.push(eventArray[i]);
    }
  }
  return eventsToShow;
}

function renderEvent(eventObj) {
  /*
  * <li class="row-no-wrap justify-and-align-center">
  *   <img class="event-icon fb-5" src="images/Events/shopping-cart.png">
  *    <h3 class="fw-500 mtb-0 mr-1-rem fb-85">Grape Harvest Festival Nook Shopping event begins</h3>
  *    <h3 class="fw-500 mtb-0 event-date fb-15">09/01</h3>
  *  </li>
  */
  const $newLi = document.createElement('li');
  $newLi.className = 'row-no-wrap justify-and-align-center';

  const $newImg = document.createElement('img');
  if (eventObj.type === 'Event') {
    $newImg.src = 'images/Events/trophy-icon.png';
  } else if (eventObj.type === 'Nook Shopping') {
    $newImg.src = 'images/Events/shopping-cart.png';
  } else {
    $newImg.src = 'images/Events/recipe-icon.png';
  }
  $newImg.className = 'event-icon fb-5';

  const $eventNameH3 = document.createElement('h3');
  $eventNameH3.className = 'fw-500 mtb-0 mr-1-rem fb-85';
  $eventNameH3.textContent = eventObj.event;

  const $eventDateH3 = document.createElement('h3');
  $eventDateH3.className = 'fw-500 mtb-0 event-date fb-15';
  const splitDate = eventObj.date.split('-');
  const monthDayOnly = splitDate[1] + '/' + splitDate[2];
  $eventDateH3.textContent = monthDayOnly;

  $newLi.append($newImg, $eventNameH3, $eventDateH3);

  return $newLi;
}

// View-Swap //

const $addTownBtn = document.querySelector('.add-town-btn');
const $navTowns = document.querySelector('.towns-nav');
const $navHome = document.querySelector('.home-nav');
const $navCollections = document.querySelector('.collections-nav');
const $hamburgerBtn = document.querySelector('.hamburger');
const $navbarLinksDiv = document.querySelector('.navbar-links');
const $navbarLinks = document.querySelectorAll('.nav-link');

$hamburgerBtn.addEventListener('click', () => {
  $navbarLinksDiv.classList.toggle('active');
  $hamburgerBtn.classList.toggle('active');
});

$navbarLinks.forEach(link => {
  link.addEventListener('click', function (event) {
    $navbarLinksDiv.classList.toggle('active');
    $hamburgerBtn.classList.toggle('active');
  });
});

$addTownBtn.addEventListener('click', function (event) { // swap to entry form view
  $townForm.reset();
  $townImage.src = 'images/placeholder-image-square.jpg';
  $formTitle.textContent = 'New Town';
  data.currentVillagers = [];
  clearFruits();
  clearVillagers();
  viewSwap('town-entry-form');
});

$navTowns.addEventListener('click', function (event) { // swap to entries view
  if (data.view !== 'town-entries') {
    signOut();
  }
  viewSwap('town-entries');
});

$navHome.addEventListener('click', function (event) {
  if (data.view !== 'town-home-page' && data.currentTown !== null) {
    renderHomePage(data.currentTown);
    viewSwap('town-home-page');
  }
  data.editing = null;
});

$navCollections.addEventListener('click', function (event) {
  if (data.view !== 'collections' && data.currentCollection !== null) {
    renderCollection(data.currentCollection);
    viewSwap('collections');
  }
});

function signOut() { // signs the user out of their current town, clearing all data fields and saving their session data
  if (data.view === 'town-entry-form' && !data.editing) {
    viewSwap('town-entries');
    return;
  }
  const currentTownId = data.currentTown.entryID;
  data.towns.forEach(town => {
    if (town.entryID === currentTownId) {
      town.collectionData = data.collectionData;
    }
  });
  data.collectionData = {};
  data.currentCollection = null;
  data.currentCollectionItem = null;
  data.currentTown = null;
  data.editing = null;
}

function viewSwap(dataView) { // takes a dataview as argument and changes to that dataview
  const $dataViews = document.querySelectorAll('[data-view]');
  for (let i = 0; i < $dataViews.length; i++) {
    if ($dataViews[i].getAttribute('data-view') === dataView) {
      $dataViews[i].className = '';
      data.view = dataView;
    } else {
      $dataViews[i].className = 'hidden';
    }
  }
  if (dataView === 'collections' && $allDates[1].textContent === '') { // if page is refreshed collections needs loaded in
    $allDates[1].textContent = getDate();
    $allFruit[1].src = 'images/Fruits/' + data.currentTown.townFruit + '.png';
    renderCollection(data.currentCollection);
  }
  if (dataView === 'town-entry-form' && data.editing) { // if page is refreshed and was editing
    addEditTownText();
  }
}

// ACNH Data Functions //

function getVillagerNames() { // call the API and grab all villager names and icons
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://acnhapi.com/v1a/villagers');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    for (let i = 0; i < xhr.response.length; i++) {
      const villager = {};
      const name = xhr.response[i].name['name-USen'];
      const icon = xhr.response[i].image_uri;
      const birthday = xhr.response[i].birthday;
      villager.name = name;
      villager.icon = icon;
      villager.birthday = birthday;
      allVillagers.push(villager);
    }
    searchVillagers();
  });
  xhr.send();
}

function getCurrentEvents() { // call the API and grab current events
  const xhr = new XMLHttpRequest();
  const params = 'month=October&year=2022';
  xhr.open('GET', 'https://api.nookipedia.com/nh/events' + '?' + params);
  xhr.responseType = 'json';
  xhr.setRequestHeader('X-API-KEY', '1caa9517-345b-49e4-8fdb-c52f0c49432f');
  xhr.addEventListener('load', function () {
    if (xhr.response.length !== 0) {
      for (let i = 0; i < xhr.response.length; i++) {
        if (xhr.response[i].type !== 'Birthday') {
          thisWeeksEvents.push(xhr.response[i]);
        }
      }
    }
    const xhr2 = new XMLHttpRequest();
    const params2 = 'month=November&year=2022';
    xhr2.open('GET', 'https://api.nookipedia.com/nh/events' + '?' + params2);
    xhr2.responseType = 'json';
    xhr2.setRequestHeader('X-API-KEY', '1caa9517-345b-49e4-8fdb-c52f0c49432f');
    xhr2.addEventListener('load', function () {
      if (xhr2.response.length !== 0) {
        for (let i = 0; i < xhr2.response.length; i++) {
          if (xhr2.response[i].type !== 'Birthday') {
            thisWeeksEvents.push(xhr2.response[i]);
          }
        }
      }
      if (data.view === 'town-home-page') {
        renderHomePage(data.currentTown);
      }
    });
    xhr2.send();
  });
  xhr.send();
}

function getFishCollectionItems() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.nookipedia.com/nh/fish');
  xhr.responseType = 'json';
  xhr.setRequestHeader('X-API-KEY', '1caa9517-345b-49e4-8fdb-c52f0c49432f');
  xhr.addEventListener('load', function () {
    const acnhFish = [];
    for (let i = 0; i < xhr.response.length; i++) {
      const currentFish = {};
      currentFish.name = xhr.response[i].name;
      currentFish.number = xhr.response[i].number;
      currentFish.iconUrl = xhr.response[i].image_url;
      currentFish.imageUrl = xhr.response[i].render_url;
      currentFish['price-reg'] = xhr.response[i].sell_nook;
      currentFish['price-cj'] = xhr.response[i].sell_cj;
      currentFish.location = xhr.response[i].location;
      currentFish.shadow = xhr.response[i].shadow_size;
      currentFish['north-availability'] = xhr.response[i].north.availability_array;
      currentFish['north-months'] = xhr.response[i].north.months_array;
      currentFish['south-availability'] = xhr.response[i].south.availability_array;
      currentFish['south-months'] = xhr.response[i].south.months_array;
      currentFish.acquired = false;
      acnhFish.push(currentFish);
    }
    const sortedFish = acnhFish.sort((a, b) => (a.number > b.number) ? 1 : -1); // sort the fish by number property
    renderTable(sortedFish); // render the fish table for the main collection page
    data.collectionData.fish = sortedFish;
  });
  xhr.send();
}

function getBugCollectionItems() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.nookipedia.com/nh/bugs');
  xhr.responseType = 'json';
  xhr.setRequestHeader('X-API-KEY', '1caa9517-345b-49e4-8fdb-c52f0c49432f');
  xhr.addEventListener('load', function () {
    const acnhBugs = [];
    for (let i = 0; i < xhr.response.length; i++) {
      const currentBug = {};
      currentBug.name = xhr.response[i].name;
      currentBug.number = xhr.response[i].number;
      currentBug.iconUrl = xhr.response[i].image_url;
      currentBug.imageUrl = xhr.response[i].render_url;
      currentBug['price-reg'] = xhr.response[i].sell_nook;
      currentBug['price-flick'] = xhr.response[i].sell_flick;
      currentBug.location = xhr.response[i].location;
      currentBug['north-availability'] = xhr.response[i].north.availability_array;
      currentBug['north-months'] = xhr.response[i].north.months_array;
      currentBug['south-availability'] = xhr.response[i].south.availability_array;
      currentBug['south-months'] = xhr.response[i].south.months_array;
      currentBug.acquired = false;
      acnhBugs.push(currentBug);
    }
    const sortedBugs = acnhBugs.sort((a, b) => (a.number > b.number) ? 1 : -1); // sort the bugs by number property
    renderTable(sortedBugs); // render the fish table for the main collection page
    data.collectionData.bugs = sortedBugs;
  });
  xhr.send();
}

function getSeaCollectionItems() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.nookipedia.com/nh/sea');
  xhr.responseType = 'json';
  xhr.setRequestHeader('X-API-KEY', '1caa9517-345b-49e4-8fdb-c52f0c49432f');
  xhr.addEventListener('load', function () {
    const acnhSea = [];
    for (let i = 0; i < xhr.response.length; i++) {
      const currentSea = {};
      currentSea.name = xhr.response[i].name;
      currentSea.number = xhr.response[i].number;
      currentSea.location = 'Unda\' the sea';
      currentSea.iconUrl = xhr.response[i].image_url;
      currentSea.imageUrl = xhr.response[i].render_url;
      currentSea['price-reg'] = xhr.response[i].sell_nook;
      currentSea['shadow-size'] = xhr.response[i].shadow_size;
      currentSea['shadow-movement'] = xhr.response[i].shadow_movement;
      currentSea['north-availability'] = xhr.response[i].north.availability_array;
      currentSea['north-months'] = xhr.response[i].north.months_array;
      currentSea['south-availability'] = xhr.response[i].south.availability_array;
      currentSea['south-months'] = xhr.response[i].south.months_array;
      currentSea.acquired = false;
      acnhSea.push(currentSea);
    }
    const sortedSea = acnhSea.sort((a, b) => (a.number > b.number) ? 1 : -1); // sort the sea creatures by number property
    renderTable(sortedSea); // render the fish table for the main collection page
    data.collectionData.sea = sortedSea;
  });
  xhr.send();
}

function getFossilCollectionItems() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.nookipedia.com/nh/fossils/individuals');
  xhr.responseType = 'json';
  xhr.setRequestHeader('X-API-KEY', '1caa9517-345b-49e4-8fdb-c52f0c49432f');
  xhr.addEventListener('load', function () {
    const acnhFossils = [];
    for (let i = 0; i < xhr.response.length; i++) {
      const currentFossil = {};
      currentFossil.name = xhr.response[i].name;
      currentFossil.iconUrl = xhr.response[i].image_url;
      currentFossil.imageUrl = xhr.response[i].image_url;
      currentFossil['price-reg'] = xhr.response[i].sell_nook;
      currentFossil['fossil-group'] = xhr.response[i].fossil_group;
      currentFossil['hha-score'] = xhr.response[i].hha_base;
      currentFossil.acquired = false;
      acnhFossils.push(currentFossil);
    }
    const sortedFossils = acnhFossils.sort((a, b) => (a.number > b.number) ? 1 : -1); // sort the fossils by number property
    renderTable(sortedFossils); // render the fish table for the main collection page
    data.collectionData.fossils = sortedFossils;
  });
  xhr.send();
}

function getArtCollectionItems() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.nookipedia.com/nh/art');
  xhr.responseType = 'json';
  xhr.setRequestHeader('X-API-KEY', '1caa9517-345b-49e4-8fdb-c52f0c49432f');
  xhr.addEventListener('load', function () {
    const acnhArt = [];
    for (let i = 0; i < xhr.response.length; i++) {
      const currentArt = {};
      currentArt.name = xhr.response[i].name;
      currentArt['art-name'] = xhr.response[i].art_name;
      currentArt.author = xhr.response[i].author;
      currentArt.year = xhr.response[i].year;
      currentArt.iconUrl = xhr.response[i].image_url;
      currentArt.imageUrl = xhr.response[i].image_url;
      currentArt.hasFake = xhr.response[i].has_fake;
      if (currentArt.hasFake) {
        currentArt.fakeVersion = xhr.response[i].fake_image_url;
      }
      currentArt['price-reg'] = xhr.response[i].sell_nook;
      currentArt.availability = xhr.response[i].availability;
      currentArt.authenticity = xhr.response[i].authenticity;
      currentArt.acquired = false;
      acnhArt.push(currentArt);
    }
    const sortedArt = acnhArt.sort((a, b) => (a.number > b.number) ? 1 : -1); // sort the fossils by number property
    renderTable(sortedArt); // render the fish table for the main collection page
    data.collectionData.art = sortedArt;
  });
  xhr.send();
}

// Date Functions //

function isBirthday(villager) { // if today is the villagers birthday, return true
  const currentDate = new Date();
  const todayDate = currentDate.getDate() + '/' + (currentDate.getMonth() + 1);
  if (todayDate === villager.birthday) {
    return true;
  }
  return false;
}

function getDate() { // returns todays date
  let currentDate = new Date();
  const currentDay = currentDate.getDate();
  currentDate = currentDate.toDateString();
  const splitDate = currentDate.split(' ');
  splitDate.pop();
  const daysObj = {
    Sun: 'Sunday,',
    Mon: 'Monday,',
    Tue: 'Tuesday,',
    Wed: 'Wednesday,',
    Thu: 'Thursday,',
    Fri: 'Friday',
    Sat: 'Saturday,'
  };
  const monthsObj = {
    Jan: 'January',
    Feb: 'Febuary',
    Mar: 'March',
    Apr: 'April',
    May: 'May',
    Jun: 'June',
    Jul: 'July',
    Aug: 'August',
    Sep: 'September',
    Oct: 'October',
    Nov: 'November',
    Dec: 'December'
  };
  for (const key in daysObj) {
    if (splitDate[0] === key) {
      splitDate[0] = daysObj[key];
    }
  }
  for (const key in monthsObj) {
    if (splitDate[1] === key) {
      splitDate[1] = monthsObj[key];
    }
  }
  splitDate[2] = currentDay;
  if (currentDay === 1 || currentDay === 21 || currentDay === 31) {
    return (splitDate.join(' ') + 'st' + ' ~');
  } else if (currentDay === 2 || currentDay === 22) {
    return (splitDate.join(' ') + 'nd' + ' ~');
  } else if (currentDay === 3 || currentDay === 23) {
    return (splitDate.join(' ') + 'rd' + ' ~');
  } else {
    return (splitDate.join(' ') + 'th' + ' ~');
  }
}

function get10DaysForward() { // returns an array of valid dates to check
  const validDays = [];
  const monthObj = {
    1: 31,
    2: 28,
    3: 31,
    4: 30,
    5: 31,
    6: 30,
    7: 31,
    8: 31,
    9: 30,
    10: 31,
    11: 30,
    12: 31
  };
  if (isLeapYear) {
    monthObj[2] = 29;
  }
  const todaysDate = new Date();
  const todayDay = todaysDate.getDate();
  const todayMonth = todaysDate.getMonth() + 1;
  const todayYear = todaysDate.getFullYear();
  for (let i = 0; i < 10; i++) {
    let ForwardDay = todayDay + i;
    let ForwardMonth = todayMonth;
    let ForwardYear = todayYear;
    for (const key in monthObj) {
      if (parseInt(key) === todayMonth) {
        if (ForwardDay > parseInt(monthObj[key])) { // check if day > day in month object for current month
          ForwardMonth += 1; // increment the month by 1
          if (ForwardMonth === 13) { // if it's time for a new year
            ForwardYear += 1;
            ForwardMonth = 1;
          }
          ForwardDay = ForwardDay - monthObj[key]; // if it is, subtract the value in monthObj at the month from todays date
        }
      }
    }
    if (ForwardDay < 10) {
      ForwardDay = '0' + ForwardDay;
    }
    if (ForwardMonth < 10) {
      ForwardMonth = '0' + ForwardMonth;
    }
    validDays.push(ForwardYear + '-' + ForwardMonth + '-' + ForwardDay);
  }
  return validDays;
}

function isLeapYear(year) {
  return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
}

// Slider JS //

const $slider = document.querySelector('.slider-container');
let isDown = false;
let isDragging = false;
let StartX;
let scrollLeft;

$slider.addEventListener('mousedown', function (event) {
  isDown = true;
  $slider.classList.add('active');
  StartX = event.pageX - $slider.offsetLeft; // grab the initial point
  scrollLeft = $slider.scrollLeft; // initial capture prevents jumping
});

$slider.addEventListener('mouseleave', () => {
  isDown = false;
  $slider.classList.remove('active');
});

$slider.addEventListener('mouseup', function (event) {
  isDown = false;
  if (isDragging) {
    event.stopImmediatePropagation();
  }
  $slider.classList.remove('active');
  isDragging = false;
});

$slider.addEventListener('mousemove', function (event) {
  if (!isDown) return;
  isDragging = true;
  event.preventDefault();
  const x = event.pageX - $slider.offsetLeft;
  const walk = x - StartX; // how far have we deviated from initial position
  $slider.scrollLeft = scrollLeft - walk;
});

// Collections //

const $collectionContainer = document.querySelector('.collections-container');
const $collectionImage = document.querySelector('.collection-img-header');
const $collectionProgressCount = document.querySelector('.collection-count');

$collectionContainer.addEventListener('click', function (event) {
  if (event.target.tagName === 'IMG' || event.target.tagName === 'DIV') {
    $slideContainer.textContent = ''; // clear collection container from previous collections if present
    const collectionType = event.target.closest('li').getAttribute(['data-collection-type-id']);
    renderCollection(collectionType);
    viewSwap('collections');
  }
});

function renderIcon(object) { // render an icon square with data from acnhObject
  /*  <div data-collection-id="" class="collection-card">
  *      <span class="label hidden">???</span>
  *      <img class="collection-icon not-acquired-overlay" src="https://acnhapi.com/v1/icons/fish/1" alt="turtle-img">
  *   </div>
  */
  const $cardDiv = document.createElement('div');
  $cardDiv.setAttribute('data-collection-id', object.name);
  $cardDiv.className = 'collection-card';

  const $labelSpan = document.createElement('span');
  $labelSpan.className = 'label label-not-acquired-bg hidden';
  $labelSpan.textContent = '???';

  const $cardIcon = document.createElement('img');
  if (object.acquired === false) {
    $cardIcon.className = 'collection-icon not-acquired-overlay';
  } else {
    $cardIcon.className = 'collection-icon';
  }

  $cardIcon.src = object.iconUrl;
  $cardIcon.alt = object.name + 'img';

  $cardDiv.append($labelSpan, $cardIcon);

  return $cardDiv;
}

function renderTable(itemArray) {
  const columnLength = 5;
  let $newLi;
  for (let i = 0; i < itemArray.length; i++) {
    if (i % columnLength === 0) { // columns should have 5 items
      if (i !== 0) {
        $slideContainer.append($newLi);
      }
      $newLi = document.createElement('li');
      $newLi.className = 'slide flex-column';
    }
    $newLi.append(renderIcon(itemArray[i]));
    if (i === itemArray.length - 1) { // catch final column
      $slideContainer.append($newLi);
    }
  }
}

function renderCollection(collectionType) {
  switch (collectionType) {
    case 'fish':
      if (data.collectionData.fish === undefined) { // if a user collection does not exist create a new one
        getFishCollectionItems();
      } else { // if a user collection does exist, use that one
        renderTable(data.collectionData.fish);
      }
      $collectionImage.src = 'images/Collections/fish-col.png';
      $collectionProgressCount.textContent = '0/80';
      data.currentCollection = 'fish';
      break;

    case 'bugs':
      if (data.collectionData.bugs === undefined) {
        getBugCollectionItems();
      } else {
        renderTable(data.collectionData.bugs);
      }
      $collectionImage.src = 'images/Collections/butterfly-col.png';
      $collectionProgressCount.textContent = '0/80';
      data.currentCollection = 'bugs';
      break;

    case 'sea':
      if (data.collectionData.sea === undefined) {
        getSeaCollectionItems();
      } else {
        renderTable(data.collectionData.sea);
      }
      $collectionImage.src = 'images/Collections/sea-col.png';
      $collectionProgressCount.textContent = '0/40';
      data.currentCollection = 'sea';
      break;

    case 'fossils':
      if (data.collectionData.fossils === undefined) {
        getFossilCollectionItems();
      } else {
        renderTable(data.collectionData.fossils);
      }
      $collectionImage.src = 'images/Collections/fossil-col.png';
      $collectionProgressCount.textContent = '0/73';
      data.currentCollection = 'fossils';
      break;

    case 'art':
      if (data.collectionData.art === undefined) {
        getArtCollectionItems();
      } else {
        renderTable(data.collectionData.art);
      }
      $collectionImage.src = 'images/Collections/art-col.png';
      $collectionProgressCount.textContent = '0/43';
      data.currentCollection = 'art';
      break;
  }
  updateCurrentCollectionProgress();
}

// Collection Interactivity //

const $closeModal = document.querySelector('.close-modal-btn');
const $collectionModal = document.querySelector('.collection-modal');

$slider.addEventListener('mouseup', function (event) { // handles the click events on the collection table
  if (event.target.tagName === 'IMG') {
    if (!isDragging) {
      renderCollectionModal(event.target.closest('div').getAttribute(['data-collection-id']));
      $collectionModal.classList.remove('hidden');
    }
  }
});

$slider.addEventListener('mouseover', function (event) { // add
  handleLabelHover(event);
});

function handleLabelHover(event) { // add label to currently hovered collection card and remove from rest
  if (event.target.tagName === 'IMG') {
    const $collectionLabels = document.querySelectorAll('.label');
    const $hoveredDiv = event.target.closest('div');
    const $hoveredLabel = $hoveredDiv.firstElementChild;
    for (let i = 0; i < $collectionLabels.length; i++) { // iterate through all labels
      if ($hoveredLabel === $collectionLabels[i]) { // if label is the one we want...
        const hoveredDataId = $hoveredDiv.getAttribute(['data-collection-id']); // grab the dataID
        for (let i = 0; i < data.collectionData[data.currentCollection].length; i++) { // iterate through all collection data
          if (data.collectionData[data.currentCollection][i].name === hoveredDataId) { // find the collection item that matches the dataID
            if (data.collectionData[data.currentCollection][i].acquired === true) {
              $hoveredLabel.textContent = toTitleCase(data.collectionData[data.currentCollection][i].name); // if the fish is acquired, add it's name
              $hoveredLabel.classList.remove('label-not-acquired-bg');
              $hoveredLabel.classList.add('label-acquired-bg');
            } else {
              $hoveredLabel.textContent = '???'; // else, add the question mark text
              $hoveredLabel.classList.add('label-not-acquired-bg');
              $hoveredLabel.classList.remove('label-acquired-bg');
            }
          }
        }
        $collectionLabels[i].classList.remove('hidden');
      } else {
        $collectionLabels[i].classList.add('hidden');
      }
    }
  }
}

$slider.addEventListener('mouseleave', function (event) {
  removeAllLabels();
});

function removeAllLabels(event) { // remove all labels from collection cards
  const $collectionLabels = document.querySelectorAll('.label');
  for (let i = 0; i < $collectionLabels.length; i++) {
    $collectionLabels[i].classList.add('hidden');
  }
}

function toTitleCase(string) {
  let output = '';
  output += string[0].toUpperCase();
  for (let i = 1; i < string.length; i++) {
    output += string[i];
  }
  return output;
}

$closeModal.addEventListener('click', closeModal);

function closeModal() {
  $collectionModal.classList.add('hidden');
}

// All Collection Modals //
const $name = document.querySelector('div.fish-modal h2.modal-title');
const $heroImg = document.querySelector('div.fish-modal img.modal-hero-img');
const $acquiredBtn = document.querySelector('div.fish-modal button.acquired-btn');
const $acquiredIcon = document.querySelector('div.fish-modal i.caught-mark');
const $infoContainer = document.querySelector('.info-container');

// Fish, Bug, & Sea Collection Uniques // (fbs --> fish / bug /sea)

function renderTimeLocationInfo(creatureObj) {
  /*  <li class="loc-time-box row-no-wrap mb-half-rem">
  *     <div class="column-25 flex-column gap-half-rem">
  *       <p class="blue-sm-tag">Location</p>
  *       <p class="blue-sm-tag">Time</p>
  *     </div>
  *     <div class="column-75 flex-column gap-half-rem">
  *       <p class="white-info-tag location">Pond</p>
  *       <p class="white-info-tag time">9 AM - 4 PM</p>
  *     </div>
  *  </li>
  */
  const $locTimeLi = document.createElement('li');
  $locTimeLi.className = 'loc-time-box row-no-wrap mb-half-rem';

  const $labelDiv = document.createElement('div');
  $labelDiv.className = 'column-25 flex-column gap-half-rem';

  const $locationP = document.createElement('p');
  $locationP.className = 'blue-sm-tag';
  $locationP.textContent = 'Location';
  const $timeP = document.createElement('p');
  $timeP.classList = 'blue-sm-tag';
  $timeP.textContent = 'Time';

  const $infoDiv = document.createElement('div');
  $infoDiv.className = 'column-75 flex-column gap-half-rem';

  const $locationInfoP = document.createElement('p');
  $locationInfoP.className = 'white-info-tag';
  $locationInfoP.textContent = creatureObj.location;

  const $timeInfoP = document.createElement('p');
  $timeInfoP.className = 'white-info-tag';
  $timeInfoP.textContent = creatureObj['north-availability'][0].time;

  $labelDiv.append($locationP, $timeP);
  $infoDiv.append($locationInfoP, $timeInfoP);
  $locTimeLi.append($labelDiv, $infoDiv);

  return $locTimeLi;
}

function renderMonths(columnWidth, creatureObj) {
  /*   <div class="columnWidth row-no-wrap gap-1-rem justify-around month-container">
  *       <div class="fb-20">
  *         <div data-month-id="1" class="month-card month-active">Jan</div>
  *         <div data-month-id="5" class="month-card">May</div>
  *         <div data-month-id="9" class="month-card">Sep</div>
  *       </div>
  *       <div class="fb-20">
  *         <div data-month-id="2" class="month-card month-active">Feb</div>
  *         <div data-month-id="6" class="month-card">Jun</div>
  *         <div data-month-id="10" class="month-card">Oct</div>
  *       </div>
  *       <div class="fb-20">
  *         <div data-month-id="3" class="month-card month-active">Mar</div>
  *         <div data-month-id="7" class="month-card">Jul</div>
  *         <div data-month-id="11" class="month-card month-active">Nov</div>
  *       </div>
  *       <div class="fb-20">
  *         <div data-month-id="4" class="month-card month-active">Apr</div>
  *         <div data-month-id="8" class="month-card">Aug</div>
  *         <div data-month-id="12" class="month-card month-active">Dec</div>
  *       </div>
  *    </div>
  */
  const monthsNameArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthDivs = [];
  const $monthContainerDiv = document.createElement('div');
  $monthContainerDiv.className = 'row-no-wrap gap-1-rem justify-around month-container';
  $monthContainerDiv.classList.add(`column-${columnWidth}`);

  for (let i = 0; i < monthsNameArray.length; i++) {
    const $monthDiv = document.createElement('div');
    $monthDiv.setAttribute('data-month-id', i + 1);
    $monthDiv.className = 'month-card';
    $monthDiv.textContent = monthsNameArray[i];
    monthDivs.push($monthDiv);
    if (creatureObj['north-months'].includes(i + 1)) {
      $monthDiv.classList.add('month-active');
    }
  }

  const $monthColumnDiv1 = document.createElement('div');
  $monthColumnDiv1.className = 'fb-20';
  $monthColumnDiv1.append(monthDivs[0], monthDivs[4], monthDivs[8]);

  const $monthColumnDiv2 = document.createElement('div');
  $monthColumnDiv2.className = 'fb-20';
  $monthColumnDiv2.append(monthDivs[1], monthDivs[5], monthDivs[9]);

  const $monthColumnDiv3 = document.createElement('div');
  $monthColumnDiv3.className = 'fb-20';
  $monthColumnDiv3.append(monthDivs[2], monthDivs[6], monthDivs[10]);

  const $monthColumnDiv4 = document.createElement('div');
  $monthColumnDiv4.className = 'fb-20';
  $monthColumnDiv4.append(monthDivs[3], monthDivs[7], monthDivs[11]);

  $monthContainerDiv.append($monthColumnDiv1, $monthColumnDiv2, $monthColumnDiv3, $monthColumnDiv4);

  return $monthContainerDiv;
}

// Fish Uniques //

function renderFishInfo(fishObject) {
  /* <li class="uniques-box">
  *   <div class="row-no-wrap mb-half-rem">
  *     <div class="column-25 flex-column gap-half-rem">
  *       <p class="blue-sm-tag">Shadow</p>
  *     </div>
  *     <div class="column-75 flex-column gap-half-rem">
  *       <p class="blue-med-tag">Seasonality</p>
  *     </div>
  *   </div>
  *   <div class="row-no-wrap gap-half-rem">
  *     <div class="column-25 text-align-center fish-shadow-card">
  *       <img class="fish-size-img shadow" src="images/Fish/fish-size-6.png">
  *       <p class="fish-size-label row justify-and-align-center">6</p>
  *       <a class="shadow-reference" target="_blank" href="https://tunnaa-unnaa.tumblr.com/image/620023127192354817">Need a reference?</a>
  *     </div>
  *     renderMonthsHere()
  *   </div>
  * </li>
  */
  const $uniquesLi = document.createElement('li');
  $uniquesLi.classList = 'uniques-box';

  const $labelDiv = document.createElement('div');
  $labelDiv.className = 'row-no-wrap mb-half-rem';

  const $shadowColumnDiv = document.createElement('div');
  $shadowColumnDiv.className = 'column-25 flex-column gap-half-rem';

  const $shadowColumnP = document.createElement('p');
  $shadowColumnP.className = 'blue-sm-tag';
  $shadowColumnP.textContent = 'Shadow';

  const $seasonColumnDiv = document.createElement('div');
  $seasonColumnDiv.className = 'column-75 flex-column gap-half-rem';

  const $seasonColumnP = document.createElement('p');
  $seasonColumnP.className = 'blue-med-tag';
  $seasonColumnP.textContent = 'Seasonality';

  const $infoDiv = document.createElement('div');
  $infoDiv.className = 'row-no-wrap gap-half-rem';

  const $shadowInfoDiv = document.createElement('div');
  $shadowInfoDiv.className = 'column-25 text-align-center fish-shadow-card';

  const $shadowImg = document.createElement('img');
  $shadowImg.className = 'fish-size-img shadow';
  const curFishShadowData = getFishShadowImg(fishObject.shadow);
  $shadowImg.src = curFishShadowData.src;
  $shadowImg.alt = 'fish-shadow-img';

  const $shadowP = document.createElement('p');
  $shadowP.className = 'fish-size-label row justify-and-align-center';
  $shadowP.textContent = curFishShadowData.label;

  const $shadowLink = document.createElement('a');
  $shadowLink.className = 'shadow-reference';
  $shadowLink.setAttribute('target', '_blank');
  $shadowLink.setAttribute('href', 'https://tunnaa-unnaa.tumblr.com/image/620023127192354817'); // add fishobject info here
  $shadowLink.textContent = 'Need a reference?';

  const $monthsDiv = renderMonths(75, fishObject);

  $shadowInfoDiv.append($shadowImg, $shadowP, $shadowLink);
  $infoDiv.append($shadowInfoDiv, $monthsDiv);
  $seasonColumnDiv.append($seasonColumnP);
  $shadowColumnDiv.append($shadowColumnP);
  $labelDiv.append($shadowColumnDiv, $seasonColumnDiv);
  $uniquesLi.append($labelDiv, $infoDiv);

  return $uniquesLi;
}

// Bugs Uniques //

function renderBugInfo(bugObject) {
  /* <li class="uniques-box">
  *    <div class="row-no-wrap">
  *       <p class="blue-med-tag">Seasonality</p>
  *    </div>
  *    <monthshere()>
  *  </li>
  */
  const $uniquesLi = document.createElement('li');
  $uniquesLi.classList = 'uniques-box';

  const $labelDiv = document.createElement('div');
  $labelDiv.className = 'row-no-wrap justify-center';

  const $seasonP = document.createElement('p');
  $seasonP.className = 'blue-med-tag-no-m mb-half-rem';
  $seasonP.textContent = 'Seasonality';

  const $monthsDiv = renderMonths(100, bugObject);

  $labelDiv.append($seasonP);
  $uniquesLi.append($labelDiv, $monthsDiv);

  return $uniquesLi;
}

// Sea Uniques //

function renderSeaInfo(seaObject) {
  /* <li class="uniques-box">
  *   <div class="row-no-wrap mb-half-rem">
  *     <div class="column-25">
  *       <p class="blue-sm-tag">Speed</p>
  *     <div class="column-75 flex-column gap-half-rem">
  *       <p class="white-info-tag">Fast</p>
  *     </div>
  *   </div>
  *   <div class="row-no-wrap mb-half-rem">
  *     <div class="column-25 flex-column gap-half-rem">
  *       <p class="blue-sm-tag">Shadow</p>
  *     </div>
  *     <div class="column-75 flex-column gap-half-rem">
  *       <p class="blue-med-tag">Seasonality</p>
  *     </div>
  *   </div>
  *   <div class="row-no-wrap gap-half-rem">
  *     <div class="column-25 text-align-center fish-shadow-card">
  *       <img class="fish-size-img shadow" src="images/Fish/fish-size-6.png">
  *       <p class="fish-size-label row justify-and-align-center">6</p>
  *       <a class="shadow-reference" target="_blank" href="https://tunnaa-unnaa.tumblr.com/image/620023127192354817">Need a reference?</a>
  *     </div>
  *     renderMonthsHere()
  *   </div>
  * </li>
  */
  const $uniquesLi = document.createElement('li');
  $uniquesLi.classList = 'uniques-box';

  const $speedDiv = document.createElement('div');
  $speedDiv.className = 'row-no-wrap mb-half-rem';

  const $speedLabelColumn = document.createElement('div');
  $speedLabelColumn.className = 'column-25';

  const $speedInfoColumn = document.createElement('div');
  $speedInfoColumn.className = 'column-75';

  const $speedLabelP = document.createElement('p');
  $speedLabelP.textContent = 'Speed';
  $speedLabelP.className = 'blue-sm-tag';

  const $speedInfoP = document.createElement('p');
  $speedInfoP.textContent = seaObject['shadow-movement'];
  $speedInfoP.className = 'white-info-tag';

  const $labelDiv = document.createElement('div');
  $labelDiv.className = 'row-no-wrap mb-half-rem';

  const $shadowColumnDiv = document.createElement('div');
  $shadowColumnDiv.className = 'column-25 flex-column gap-half-rem';

  const $shadowColumnP = document.createElement('p');
  $shadowColumnP.className = 'blue-sm-tag';
  $shadowColumnP.textContent = 'Shadow';

  const $seasonColumnDiv = document.createElement('div');
  $seasonColumnDiv.className = 'column-75 flex-column gap-half-rem';

  const $seasonColumnP = document.createElement('p');
  $seasonColumnP.className = 'blue-med-tag';
  $seasonColumnP.textContent = 'Seasonality';

  const $infoDiv = document.createElement('div');
  $infoDiv.className = 'row-no-wrap gap-half-rem';

  const $shadowInfoDiv = document.createElement('div');
  $shadowInfoDiv.className = 'column-25 text-align-center fish-shadow-card';

  const $shadowImg = document.createElement('img');
  $shadowImg.className = 'fish-size-img shadow';
  const curSeaShadowData = getSeaShadowImg(seaObject['shadow-size']);
  $shadowImg.src = curSeaShadowData.src;
  $shadowImg.alt = 'sea-shadow-img';

  const $shadowP = document.createElement('p');
  $shadowP.className = 'fish-size-label row justify-and-align-center';
  $shadowP.textContent = curSeaShadowData.label;

  const $shadowLink = document.createElement('a');
  $shadowLink.className = 'shadow-reference';
  $shadowLink.setAttribute('target', '_blank');
  $shadowLink.setAttribute('href', 'https://i.redd.it/eevwll228q851.jpg');
  $shadowLink.textContent = 'Need a reference?';

  const $monthsDiv = renderMonths(75, seaObject);

  $speedLabelColumn.append($speedLabelP);
  $speedInfoColumn.append($speedInfoP);
  $speedDiv.append($speedLabelColumn, $speedInfoColumn);
  $shadowInfoDiv.append($shadowImg, $shadowP, $shadowLink);
  $infoDiv.append($shadowInfoDiv, $monthsDiv);
  $seasonColumnDiv.append($seasonColumnP);
  $shadowColumnDiv.append($shadowColumnP);
  $labelDiv.append($shadowColumnDiv, $seasonColumnDiv);
  $uniquesLi.append($speedDiv, $labelDiv, $infoDiv);

  return $uniquesLi;
}

// Fossil Uniques //

function renderFossilInfo(fossilObj) {
  /* <li class="row-no-wrap mb-half-rem">
  *   <div class="column-25 flex-column gap-half-rem">
  *     <p class="blue-sm-tag">Group</p>
  *     <p class="blue-sm-tag">HHA</p>
  *   </div>
  *   <div class="column-75 flex-column gap-half-rem">
  *     <p class="white-info-tag location">Spinosaurus</p>
  *     p class="white-info-tag time">85</p>
  *   </div>
  *   </li>
  */
  const $uniquesLi = document.createElement('li');
  $uniquesLi.className = 'row-no-wrap mb-half-rem';

  const $labelDiv = document.createElement('div');
  $labelDiv.className = 'column-25 flex-column gap-half-rem';

  const $groupP = document.createElement('p');
  $groupP.className = 'blue-sm-tag';
  $groupP.textContent = 'Group';

  const $hhaP = document.createElement('p');
  $hhaP.classList = 'blue-sm-tag';
  $hhaP.textContent = 'HHA';

  const $infoDiv = document.createElement('div');
  $infoDiv.className = 'column-75 flex-column gap-half-rem';

  const $groupInfoP = document.createElement('p');
  $groupInfoP.className = 'white-info-tag';
  $groupInfoP.textContent = fossilObj['fossil-group'];

  const $hhaInfoP = document.createElement('p');
  $hhaInfoP.className = 'white-info-tag';
  $hhaInfoP.textContent = fossilObj['hha-score'];

  $labelDiv.append($groupP, $hhaP);
  $infoDiv.append($groupInfoP, $hhaInfoP);
  $uniquesLi.append($labelDiv, $infoDiv);

  return $uniquesLi;
}

// Art Uniques //

function renderArtInfo(artObject) {
  /* <li class="uniques-box">
  /*   <div class="row-no-wrap mb-half-rem">
  *     <div class="column-25 flex-column gap-half-rem">
  *       <p class="blue-sm-tag">Name</p>
  *       <p class="blue-sm-tag">Author</p>
  *       <p class="blue-sm-tag">Year</p>
  *     </div>
  *     <div class="column-75 flex-column gap-half-rem">
  *       <p class="white-info-tag">artObject.art_name</p>
  *       <p class="white-info-tag">artObject.author</p>
  *       <p class="white-info-tag">artObject.year</p>
  *     </div>
  *   </div>
  *   <div class="row-no-wrap">
  *     <p class="blue-med-tag">Seasonality</p>
  *   </div>
  *   <div class="row-no-wrap">
  *     <p class="white-info-tag">Autheniticity Information</p>
  *   </div>
  *   <div class="row-no-wrap justify-center">
  *     <p class='fake-reference'>---- Show Fake? ----</p>
  *   </div>
  *  </li>
  */

  const $uniquesLi = document.createElement('li');
  $uniquesLi.classList = 'uniques-box';

  const $artExtraInfoDiv = document.createElement('div');
  $artExtraInfoDiv.className = 'row-no-wrap mb-half-rem';

  const $artLabelColumn = document.createElement('div');
  $artLabelColumn.className = 'column-25 flex-column gap-half-rem';

  const $realNameLabelP = document.createElement('p');
  $realNameLabelP.className = 'blue-sm-tag';
  $realNameLabelP.textContent = 'Name';

  const $realAuthorLabelP = document.createElement('p');
  $realAuthorLabelP.className = 'blue-sm-tag';
  $realAuthorLabelP.textContent = 'Author';

  const $realTimeLabelP = document.createElement('p');
  $realTimeLabelP.className = 'blue-sm-tag';
  $realTimeLabelP.textContent = 'Time';

  const $artInfoColumn = document.createElement('div');
  $artInfoColumn.className = 'column-75 flex-column gap-half-rem';

  const $realNameInfoP = document.createElement('p');
  $realNameInfoP.className = 'white-info-tag';
  $realNameInfoP.textContent = artObject['art-name'];

  const $realAuthorInfoP = document.createElement('p');
  $realAuthorInfoP.className = 'white-info-tag';
  $realAuthorInfoP.textContent = artObject.author;

  const $realTimeInfoP = document.createElement('p');
  $realTimeInfoP.className = 'white-info-tag';
  $realTimeInfoP.textContent = artObject.year;

  const $labelAuthentDiv = document.createElement('div');
  $labelAuthentDiv.className = 'row-no-wrap justify-center';

  const $infoAuthentDiv = document.createElement('div');
  $infoAuthentDiv.className = 'row-no-wrap mb-half-rem';

  const $authenticLabelP = document.createElement('p');
  $authenticLabelP.className = 'blue-med-tag-no-m mb-half-rem';
  $authenticLabelP.textContent = 'Authenticity';

  const $authenticInfoP = document.createElement('p');
  $authenticInfoP.className = 'white-info-tag-no-m';
  $authenticInfoP.textContent = artObject.authenticity;

  const $modalHeroImgDiv = document.querySelector('.modal-hero-div');

  $artLabelColumn.append($realNameLabelP, $realAuthorLabelP, $realTimeLabelP);
  $artInfoColumn.append($realNameInfoP, $realAuthorInfoP, $realTimeInfoP);
  $artExtraInfoDiv.append($artLabelColumn, $artInfoColumn);
  $labelAuthentDiv.append($authenticLabelP);
  $infoAuthentDiv.append($authenticInfoP);
  $uniquesLi.append($artExtraInfoDiv, $labelAuthentDiv, $infoAuthentDiv);

  if (artObject.hasFake === true) { // if art has a fake, we need to attach fake functionality
    const $fakeImg = document.createElement('img');
    $fakeImg.className = 'modal-hero-img hidden';
    $fakeImg.src = artObject.fakeVersion;
    $modalHeroImgDiv.append($fakeImg);

    if ($modalHeroImgDiv.children.length === 3) { // remove lingering fakes from previous modal
      $modalHeroImgDiv.children[1].remove();
    }

    const $hasFakeBtnDiv = document.createElement('div');
    $hasFakeBtnDiv.className = 'row-no-wrap justify-center';

    const $hasFakeBtn = document.createElement('p');
    $hasFakeBtn.className = 'fake-reference';
    $hasFakeBtn.textContent = '---------- Show Fake? ----------';
    $hasFakeBtn.addEventListener('click', function (event) {
      $fakeImg.classList.toggle('hidden');
    });
    $hasFakeBtnDiv.append($hasFakeBtn);
    $uniquesLi.append($hasFakeBtnDiv);
  } else {
    if ($modalHeroImgDiv.children.length === 2) { // remove lingering fakes from previous modal
      $modalHeroImgDiv.children[1].remove();
    }
  }
  return $uniquesLi;
}

$acquiredBtn.addEventListener('click', function () {
  if (data.currentCollectionItem.acquired === false) {
    data.currentCollectionItem.acquired = true;
    handleAcquiredItem(data.currentCollectionItem.name);
  } else { // fish has been acquired --> user wants to revert to not acquired
    data.currentCollectionItem.acquired = false;
    handleNotAcquiredItem(data.currentCollectionItem.name);
  }
});

function renderCollectionModal(itemToRender) { // takes an item name to render for the modal
  $infoContainer.textContent = ''; // clears modal of all extra add-on information
  for (let i = 0; i < data.collectionData[data.currentCollection].length; i++) {
    if (data.collectionData[data.currentCollection][i].name === itemToRender) {
      data.currentCollectionItem = data.collectionData[data.currentCollection][i];
      $heroImg.src = data.collectionData[data.currentCollection][i].imageUrl;
      if (data.currentCollection === 'fish' || data.currentCollection === 'bugs' || data.currentCollection === 'sea') {
        $infoContainer.append(renderTimeLocationInfo(data.collectionData[data.currentCollection][i]));
      }
      switch (data.currentCollection) {
        case 'fish':
          $infoContainer.append(renderFishInfo(data.collectionData[data.currentCollection][i]));
          break;
        case 'bugs':
          $infoContainer.append(renderBugInfo(data.collectionData[data.currentCollection][i]));
          break;
        case 'sea':
          $infoContainer.append(renderSeaInfo(data.collectionData[data.currentCollection][i]));
          break;
        case 'fossils':
          $infoContainer.append(renderFossilInfo(data.collectionData[data.currentCollection][i]));
          break;
        case 'art':
          $infoContainer.append(renderArtInfo(data.collectionData[data.currentCollection][i]));
          break;
      }

      if (data.collectionData[data.currentCollection][i].acquired === true) {
        handleAcquiredItem(itemToRender);
      } else {
        handleNotAcquiredItem(itemToRender);
      }
    }
  }
}

function handleAcquiredItem(itemName) {
  $acquiredBtn.className = 'acquired-btn caught-btn-green';
  $acquiredIcon.className = 'fa-regular fa-circle-check caught-mark';
  $heroImg.classList.remove('not-acquired-overlay');
  $name.textContent = itemName;
  changeIconFilter('remove', itemName);
  updateCurrentCollectionProgress();
}

function handleNotAcquiredItem(itemName) {
  $acquiredBtn.className = 'acquired-btn caught-btn-red';
  $acquiredIcon.className = 'fa-regular fa-circle-xmark caught-mark';
  $heroImg.classList.add('not-acquired-overlay');
  $name.textContent = '???';
  changeIconFilter('add', itemName);
  updateCurrentCollectionProgress();
}

function changeIconFilter(action, iconName) { // either adds or removes the dark icon filter
  const $allCards = document.querySelectorAll('.collection-card');
  for (let i = 0; i < $allCards.length; i++) {
    if ($allCards[i].getAttribute(['data-collection-id']) === iconName) {
      if (action === 'remove') {
        $allCards[i].children[1].classList.remove('not-acquired-overlay');
      } else {
        $allCards[i].children[1].classList.add('not-acquired-overlay');
      }
    }
  }
}

function getFishShadowImg(shadowSize) { // returns the appropriate link and label number for a fish shadow size input
  const apiFishShadowSizes = {
    Tiny: { src: 'images/Fish/fish-size-1.png', label: 1 },
    Small: { src: 'images/Fish/fish-size-2.png', label: 2 },
    Medium: { src: 'images/Fish/fish-size-3.png', label: 3 },
    Large: { src: 'images/Fish/fish-size-4.png', label: 4 },
    'Very large': { src: 'images/Fish/fish-size-5.png', label: 5 },
    Huge: { src: 'images/Fish/fish-size-6.png', label: 6 },
    'Very large (finned)': { src: 'images/Fish/fish-size-shark.jpg', label: 'fin' },
    Long: { src: 'images/Fish/fish-size-eel.jpg', label: 'eel' }
  };
  for (const key in apiFishShadowSizes) {
    if (shadowSize === key) {
      return apiFishShadowSizes[key];
    }
  }
}

function getSeaShadowImg(shadowSize, shadowSpeed) {
  const apiSeaShadowSizes = {
    Tiny: { src: 'images/Sea/sea-small.jpg', label: 1 },
    Small: { src: 'images/Sea/sea-small.jpg', label: 2 },
    Medium: { src: 'images/Sea/sea-medium.jpg', label: 3 },
    Large: { src: 'images/Sea/sea-large.jpg', label: 4 }
  };
  for (const key in apiSeaShadowSizes) {
    if (shadowSize === key) {
      return apiSeaShadowSizes[key];
    }
  }
}

function inventoryCollection(collectionType) { // returns a string with the current collection count and collection-max
  const collectionMaxes = {
    fish: 80,
    bugs: 80,
    sea: 40,
    fossils: 73,
    art: 43
  };
  if (collectionMaxes[collectionType] && data.collectionData[collectionType]) {
    const total = data.collectionData[collectionType].reduce((total, collection) => {
      if (collection.acquired) {
        return total + 1;
      }
      return total;
    }, 0);
    const currentCollectionCount = total;
    const currentCollectionMax = collectionMaxes[collectionType];
    return currentCollectionCount + '/' + currentCollectionMax;
  } else { // catch case that collection data is not created yet
    return '0/80';
  }
}

function updateHomeCollectionProgress() { // update collection status of all home page collections
  const collections = ['fish', 'bugs', 'sea', 'fossils', 'art'];
  for (let i = 0; i < collections.length; i++) {
    const $currentCollection = document.querySelector(`[data-collection-type-id="${collections[i]}"]`);
    const $currentLabel = $currentCollection.children[2].children[0];
    $currentLabel.textContent = inventoryCollection(collections[i]);
    const $currentProgressBar = $currentCollection.children[1].children[0];
    const splitStatus = inventoryCollection(collections[i]).split('/');
    const percentDone = Number(splitStatus[0]) / Number(splitStatus[1]);
    $currentProgressBar.style.width = `${percentDone * 100}%`;
  }
}

function updateCurrentCollectionProgress() {
  const $currentCollectionLabel = document.querySelector('.collection-count.current-collection');
  $currentCollectionLabel.textContent = inventoryCollection(data.currentCollection);
  const $currentCollectionBar = document.querySelector('.progress-bar.current-collection');
  const splitStatus = inventoryCollection(data.currentCollection).split('/');
  const percentDone = Number(splitStatus[0]) / Number(splitStatus[1]);
  $currentCollectionBar.style.width = `${percentDone * 100}%`;
}
