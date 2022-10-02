// Global Variables //

var villagerQuotes = [
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

var allVillagers = [];
var thisWeeksEvents = [];
var $defaultText = createDefaultText();
var $birthdayDefText = createBirthdayDefaultText();

// Event Listeners //

var $fruitContainer = document.querySelector('.fruit-container');
var $fruits = document.querySelectorAll('.fruit-img');
var $searchVillagerBtn = document.querySelector('.search-villager-btn');
var $addVillagerInput = document.querySelector('.new-villager-input');
var $addVillagerBtn = document.querySelector('.add-villager-btn');
var $removeVillagerBtn = document.querySelector('.remove-villager-btn');
var $villagerDatalist = document.querySelector('.villager-datalist');
var $villagerEntryList = document.querySelector('.villager-entry-list');
var $townForm = document.querySelector('.town-form');
var $formTitle = document.querySelector('.town-form-title');
var $imageInput = document.querySelector('.image-input');
var $townImage = document.querySelector('.town-img');
var $townContainer = document.querySelector('.town-container');

// New Town Input Form //

window.addEventListener('DOMContentLoaded', function (event) {
  getCurrentEvents();
  if (data.towns.length === 0) {
    $townContainer.append($defaultText);
  }

  for (let i = 0; i < data.towns.length; i++) {
    var previousTown = renderTown(data.towns[i]);
    $townContainer.append(previousTown);
  }
  viewSwap(data.view);
});

$imageInput.addEventListener('change', function (event) {
  getImgData();
});

function getImgData() {
  var files = $imageInput.files[0];
  if (files) {
    var fileReader = new FileReader();
    fileReader.readAsDataURL(files);
    fileReader.addEventListener('load', function () {
      $townImage.src = this.result;
    });
  }
}

$fruitContainer.addEventListener('click', handleFruitClick);

function handleFruitClick(event) { // highlight the clicked fruit with a soft yellow background
  if (event.target.tagName === 'INPUT') {
    var parentDiv = (event.target.closest('div'));
    var labelChild = parentDiv.firstElementChild;
    var fruitImg = labelChild.firstElementChild;
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
    var $villagerDataTag = document.createElement('option');
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
      var $entryChildren = $villagerEntryList.children;
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
  var $newLi = document.createElement('li');
  $newLi.setAttribute('data-villager-id', villagerName);

  var $newDiv = document.createElement('div');
  $newDiv.className = 'villager-card justify-and-align-center';

  var $villagerIcon = document.createElement('img');
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
  var $newBDLi = document.createElement('li');
  $newBDLi.setAttribute('data-villager-id', villagerName);
  $newBDLi.className = 'row-no-wrap pl-1-rem align-center';

  var $newIconDiv = document.createElement('div');
  $newIconDiv.className = 'villager-card justify-and-align-center';

  var $villagerIcon = document.createElement('img');
  $villagerIcon.className = 'villager-icon';
  $villagerIcon.src = imageUrl;

  var $bdTextDiv = document.createElement('div');
  $bdTextDiv.className = 'birthday-text row align-center';

  var $bdTextH3 = document.createElement('h3');
  $bdTextH3.textContent = villagerName + '\'s' + ' birthday!';
  $bdTextH3.className = 'pl-1-rem fw-500';

  $newIconDiv.append($villagerIcon);
  $bdTextDiv.append($bdTextH3);
  $newBDLi.append($newIconDiv, $bdTextDiv);

  return $newBDLi;
}

function clearVillagers() { // clears villagers from the DOM
  while ($villagerEntryList.children.length > 1) {
    var $lastVillager = $villagerEntryList.lastChild;
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
  var formData = {};
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
  var $nodeToReplace = document.querySelector(`li[data-entry-id="${data.editing.entryID}"]`);
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
  var $parentLi = document.createElement('li');
  $parentLi.setAttribute('data-entry-id', townObj.entryID);
  $parentLi.className = 'row mb-1-rem';

  var $titleDiv = document.createElement('div');
  $titleDiv.className = 'row column-full';

  var $titleH2 = document.createElement('h2');
  $titleH2.className = 'fw-500';
  $titleH2.textContent = townObj.townName;

  var $imageColumnDiv = document.createElement('div');
  $imageColumnDiv.className = 'column-half';

  var $imageHeroDiv = document.createElement('div');
  $imageHeroDiv.className = 'town-hero-img justify-and-align-center';
  if (townObj.imageLink !== 'http://localhost:5500/images/placeholder-image-square.jpg') {
    $imageHeroDiv.style.backgroundImage = 'url(' + townObj.imageLink + ')';
  } else {
    $imageHeroDiv.classList.add('default-hero-img');
  }

  var $overlayDiv = document.createElement('div');
  $overlayDiv.className = 'overlay';

  var $jumpInButton = document.createElement('button');
  $jumpInButton.type = 'button';
  $jumpInButton.className = 'overlay-town-btn';
  $jumpInButton.textContent = 'Jump back in!';

  var $villagerColumnDiv = document.createElement('div');
  $villagerColumnDiv.className = 'column-half';

  var $villagerUl = document.createElement('ul');
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
  var output = document.createElement('p');
  output.className = 'text-align-center default-text';
  output.textContent = 'No towns have been recorded... yet!';
  return output;
}

function createBirthdayDefaultText() {
  /* <li class="birthday-default-text row align-center">
  *   <h3 class="pl-1-rem event-text fw-500">No Birthdays Today...</h3>
  * </li>
  */
  var $parentLi = document.createElement('li');
  $parentLi.className = 'birthday-default-text row align-center';

  var $childh3 = document.createElement('h3');
  $childh3.className = 'pl-1-rem event-text fw-500';
  $childh3.textContent = 'No Birthdays Today...';

  $parentLi.append($childh3);
  return $parentLi;
}

// Edit Town //

var $editTownBtn = document.querySelector('.edit-icon');

$editTownBtn.addEventListener('click', function (event) { // preload all town information into the town form for editing
  data.editing = data.currentTown;
  $formTitle.textContent = 'Edit Town';
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
  viewSwap('town-entry-form');
});

// Town Home Page //

var $homeFruit = document.querySelector('.home-page-fruit');
var $homeDate = document.querySelector('.home-page-date');
var $homeTownName = document.querySelector('.home-page-town-name');
var $homeVillagerUl = document.querySelector('.home-page-villagers');
var $homeImageCont = document.querySelector('.home-page-image');
var $birthdayUl = document.querySelector('.birthday-container');
var $villagerQuote = document.querySelector('.villager-quote');
var $villagerQuoteTag = document.querySelector('.villager-quote-tag');
var $eventsContainer = document.querySelector('.events-container');

$townContainer.addEventListener('click', function (event) { // on 'jump back in' btn press, pass correct townObj to rendertown function
  if (event.target.tagName === 'BUTTON') {
    var dataID = parseInt(event.target.closest('li').getAttribute(['data-entry-id']));
    for (let i = 0; i < data.towns.length; i++) {
      if (data.towns[i].entryID === dataID) {
        renderHomePage(data.towns[i]);
        viewSwap('town-home-page');
      }
    }
  }
});

function renderHomePage(townObj) {
  var birthdayVillagers = [];

  // render the town data //
  data.currentTown = townObj;
  $homeFruit.src = 'images/Fruits/' + townObj.townFruit + '.png';
  $homeDate.textContent = getDate();
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
  var eventsToRender = filterEvents(thisWeeksEvents);
  for (let i = 0; i < eventsToRender.length; i++) {
    $eventsContainer.append(renderEvent(eventsToRender[i]));
  }
}

function getRandomQuote() {
  var randomQuote = villagerQuotes[Math.floor(Math.random() * villagerQuotes.length)];
  $villagerQuote.textContent = randomQuote.quote;
  $villagerQuoteTag.textContent = '--' + randomQuote.name;
}

function filterEvents(eventArray) { // filter the events to only show relevant events to user
  var eventsToShow = [];
  var validDays = getOneWeekForward();
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
  *    <h3 class="fw-500 mtb-0 mr-1-rem fb-80">Grape Harvest Festival Nook Shopping event begins</h3>
  *    <h3 class="fw-500 mtb-0 event-date fb-15">09/01</h3>
  *  </li>
  */
  var $newLi = document.createElement('li');
  $newLi.className = 'row-no-wrap justify-and-align-center';

  var $newImg = document.createElement('img');
  if (eventObj.type === 'Event') {
    $newImg.src = 'images/Events/trophy-icon.png';
  } else if (eventObj.type === 'Nook Shopping') {
    $newImg.src = 'images/Events/shopping-cart.png';
  } else {
    $newImg.src = 'images/Events/recipe-icon.png';
  }
  $newImg.className = 'event-icon fb-5';

  var $eventNameH3 = document.createElement('h3');
  $eventNameH3.className = 'fw-500 mtb-0 mr-1-rem fb-80';
  $eventNameH3.textContent = eventObj.event;

  var $eventDateH3 = document.createElement('h3');
  $eventDateH3.className = 'fw-500 mtb-0 event-date fb-15';
  var splitDate = eventObj.date.split('-');
  var monthDayOnly = splitDate[1] + '/' + splitDate[2];
  $eventDateH3.textContent = monthDayOnly;

  $newLi.append($newImg, $eventNameH3, $eventDateH3);

  return $newLi;
}

// View-Swap //

var $navTowns = document.querySelector('.towns-nav');
var $addTownBtn = document.querySelector('.add-town-btn');
var $homeBtn = document.querySelector('.home-nav');

$navTowns.addEventListener('click', function (event) { // swap to entries view
  viewSwap('town-entries');
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

$homeBtn.addEventListener('click', function (event) {
  if (data.currentTown.townName !== undefined) {
    viewSwap('town-home-page');
  }
});

function viewSwap(dataView) { // takes a dataview as argument and changes to that dataview
  var $dataViews = document.querySelectorAll('[data-view]');
  for (let i = 0; i < $dataViews.length; i++) {
    if ($dataViews[i].getAttribute('data-view') === dataView) {
      $dataViews[i].className = '';
      data.view = dataView;
    } else {
      $dataViews[i].className = 'hidden';
    }
  }
}

// ACNH Data Functions //

function getVillagerNames() { // call the API and grab all villager names and icons
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://acnhapi.com/v1a/villagers');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    for (let i = 0; i < xhr.response.length; i++) {
      var villager = {};
      var name = xhr.response[i].name['name-USen'];
      var icon = xhr.response[i].image_uri;
      var birthday = xhr.response[i].birthday;
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
  var xhr = new XMLHttpRequest();
  var params = 'month=September&year=2022';
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
    var xhr2 = new XMLHttpRequest();
    var params2 = 'month=October&year=2022';
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

// Date Functions //

function isBirthday(villager) { // if today is the villagers birthday, return true
  var currentDate = new Date();
  var todayDate = currentDate.getDate() + '/' + (currentDate.getMonth() + 1);
  if (todayDate === villager.birthday) {
    return true;
  }
  return false;
}

function getDate() { // returns todays date
  var currentDate = new Date();
  var currentDay = currentDate.getDate();
  currentDate = currentDate.toDateString();
  var splitDate = currentDate.split(' ');
  splitDate.pop();
  var daysObj = {
    Sun: 'Sunday,',
    Mon: 'Monday,',
    Tue: 'Tuesday,',
    Wed: 'Wednesday,',
    Thu: 'Thursday,',
    Fri: 'Friday',
    Sat: 'Saturday,'
  };
  var monthsObj = {
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

function getOneWeekForward() { // returns an array of valid dates to check
  var validDays = [];
  var monthObj = {
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
  var todaysDate = new Date();
  var todayDay = todaysDate.getDate();
  var todayMonth = todaysDate.getMonth() + 1;
  var todayYear = todaysDate.getFullYear();
  for (let i = 0; i < 8; i++) {
    var ForwardDay = todayDay + i;
    var ForwardMonth = todayMonth;
    var ForwardYear = todayYear;
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
