// Global Variables //

var allVillagers = [];
var $defaultText = createDefaultText();
var $birthdayDefText = createBirthdayDefaultText();

// Event Listeners //

var $fruitContainer = document.querySelector('.fruit-container');
var $fruits = document.querySelectorAll('.fruit-img');
var $searchVillagerBtn = document.querySelector('.search-villager-btn');
var $addVillagerInput = document.querySelector('.new-villager-input');
var $addVillagerBtn = document.querySelector('.add-villager-btn');
var $villagerDatalist = document.querySelector('.villager-datalist');
var $villagerEntryList = document.querySelector('.villager-entry-list');
var $townForm = document.querySelector('.town-form');
var $imageInput = document.querySelector('.image-input');
var $townImage = document.querySelector('.town-img');
var $townContainer = document.querySelector('.town-container');

// New Town Input Form //

window.addEventListener('DOMContentLoaded', function (event) { // get a list of all villagers
  getVillagerNames();
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
        $fruits[i].className = 'fruit-img';
      }
    }
  }
}

function clearFruits() { // resets the fruits on page reload
  for (let i = 0; i < $fruits.length; i++) {
    $fruits[i].className = 'fruit-img';
  }
}

$searchVillagerBtn.addEventListener('click', searchVillagers);

function searchVillagers(event) { // search through the villagers and show them to the user
  $villagerDatalist.textContent = '';
  $addVillagerInput.classList.toggle('hidden');
  $addVillagerBtn.classList.toggle('hidden');
  for (let i = 0; i < allVillagers.length; i++) {
    var $villagerDataTag = document.createElement('option');
    $villagerDataTag.value = allVillagers[i].name;
    $villagerDatalist.append($villagerDataTag);
  }
}

$addVillagerBtn.addEventListener('click', addVillager);

function addVillager() { // add a villager to both the DOM and the data model
  for (let i = 0; i < allVillagers.length; i++) {
    if (allVillagers[i].name === $addVillagerInput.value && !data.currentVillagers.includes(allVillagers[i]) && data.currentVillagers.length < 10) {
      $villagerEntryList.append(createVillagerIcon(allVillagers[i].name, allVillagers[i].icon));
      data.currentVillagers.push(allVillagers[i]);
    }
  }
  $addVillagerInput.value = '';
}

function createVillagerIcon(villagerName, imageUrl) { // create a villager icon and return it
  /*
  * <li data-id="villagerName">
  *  <div class="villager-card justify-and-align-center">
  *    <img class="villager-icon" src="images/sample_villager.png">
  *  </div>
  * </li>
  */
  var $newLi = document.createElement('li');
  $newLi.setAttribute('data-id', villagerName);

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
  * <li class="row-no-wrap pl-1-rem align-center" data-id="villagerName">
  *   <div class="villager-card justify-and-align-center">
  *     <img class="villager-icon" src="images/sample_villager.png">
  *   </div>
  *   <div class="birthday-text row align-center">
  *     <h3 class="pl-1-rem event-text fw-500">Tangy's Birthday!</h3>
  *   </div>
  * </li>
  */
  var $newBDLi = document.createElement('li');
  $newBDLi.setAttribute('data-id', villagerName);
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

$townForm.addEventListener('submit', function (event) { // handle submitting a new town
  handleNewSubmit(event);
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

// Town View Form //

window.addEventListener('DOMContentLoaded', function (event) {
  if (data.towns.length === 0) {
    $townContainer.append($defaultText);
  }

  for (let i = 0; i < data.towns.length; i++) {
    var previousTown = renderTown(data.towns[i]);
    $townContainer.append(previousTown);
  }
  viewSwap(data.view);
});

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

// Town Home Page //

var $homeFruit = document.querySelector('.home-page-fruit');
var $homeDate = document.querySelector('.home-page-date');
var $homeTownName = document.querySelector('.home-page-town-name');
var $homeVillagerUl = document.querySelector('.home-page-villagers');
var $homeImageCont = document.querySelector('.home-page-image');
var $birthdayUl = document.querySelector('.birthday-container');

$townContainer.addEventListener('click', function (event) { // on 'jump back in' btn press, pass correct townObj to rendertown function
  if (event.target.tagName === 'BUTTON') {
    var dataID = parseInt(event.target.closest('li').getAttribute(['data-entry-id']));
    for (let i = 0; i < data.towns.length; i++) {
      if (data.towns[i].entryID === dataID) {
        renderHomePage(data.towns[i]);
      }
    }
  }
});

function renderHomePage(townObj) {
  var birthdayVillagers = [];

  // render the town data //
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
      $birthdayUl.append(createVillagerBDIcon(townObj.townVillagers[i].name, townObj.townVillagers[i].icon));
    }
  } else {
    $birthdayUl.append($birthdayDefText);
  }
  viewSwap('town-home-page');

}

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
  return (splitDate.join(' ') + 'th' + ' ~');
}

// View-Swap //

var $navTowns = document.querySelector('.towns-nav');
var $addTownBtn = document.querySelector('.add-town-btn');

$navTowns.addEventListener('click', function (event) { // swap to entries view
  viewSwap('town-entries');
});

$addTownBtn.addEventListener('click', function (event) { // swap to entry form view
  $townForm.reset();
  clearFruits();
  clearVillagers();
  viewSwap('town-entry-form');
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
  });
  xhr.send();
}
