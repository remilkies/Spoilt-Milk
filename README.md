# 🥛🔪 Spoilt Milk

> *"Welcome to the worse version of Rotten Tomatoes. Reviews from certified yappers."*

Spoilt Milk is a custom-built, highly opinionated movie review platform dedicated strictly to the best (and absolute worst) of the horror genre. This is also the legendary **very first website** I ever built from scratch during my first year of college (besides standard school submissions >:D). 

It was born out of a pure obsession with anything and EVERYTHING horror (manga, video games and anime included) and a deep, burning conviction that Rotten Tomatoes is completely rigged -_- 

When you have binged an ungodly amount of horror cinema, such as I, spanning from the gritty (and horribly CGI'd) 1980s to the bloody 2024, remembering every single title becomes a terrifying nightmare in its own right. Especially when people KNOW I'm an absolute horror FIEND, but then when they ask for a recommendation I only ever remember Midsommar and I feel like a poser T-T. So this site is for me to remember all the movies I watch, but more for the movies I HIGHLY recommend :D

Thanks for reading and WELCOME TO SPOILT MILK >:D

## 🩸 Features

* **Curated Categories:** Browse by sub-genre, including Slashers, Psychological, Body Horror, Disturbing, and the heavily favoured **Found Footage**.
* **Personal Horror Archive:** Built to track an endless watchlist spanning from 80s classics to modern 2024 scares.
* **Session-Persistent Age Gate:** A strict verification gate that keeps minors out of the heavy gore, optimised with `sessionStorage` so it only bugs the user once per browsing session.
* **Dynamic API Movie Cards:** Powered by a clean, reusable async engine that fetches live data (posters, genres, descriptions) from the IMDb API on the fly without cluttering the codebase.
* **Spooky UI:** Custom creepy styling featuring the `Creepster` font and a blood-red/bone-white colour palette.

## 💻 Tech Stack & Architecture

This project is a front-end labour of love, engineered to be lightweight, scalable, and dependency-free before its upcoming backend migration.

* **Structure:** HTML5
* **Styling:** CSS3 & Bootstrap 5.3
* **Interactivity (Vanilla JS):** Completely free of jQuery. UI elements, navbar animations, and API requests run on native modern web APIs (`addEventListener`, `classList`, and `fetch`).
* **Dynamic Loading (Recently Added):** Uses a single, DRY (Don't Repeat Yourself) `loadMovieData(imdbId, elementPrefix)` engine to inject remote API data cleanly into standard HTML components.

> ⚠️ **Developer Note:** I have no idea why first-year me thought that redoing the API data fetch separately *for every single movie* was a good idea. We don't talk about the dark times. It's fixed now. :P

## 🗺️ Roadmap aka The Next Nightmare

Spoilt Milk is preparing for a massive server-side upgrade:
* **PHP & SQL Integration:** Moving hardcoded movie grids and static text components into a dynamic relational database.
* **TMDb Migration:** Transitioning to The Movie Database (TMDb) API to leverage bulk arrays of movies, trending movie lists, and eliminate daily endpoint call caps.
* **Dynamic Review Submission:** Turning the "Recommend a film" page into a live user insert portal via PHP forms.

## Get Spooky Right In Your Own Home

1. Clone the repository.
2. Ensure your assets (`assets/`, `Css/`, `js/`) are tracked accurately in the root folder alongside `index.html`.
3. Provide your authorisation keys inside the headers of the `loadMovieData` fetch options within `js/script.js`.
4. Open `index.html` in a local browser environment or using a live server extension.

## 🦇 Author

**Remazani (REMByte)**
*UI/UX Designer & Front-End Leaning Full-Stack Developer.* When I'm not fixing broken navbars or screaming at video games, I'm probably diving into horror manga, watching movies, making clay crafts, or blasting punk rock at max volume. 

*Copyright 2026 - REMByte*
