/* exported data */

let data = {
  view: 'town-entries',
  towns: [
    {
      playerName: 'Cameron',
      entryID: 1,
      imageLink: 'https://i.pinimg.com/736x/38/8a/d6/388ad6db4a58b8e7fcb63e5f7e1940d9.jpg',
      collectionData: null,
      townFruit: 'cherry',
      townName: 'Mallet Town',
      townVillagers: [
        { name: 'Pinky', icon: 'https://acnhapi.com/v1/images/villagers/9', birthday: '9/9' },
        { name: 'Tom', icon: 'https://acnhapi.com/v1/images/villagers/57', birthday: '10/12' },
        { name: 'Barold', icon: 'https://acnhapi.com/v1/images/villagers/78', birthday: '2/3' },
        { name: 'Moose', icon: 'https://acnhapi.com/v1/images/villagers/262', birthday: '13/9' },
        { name: 'Peanut', icon: 'https://acnhapi.com/v1/images/villagers/356', birthday: '8/6' },
        { name: 'Marshal', icon: 'https://acnhapi.com/v1/images/villagers/372', birthday: '29/9' },
        { name: 'Annalisa', icon: 'https://acnhapi.com/v1/images/villagers/6', birthday: '6/2' },
        { name: 'Snooty', icon: 'https://acnhapi.com/v1/images/villagers/5', birthday: '24/10' }
      ]
    }
  ],
  currentTown: null,
  currentCollection: null,
  currentCollectionItem: null,
  editing: null,
  nextEntryId: 2,
  currentVillagers: [],
  collectionData: {}
};

const previousData = localStorage.getItem('acnh-tracker-data');
if (previousData !== null) {
  data = JSON.parse(previousData);
}
window.addEventListener('beforeunload', function (event) {
  var dataJSON = JSON.stringify(data);
  localStorage.setItem('acnh-tracker-data', dataJSON);
});
