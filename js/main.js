// IMPORT config file
import * as CFG from "./config.js";

// IMPORT DarkMode toggle class
import DarkmodeToggle from "./Darkmode.js";

// IMPORT DOM elements 
import {regionName} from "./domElements.js";

// IMPORT FUNCTIONS
import {fetchData, showCountries, selectByRegion, searchCountries, backToRoots} from "./countriesApi.js";

///////////// INIT APPLICATION
// set page title
document.title = CFG.PAGE_TITLE;

// init DarkMode toggle
const darkModeToggle = new DarkmodeToggle(localStorage);
darkModeToggle.initDarkModeToggle();

// fetch all countries from API
fetchData(`${CFG.API_URL}/all?fields=${CFG.FIELDS_ALLCOUNTRIES}`).then(allCountries => {
    // show countires at homepage after first load from API
    showCountries(allCountries);

    // filter countries by region
    selectByRegion(allCountries);

    // init search for all countries
    if(regionName == CFG.REGION_DEFAULTVALUE){
        searchCountries(allCountries);
    }

    // back to roots - h1 click
    backToRoots(allCountries);
})