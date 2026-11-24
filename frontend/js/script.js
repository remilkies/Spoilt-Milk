

/* ==========================================
   AGE GATE
   //find a way to filter content based on age...now that I think about it...do i even want to go through that effort O_O
  //UPON ENTERING WEBSITE THERE NEEDS TO BE A BLOCK THAT ASKS FOR AGE, LIKE FOR DRUGS AND PORN
   ========================================== */
const AGE_KEY = 'ageTier'; // 'full' | 'limited' | 'blocked'
const LOCKED = { backdrop: 'static', keyboard: false }; // can't click/Esc the modal away

function loadTier() {
  try { return localStorage.getItem(AGE_KEY); } catch { return null; }
}

function saveTier(tier) {
  try { localStorage.setItem(AGE_KEY, tier); } catch { /* private mode: gate just shows again */ }
}

function showModal(id, options) {
  const el = document.getElementById(id);
  if (!el) return;
  bootstrap.Modal.getOrCreateInstance(el, options).show();
}

function hideModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  bootstrap.Modal.getInstance(el)?.hide();
}

function initAgeGate() {
  const tier = loadTier();
  if (!tier) {
    showModal('verifyAge', LOCKED);
    return;
  }
  applyTier(tier, false);
}

// Sets <body data-access="..."> so CSS can do the content filtering:
//   body[data-access="limited"] .mature { display: none; }
function applyTier(tier, justVerified) {
  document.body.dataset.access = tier;

  if (tier === 'blocked') {
    showModal('restrictedAccess', LOCKED); // every visit, so a reload can't dodge it
  } else if (tier === 'limited' && justVerified) {
    showModal('limitedAccess'); // only announce it right after they enter their age
  }
}

// reminder to hook up with onsubmit="getAge(event)" or onclick="getAge()"
function getAge(event) { 
  if (event) event.preventDefault(); // preventDefault only works with an event, and only matters for forms

  const age = parseInt(document.getElementById('age').value, 10);
  if (Number.isNaN(age) || age < 1 || age > 120) {
    console.log("that's not an age, try again");
    return;
  }

  let tier;
  if (age >= 18) {
    tier = 'full';
    console.log("yayy, you can access this website, thanks for not lying about your age");
  } else if (age >= 13) {
    tier = 'limited';
    console.log("yayy, you can enter this website BUT you're a minor so your access will be limited");
  } else {
    tier = 'blocked';
    console.log("sorry, you can't enter this website, lie about your age next time");
  }

  saveTier(tier);

  // wait for the first modal to finish closing before opening the next one
  const gate = document.getElementById('verifyAge');
  if (gate) {
    gate.addEventListener('hidden.bs.modal', () => applyTier(tier, true), { once: true });
    hideModal('verifyAge');
  } else {
    applyTier(tier, true);
  }
}

/* ==========================================
   SEARCH
   ========================================== */
function search_sections() {
  const list = document.getElementById('list');
  const searchbar = document.getElementById('searchbar');
  if (!list || !searchbar) return;

  const query = searchbar.value.trim().toLowerCase();
  let anyVisible = false;

  for (const item of list.getElementsByClassName('films')) {
    const match = query !== '' && item.textContent.toLowerCase().includes(query);
    item.style.display = match ? 'block' : 'none';
    if (match) anyVisible = true;
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

/* ==========================================
   DYNAMIC NAVIGATION PIPELINE LOADER
   ========================================== */
async function loadNavbar() {
  const navAnchor = document.getElementById('global-nav-anchor');
  if (!navAnchor) return;

  try {
    // leading slash = relative to the site root. If you deploy to a subfolder
    // (like a GitHub Pages project site) this path needs to change.
    const response = await fetch('/components/navbar.html');
    if (!response.ok) throw new Error("YOU'RE LOST - Navigation structural fetch failed.");
    navAnchor.innerHTML = await response.text();
    bindNavigationControllers(); // only after the markup exists
  } catch (err) {
    console.error('Component Loader Error: ', err);
  }
}

function bindNavigationControllers() {
  const togglerBtn = document.getElementById('navbar-toggler');
  const closeBtn = document.getElementById('navbar-close');
  const dropdownMenu = document.getElementById('dropdown-menu');
  // Only attach listener if toggler and menu exist on current
  if (!dropdownMenu) return;

  if (togglerBtn) {
    togglerBtn.addEventListener('click', () => {
      dropdownMenu.classList.add('is-open');
      console.log('Navbar toggled, splash background animated.');
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      dropdownMenu.classList.remove('is-open');
      console.log('Navbar closed, splash background animated.');
    });
  }
}

/* ==========================================
   "READ MORE" REVIEW TOGGLE
   ========================================== */
function initReviewToggle() {
  const reviewBtn = document.getElementById('review-extended-btn');
  const reviewContent = document.getElementById('review-extended');
  if (!reviewBtn || !reviewContent) return; // only on pages that have it

  reviewBtn.addEventListener('click', () => {
    reviewBtn.style.display = 'none';
    reviewContent.style.display = 'block';
    console.log('WAIT, THERE\'S MORE!?');
  });
}

// <div id='put every id for every movie here so i can grab it in js and wont have to make individual pages for every movie, just click the movie and it will trigger the corresponding things info and review'></div> , you're still going to have to do the api thing like 100 times tho unless you find an api thing that lets you access every movie at once and then filter it based on what movie was clicked. 
/* ==========================================
   MOVIES ENGINE
   ========================================== */
const MOVIES_URL ='/data/movies.json'; // local JSON file with movie data so no API key ships to the browser o7

class Movie {
  constructor(title, genre, image, desc) {
    this.title = title;
    this.genre = genre;
    this.image = image;
    this.desc = desc;
  }
}

  let moviesPromise = null;
 
  // fetch the JSON once and share it with every getMovie() call >:D
  function getMovies() {
    moviesPromise ??= fetch(MOVIES_URL).then(response => {
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    });
    return moviesPromise;
  }
   
  async function getMovie(imdbId) {
    const movies = await getMovies();
    const m = movies[imdbId];
    if (!m) throw new Error(`${imdbId} isn't in movies.json, re-run the fetch script`);
    return new Movie(m.title, m.genre, m.image, m.desc);
  }

// Maps a Movie onto the page. MAKE SURE THE PREFIX MATCHES THE HTML ids:
// ${prefix}Title, ${prefix}Desc (or ${prefix}Info), ${prefix}Genre, ${prefix}Poster
function renderMovie(movie, prefix) {
  // textContent instead of innerHTML so API text can never inject markup o7
  const setText = (suffix, value) => {
    const el = document.getElementById(`${prefix}${suffix}`);
    if (el) el.textContent = value;
  };

  setText('Title', movie.title);
  setText('Desc', movie.desc);
  setText('Info', movie.desc); // old id name, covers both
  setText('Genre', movie.genre);

  const poster = document.getElementById(`${prefix}Poster`);
  if (poster) {
    poster.src = movie.image;
    poster.alt = `${movie.title} poster`;
  }
}

/* ==========================================
    MOVIE REGISTRY (courtasy of 2nd year Rem <3)
   ========================================== */
  //  MAYBE DOUBLE TRIPPLE QUADRUPLE CHEACK THAT YOU ADDED THESE *IN ORDERER* IN THE fetch-movies.mjs script
const horrorWatchlist = [
  { id: 'tt28821371', prefix: 'mads' }, // MadS
  { id: 'tt34508974', prefix: 'sndn' }, // Silent Night, Deadly Night
  { id: 'tt2870612', prefix: 'aasb' }, // As Above, So Below
  { id: 'tt0124102', prefix: 'strangeland' }, //Strangeland (1998) - Welcome to Xibalba "what was god thinking when he made Carlton" TW: SA, Torture, Mutilation, Body Horror (kinda), Gore. If you're a true crime fan, Think David Parker Ray (Toybox Killer) if he was alternative, with a fetish for body modification. Spoiler: Most satisfying ending in the history of film and you might wanna make a new playlist to add every song in this film becuase the musiccccccc AND THEY PUT THE NAMES OF ALL THE SONGS SO STICK AROUND A LITTLE BIT FOR THE CREDIS. Lowkey a cult classic i don't know why more people dont talk about it o7
  //"...Don't be afrid to die. Death is the standard by which the reality and depth of all things can be judged" "Pain is a uniquly personal expirience"
  {id: 'tt1703199', prefix: 'graveEncounters'}, //Grave Encounters
  {id: 'tt37287335', prefix: 'obsession'}, //Obsession
  {id: 'tt8772262', prefix: 'midsommar'}, //Midsommar
  {id: 'tt9731534', prefix: 'theNightHouse'}, //The Night House (tbw - to be watched)
  {id: 'tt9764362', prefix: 'theMenu'}, //The Menu TBW
  {id: 'tt4267026', prefix: 'hellHouseLLC'}, //Hell House LLC
  {id: 'tt1029234', prefix: 'martyrs'}, //Martyrs (Reviewd)
  {id: 'tt4003440', prefix: 'theHouseThatJackBuilt'}, //The House That Jack Built (it's giving HH Holmes but i haven't seen it yet)
  {id: 'tt6081670', prefix: 'possum'}, //Possum (unsettleing)
  {id: 'tt0145681', prefix:'theBoneCollector'},
  {id: 'tt0251736', prefix: 'houseOf1000Corpses'}, //Reminiicent of Willy Pickton? Nasty farm? bunhca bodies?
  {id: 'tt0397065', prefix: 'houseOfWax'}, 
  {id: 'tt0373883', prefix: 'holloween'}, //Holloween 2007
  {id: 'tt0245674', prefix: 'thirteenGhosts'}, //Thirteen Ghosts
  {id: 'tt0093177', prefix: 'hellraiser'}, //Hellraiser 1987
  {id: 'tt28443655', prefix: 'deathOfAUnicorm'}, //how this movie flew under my radar for so long is beyond me, Jenna Ortega on Disney channel was part of my lesbian awakening in primary school....let's find out if the universe was saving me or gatekeeping a gem
  {id: 'tt26470109', prefix: 'oddity'}, //9.7
  {id: 'tt1148204', prefix: 'orphan'}, //8.7 pissed me off like 89% of the time, lowkey giving Bring Her Back but with a more satisfying ending
  {id: 'tt35672862', prefix: 'hokum'}, //9.8 two words: Adam Scott. That's it. That's my whole review. OH AND FOLK WITCHCRAFT, so it's super fun time >:D
  {id: 'tt31170389', prefix: 'evilDeadBurn'}, // 5.6 Me watching this movie hoping that everyone just dies [insert grandma just chilling on the stair escalotor during all the chaos]. The storline makes sense but the plot doesn't, everyone is either incompitant, a pansey, an idiot or just an all round fucking terrible person. Literally only watch this movie if you want an excuse to wish death upon a whole family and not feel bad about it. I shit you not, 30 minutes in i would've been ok with everyone just spontaniously combusted simultainiously and that's the movie. 1 hour in there was 51 minutes left and i genuinly asked "what the fuck else could possibly happen in the next 51 minutes" (spoiler: nothing warrenting a whole 51 minutes). Outside of complaining tho, the movie has that problem that horror movies rated 18 has where the audience seems to be 'people who are afraid of blood and gore?'. There wasn't anything scary or even suspenseful or thrilling about it. It kindof game resident evil or any generic horror game on steam vibes. Horror movies rated 18 arent rated 18 becuse they're more horrifying or traumatising or disturbing, y'know something that a 17 year old would have vivid nightmares about (no matter how much i want that to be the case) 
  // // this movie uses that rating, not becuase it scarier, but becuase the amount of gore and the details of it force the movie to have that rating just as an industry standard. I often find that some of my favriot movies aren't rated 18 becuse they don't rely of blood and gore to sell the horror, they build story, actully set stakes and as much as we hate the characters we still care about the story. As someone who loves supernatual shit invloving incatations and curses this movie had SO MUCH potential, which is why i kept watching i think. It's horror movie rage bait that i could't help but watch as the fire engulfed my screen and my third glass of wine (since the start of the movie btw) ran empty. BUT TO IT'S CREDIT, THE ACTING, CONSTUME, EDITING, CINEMATOGRAPGY, MES EN SCEN WAS GENUINLY BREATHTAKING. I think the good thing i can take away fro it is that i was genuinly annoyed, not at the movie but at the charcters. I activly participated in the narrative and engaged with the material which is always a good thing to get from a movie which i think is what kept me watching. All in all, was this a good movie? I'll let you make your own verdict on that. Would it be the BEST FUCKING VIDEO GAME TRAILER OF ALL TIME? absoluty and i hope that's the case so i can feel better about wasting my Friday the 13th watching what could have been a 15 minute side quest to get a rare weapon in some horror game. P.S I think watching this under the influence of some substance of your choosing would make the expieirence more fun, enjoyable and funny :P
  {id: 'tt5792468', prefix: 'butterflyKisses'}, //11, the thing i love about found footage is that it feels real, we, in a sense, get to find that footage and act as the person seeing it for the first time. But as an audience we have the benefit of hindsight, knowing that this is a found footage film...but what if we asked someone to belive it? That's the part we don't see. The person who found the footage and doesn't say "cheak of this found footage" but "look at this footage I found". Imagine trying to get that footage made into something like Grave Encounters or The Tunnel, Hell House LLC, the thing we don't see in found footage is how much the person who found the footage has to go through. As an audience we can larp as the people who found the footage but ultimatly we're not and it's a good thing too cause, trying to actully convince people irl that this footage is real is...a tough ask. But i actully belive it. I belive that there are people in the world who are willing to go to hell to prove that hevean exists, I think this movie is a testiment to that.
  {id: 'tt0125198', prefix: 'Women’s Flesh: My Red Guts'},
  {id: 'tt0387564', prefix: 'Saw'}, //Most people are so ungrateful for being alive but not you, not anymore-- nota after this movie. This franchises's reputation preceeds it and all i have to say is that rep is deserved. I DONT GIVE A FUCK WHAT ROTTON FUCK ROTTON TOMATOES But in terms of an actual movie review, it's a great babystep into more gorey and semi-hard core horror. It's not jumpscare actully supposed to scare you horror but the kind that turns your heart into a vibrator cycling through the different levels of intensity. In my opinion it is one of the greatest horror movies to start with if you're just getting into the genre :P
  
  {id: '', prefix: 'thePerfection'},
  {id: '', prefix: 'exhuma'},
  {id: '', prefix: 'theTunnel'},
  {id: '', prefix: 'theCloverfieldParadox'},
  {id: '', prefix: 'theSubstance'},
  {id: '', prefix: 'theConjouring'},
  {id: '', prefix: 'hereditary'},
  {id: 'tt2798920', prefix: 'annahilation'}, //it's not scary but fucking hell is it beautiful. If the entire horror genre was hourse that jack built, this would be the rose garden 
  {id: '', prefix: 'theDescent'},
  {id: 'tt1060277', prefix: 'cloverfield'},
  {id: 'tt26657236', prefix: 'backrooms'},
  {id:'', prefix: 'host'},
  {id:'', prefix: 'rec'},
  {id:'', prefix: 'creep'},
  {id:'', prefix: 'theVisit'},
  {id:'', prefix: 'theBlairWitchProject'},
  {id:'tt3567288', prefix: 'theVisit'},
  {id:'', prefix: 'sinister'},
  {id:'', prefix: ''},
  {id:'', prefix: ''},
  {id:'', prefix: ''},
  {id: 'tt0432348', prefix: 'sawII'}, //the cure for death is immortality..by creating a legacy..by living a life worth rembering, you become imortal" which is excatly why the saw franchise is still talked about today as a classic in horror. ok so beoynd the ost disorienting cinemotograohy i thnk i've ever fallen victim to, which in hindsight is kind of a fitting artistic choice, this was a pretty solid movie and as sequals go i think I like this one more than the first Saw...even though it's kinda like final destination in that i kinda feels like an anthology? but yeah 8.8/10
  // just copy paste this o7 {id:'', prefix: ''},
];

async function loadWatchlist() {
  // only fetch movies that actually have a spot on THIS page
  const onThisPage = horrorWatchlist.filter(({ prefix }) =>
    document.getElementById(`${prefix}Title`) || document.getElementById(`${prefix}Poster`)
  );
  if (onThisPage.length === 0) return;

  // allSettled: one movie failing doesn't stop the rest from loading
  const results = await Promise.allSettled(
    onThisPage.map(async ({ id, prefix }) => {
      const movie = await getMovie(id);
      renderMovie(movie, prefix);
      console.log(`Successfully loaded: ${movie.title}`);
    })
  );

  results.forEach((result, i) => {
    if (result.status === 'rejected') {
      console.error(`Failed to drag ${onThisPage[i].prefix} out of the grave:`, result.reason);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initAgeGate();
  loadNavbar();
  initReviewToggle();
  loadWatchlist();
});

const editorsChoice = [

]

