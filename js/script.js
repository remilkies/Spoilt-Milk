document.addEventListener("DOMContentLoaded", function () { //verifyAge
  preventdefault();
  let modal = new bootstrap.Modal(document.getElementById('verifyAge'));
  modal.show();
});// HOW DO I MAKE IT NOT SHOW IT EVERYTIME YOU LOAD THE INDEX PAGE

function getAge(){  //find a way to filter content based on age
//UPON ENTERING WEBSITE THERE NEEDS TO BE A BLOCK THAT ASKS FOR AGE, LIKE FOR DRUGS AND PORN
  var age = document.getElementById('age').value;
  var rating = 18;

  if(age >= rating){

      console.log("yayy, you can access this website, thanks for not lying about your age");
  }if(rating > age && age >= 13){    
    let limitedAccess = new bootstrap.Modal(document.getElementById('limitedAccess'));
    limitedAccess.show();
      console.log("yayy, you can enter this website BUT you're a minor so your access will be limited");
  }if(age < 13){
    let restrictedAccess = new bootstrap.Modal(document.getElementById('restrictedAccess'));
    restrictedAccess.show();
      console.log("sorry, you can't enter this website, lie about your age next time");
  }

}

// SWAPPING OUT JQUERY BECAUSE THAT'S A BITCH
// function showNav() {
//   var div = $('#dropdown-menu');
//   console.log("Navbar toggled, splash background animated.");
//   var navBar = $('#dropdown-nav');  
//   div.animate({ paddingTop: '30em',opacity: 1}, 'slow'); //use camelCase for JS properties
//   div.show();
//   // navBar.show();
//   console.log('nav content shown');
// }

// $('#navbar-toggler').on("click", function() {
//   showNav();
// });

// $('#navbar-close').on("click", function() {
//   var div = $('#dropdown-menu');
//   var navBar = $('#dropdown-nav');
//   navBar.hide();
//   div.animate({ paddingTop: '0em',opacity: 1}, 'slow');;
//   console.log("Navbar closed, splash background animated.");
// });

// $('#reviewContinueBtn').on("click", function() {
//   var review = $('#reviewContinued');
//   var button = $('#reviewContinueBtn');
//   button.hide();
//   review.show();
//   console.log("Review continued, more text displayed.");
// });

const togglerBtn = document.getElementById('navbar-toggler');
const closeBtn = document.getElementById('navbar-close');
const dropdownMenu = document.getElementById('dropdown-menu');
const reviewBtn = document.getElementById('reviewContinueBtn');
const reviewContent = document.getElementById('reviewContinued');

togglerBtn.addEventListener('click', () => {
  dropdownMenu.classList.add('is-open');
  console.log("Navbar toggled, splash background animated.");
});

closeBtn.addEventListener('click', () => {
  dropdownMenu.classList.remove('is-open');
  console.log("Navbar closed, splash background animated.");
});

if (reviewBtn && reviewContent) {
  reviewBtn.addEventListener('click', () => {
    reviewBtn.style.display = 'none';
    reviewContent.style.display = 'block';
    console.log("Review continued, more text displayed.");
  });
}
class User{
  constructor(age){
    this.age = age;
  }
}

// <div id='put every id for every movie here so i can grab it in js and wont have to make individual pages for every movie, just click the movie and it will trigger the corresponding things info and review'></div> , you're still going to have to do the api thing like 100 times tho unless you find an api thing that lets you access every movie at once and then filter it based on what movie was clicked. 

class Movie{
  constructor(title, genre, image, desc){
    this.title = title;
    this.genre = genre;
    this.image = image;
    this.desc = desc;
  }
}
// !async function(){ //different api, just testing it out, not sure if this is the one i want to use yet, but it's free which is nice.
//   const options = {
//   method: 'GET',
//   headers: {
//     accept: 'application/json',
//     Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3ZDE2OWZkMTg5MDg0NGZkNGZiMGMzYmI5YWIzOTkzMCIsIm5iZiI6MTc1OTQwNzA5MC41NDcwMDAyLCJzdWIiOiI2OGRlNmJmMjJkMGI0YTkwYjZkYTU3OWUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.H3q6GBug0aWNLQPpsTml0iQE9AAWo8QJzI2GBSxWuP4'
//   }
// };

// let data = await fetch('https://api.themoviedb.org/3/configuration', options)
//   .then(response => response.json())
//   .catch(error => console.error(error));
// }();

!async function(){  
  
  const url = 'https://imdb236.p.rapidapi.com/api/imdb/tt28821371';
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': '85a3293347msh341b57b0132f25ep100f98jsn6d6bf29d1206',
      'x-rapidapi-host': 'imdb236.p.rapidapi.com'
    }
  };

let data = await fetch(url, options)
.then((response) => response.json())
.catch((error) => console.error(error));


console.log(data); 

let image = data.primaryImage || "NOT RECIEVING IMAGE AHHHHH"; 
let desc = data.description || "null desc";
let title = data.primaryTitle || "null title";
let genre = data.genres || "null genre";

let newMovie = new Movie(title, genre, image, desc); //MadS

document.getElementById('madsPoster').src = newMovie.image; //img tags have no innerHTML, they display whatever image file the src is linked to
document.getElementById('madsInfo').innerHTML = newMovie.desc;
document.getElementById('madsTitle').innerHTML = newMovie.title;
document.getElementById('madsGenre').innerHTML = newMovie.genre;

  console.log(newMovie);


}();

!async function(){  //Silent Night, Deadly Night

  const url = 'https://imdb236.p.rapidapi.com/api/imdb/tt34508974';
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': '85a3293347msh341b57b0132f25ep100f98jsn6d6bf29d1206',
      'x-rapidapi-host': 'imdb236.p.rapidapi.com'
    }
  };

let data = await fetch(url, options)
.then((response) => response.json())
.catch((error) => console.error(error));

console.log(data); 

let imageArray = data.thumbnails;
let imageSelect = imageArray[2];
let image = imageSelect.url || console.log("NOT RECIEVING IMAGE AHHHHH"); 
let desc = data.description || console.log("null desc");
let title = data.primaryTitle || console.log("null title");
let genre = data.genres || console.log("null genre");

let newMovie = new Movie(title, genre, image, desc); //Silent Night, Deadly Night

document.getElementById('sndnInfo').innerHTML = newMovie.desc;
document.getElementById('sndnTitle').innerHTML = newMovie.title;
document.getElementById('sndnGenre').innerHTML = newMovie.genre;
document.getElementById('sndnPoster').src = newMovie.image;

  
}();
console.log(newMovie);
console.log("Welcome to Spoilt Milk")

!async function(){  //As Above So Below

  const url = 'https://imdb236.p.rapidapi.com/api/imdb/tt2870612';
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': '85a3293347msh341b57b0132f25ep100f98jsn6d6bf29d1206',
      'x-rapidapi-host': 'imdb236.p.rapidapi.com'
    }
  };

let data = await fetch(url, options)
.then((response) => response.json())
.catch((error) => console.error(error));

console.log(data); 

let imageArray = data.thumbnails;
let imageSelect = imageArray[2];
let image = imageSelect.url || console.log("NOT RECIEVING IMAGE AHHHHH"); 
let desc = data.description || console.log("null desc");
let title = data.primaryTitle || console.log("null title");
let genre = data.genres || console.log("null genre");

let newMovie = new Movie(title, genre, image, desc); //Silent Night, Deadly Night

document.getElementById('aasbInfo').innerHTML = newMovie.desc;
document.getElementById('aasbTitle').innerHTML = newMovie.title;
document.getElementById('aasbGenre').innerHTML = newMovie.genre;
document.getElementById('aasbPoster').src = newMovie.image;

  
}();
console.log(newMovie);



function search_sections() {
    const input = document.getElementById('searchbar').value.toLowerCase();
    const list = document.getElementById('list');
    const items = list.getElementsByClassName('films');
  
    let anyVisible = false;
  
    for (let i = 0; i < items.length; i++) {
      const text = items[i].textContent.toLowerCase();
      if (text.includes(input) && input !== '') {
        items[i].style.display = 'block';
        anyVisible = true;
      } else {
        items[i].style.display = 'none';
      }
    }
  
    list.style.display = anyVisible ? 'block' : 'none';
  }


