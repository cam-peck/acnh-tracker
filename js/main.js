var $fruitContainer = document.querySelector('.fruit-container');
var $fruits = document.querySelectorAll('.fruit-img');

$fruitContainer.addEventListener('click', handleFruitClick);

function handleFruitClick(event) {
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
