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

// Only attach listener if toggler and menu exist on current
if (togglerBtn && dropdownMenu) {
  togglerBtn.addEventListener('click', () => {
    dropdownMenu.classList.add('is-open');
    console.log("Navbar toggled, splash background animated.");
  });
}

// ony attach listener if the close button exists on current
if (closeBtn && dropdownMenu) {
  closeBtn.addEventListener('click', () => {
    dropdownMenu.classList.remove('is-open');
    console.log("Navbar closed, splash background animated.");
  });
}

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
  
  /* ==========================================
      MOVIES ENGINE
     ========================================== */

  class Movie {
    constructor(title, genre, image, desc) {
      this.title = title;
      this.genre = genre;
      this.image = image;
      this.desc = desc;
    }
  }
  
  // Reusable fetch engine
  async function loadMovieData(imdbId, elementPrefix) {
    const url = `https://imdb236.p.rapidapi.com/api/imdb/${imdbId}`;
    const options = {
      method: 'GET',
      headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3ZDE2OWZkMTg5MDg0NGZkNGZiMGMzYmI5YWIzOTkzMCIsIm5iZiI6MTc1OTQwNzA5MC41NDcwMDAyLCJzdWIiOiI2OGRlNmJmMjJkMGI0YTkwYjZkYTU3OWUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.H3q6GBug0aWNLQPpsTml0iQE9AAWo8QJzI2GBSxWuP4'
      }
    };
  
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      
      // fallbacks so layout doesn't FREAK OUT if an image/text is missing o7
      let image = data.thumbnails && data.thumbnails[2] ? data.thumbnails[2].url : (data.primaryImage || "assets/posters/placeholder.jpg");
      let desc = data.description || "No description provided yet by the yappers.";
      let title = data.primaryTitle || "Untitled Movie";
      let genre = data.genres ? data.genres.join(', ') : "Horror";
  
      const newMovie = new Movie(title, genre, image, desc);
  
      // Map properties directly to HTML with prefix
      const elements = {
        title: document.getElementById(`${elementPrefix}Title`),
        info: document.getElementById(`${elementPrefix}Info`),
        genre: document.getElementById(`${elementPrefix}Genre`),
        poster: document.getElementById(`${elementPrefix}Poster`)
      };
  
      if (elements.title) elements.title.innerHTML = newMovie.title;
      if (elements.info) elements.info.innerHTML = newMovie.desc;
      if (elements.genre) elements.genre.innerHTML = newMovie.genre;
      if (elements.poster) elements.poster.src = newMovie.image;
  
      console.log(`Successfully loaded: ${newMovie.title}`);
  
    } catch (error) {
      console.error(`Failed to drag ${elementPrefix} out of the grave:`, error);
    }
  }
  
  /* ==========================================
     MOVIE REGISTRY (courtasy of 2nd year Rem <3)
     ========================================== */
  const horrorWatchlist = [
    { id: 'tt28821371', prefix: 'mads' }, // MadS
    { id: 'tt34508974', prefix: 'sndn' }, // Silent Night, Deadly Night
    { id: 'tt2870612',  prefix: 'aasb' }  // As Above, So Below
  ];
  

  horrorWatchlist.forEach(movie => {
    loadMovieData(movie.id, movie.prefix);
  });

console.log(newMovie);




