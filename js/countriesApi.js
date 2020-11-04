// cfg file
import * as CFG from "./config.js";

// IMPORT DOM elements 
import * as DOM from "./domElements.js";

// IMPORT Helpers 
import {numberWithComas} from "./helpers.js";

//FUNCTIONS
// fetch data 
export function fetchData(api_url){
    return fetch(api_url)
    .then(res => {
        if(res.ok){
            return res.json();
        } else{
            throw Error(res.statusText);
        }    
    })
    .catch(err => console.log(err))
}

// show countries
export function showCountries(countries){
    if(DOM.countriesWrapper.innerHTML != ""){
        DOM.countriesWrapper.innerHTML = "";
    }

    countries.forEach((country, index) => {
        // create element for each country
        const countryElement = createCountryElement(country, index); 
        
        // set lazy loading of flags img for every country
        const imgFlag = countryElement.querySelector(".country__img");
        lazyLoadingImages(imgFlag, country.name);

        // append every country elemenet to DOM
        DOM.countriesWrapper.appendChild(countryElement);
    })
}    

//show country detial
export function showCountryDetail(countryName){  
    if(DOM.countryDetailSection.innerHTML != ""){
        DOM.countryDetailSection.innerHTML = "";
    }

    clearMainArea();
    backToMainPage();

    fetchData(`${CFG.API_URL}/name/${countryName}?fields=${CFG.FIELDS_COUNTRYDETAIL}`)
    .then(country => {
        const countryDetail = createCountryDetail(country[0], DOM.countryDetailSection);
        DOM.countryDetailSection.appendChild(countryDetail);
    })
}

// create country element
export function createCountryElement(country, index){
    const template = DOM.templateCountryElement.content.cloneNode(true);
    const countryElement = template.querySelector(".country");
    const imgFlag = template.querySelector(".country__img");

    //Add info from data to template
    countryElement.title = country.name;
    if(index < 20){
        //first 20 images will load immediately 
        imgFlag.src = country.flag;
        imgFlag.alt = country.name; 
    } else{
        //every next image will be handle with lazy loading
        imgFlag.setAttribute("data-src", country.flag);
    }
    //template.querySelector(".country__img").alt = country.name;
    //template.querySelector(".country__img").loading = "lazy";
    template.querySelector(".country__title").innerHTML = country.name;
    template.querySelector("[data-country-population]").innerHTML = `Population: ${numberWithComas(country.population)}`;
    template.querySelector("[data-country-region]").innerHTML = `Region: ${country.region}`;
    template.querySelector("[data-country-capital]").innerHTML = `Capital: ${country.capital}`;

    //Show country details
    countryElement.addEventListener("click", () => showCountryDetail(country.name));
   
    return countryElement; 
}

// create country detial
export function createCountryDetail(country){
    const template = DOM.templateCountryDetail.content.cloneNode(true);
    const borders = template.querySelector(".country-detail__borders");

    // Find info from data
    const currencies = country.currencies.map(currency => currency.name).join(", ");
    const languages = country.languages.map(language => language.name).join(", ");
    const domain = country.topLevelDomain.join(", ");

    // Add info from data to template
    template.querySelector(".country-detail__image").src = country.flag;
    template.querySelector(".country-detail__title").innerText = country.name;
    template.querySelector("[data-detail-native-name]").innerHTML = `<span>Native Name:</span> ${country.nativeName}`;
    template.querySelector("[data-detail-population]").innerHTML = `<span>Population:</span> ${numberWithComas(country.population)}`;
    template.querySelector("[data-detail-region]").innerHTML = `<span>Region:</span> ${country.region}`;
    template.querySelector("[data-detail-subregion]").innerHTML = `<span>Sub Region:</span> ${country.subregion}`;
    template.querySelector("[data-detail-capital]").innerHTML = `<span>Capital:</span> ${country.capital}`;
    template.querySelector("[data-detail-domain]").innerHTML = `<span>Top Level Domain:</span> ${domain}`;
    template.querySelector("[data-detail-currencies]").innerHTML = `<span>Currencies:</span> ${currencies}`;
    template.querySelector("[data-detail-languages]").innerHTML = `<span>Languages:</span> ${languages}`;

    // Create border countries
    createBorderCountries(country, borders);

    // Change title
    document.title = `${country.name} || ${CFG.PAGE_TITLE}`;
    
    return template;
}  

// create border countries
export function createBorderCountries(country, borders){
    country.borders.forEach(border => {
        fetchData(`${CFG.API_URL}/alpha/${border}?fields=name;alpha3Code`)
        .then(borderCountry => {
            const span = document.createElement("span");
            span.className = "btn btn--borders";
            span.innerText = borderCountry.name;
            span.addEventListener("click", () => showCountryDetail(borderCountry.name));
            borders.insertBefore(span, null);
        })
    })
}

// select countries by Region
export function selectByRegion(countries){
    //solve z-index problem
    selectByRegionZindex();

    // init 
    DOM.regions.forEach(region => {
        region.addEventListener("click", () => {
            DOM.searchInput.value = "";
            setTimeout(() => DOM.selectDropdown.style.zIndex = "-1", 250);
            DOM.selectCheckbox.checked = false;

            // All regions
            if(region.innerText == "All regions"){
                showCountries(countries);
                searchCountries(countries);
                DOM.selectedRegion.innerText = CFG.REGION_DEFAULTVALUE;
                document.title = CFG.PAGE_TITLE;
                return;
            }

            // Specified region
            document.title = `${region.innerText} || ${CFG.PAGE_TITLE}`
            DOM.selectedRegion.innerText = region.innerText;

            fetchData(`${CFG.API_URL}/region/${region.innerText}?fields=${CFG.FIELDS_ALLCOUNTRIES}`)
            .then(countriesByRegion => {               
                showCountries(countriesByRegion);
                searchCountries(countriesByRegion, region.innerText);
            })

            /*const filteredCountries = countries.filter(country => country.region === region.innerText);
            showCountries(filteredCountries);
            searchCountries(filteredCountries);*/
        })
    })        
}

// search countries
export function searchCountries(countries, regionName){
   let delay;

    DOM.searchInput.addEventListener("input", () => {
        clearTimeout(delay);
        delay = setTimeout(()=> {
            const findCountries = countries.filter(country => {
                return country.name.toLowerCase().startsWith(DOM.searchInput.value.toLowerCase().trim());
            })

            if(findCountries == ""){
                countryNotFound(
                    `No results for "<strong>${DOM.searchInput.value}</strong>" in <strong>${regionName != undefined ? regionName : "Any region"}</strong>`
                );
                return;
            }
            
            showCountries(findCountries);
        }, 250);
    });
}

// create not found
export function countryNotFound(message){
    if(DOM.countriesWrapper.innerHTML != ""){
        DOM.countriesWrapper.innerHTML = "";
    }
    
    const div = document.createElement("div");
    div.innerHTML = message;
    DOM.countriesWrapper.appendChild(div);
}

// clear main page
export function clearMainArea(){
    if(DOM.navigationMain){
        DOM.navigationMain.style.display = "none";
        DOM.navigationDetial.style.display = "flex";
    }
    if(DOM.countriesWrapper){
        DOM.countriesWrapper.style.display = "none";
        DOM.countryDetailSection.style.display = "flex";
    }
}

// clear country page
export function clearCountryPage(){
    if(DOM.navigationDetial){
        DOM.navigationDetial.style.display = "none";
        DOM.navigationMain.style.display = "flex";
    }
    if(DOM.countryDetailSection){
        DOM.countryDetailSection.style.display = "none";
        DOM.countriesWrapper.style.display = "flex";
    }
}

// clear back to main page
export function backToMainPage(){
    DOM.btnBack.addEventListener("click", (e) => {
        clearCountryPage();
        document.title = CFG.PAGE_TITLE;
    })
}

// back to roots - h1 title click
export  function backToRoots(countries){
    DOM.title.addEventListener("click", (e) => {
        clearCountryPage();
        showCountries(countries);
        DOM.selectedRegion.innerText = CFG.REGION_DEFAULTVALUE;
        DOM.searchInput.value = "";
        document.title = CFG.PAGE_TITLE;
    }); 
}

// Select by region - solve Z-index problem
export function selectByRegionZindex(){   
    DOM.selectCheckbox.addEventListener("click", () => {
        if(DOM.selectCheckbox.checked){
            DOM.selectDropdown.style.zIndex = "2";
        } else{
            setTimeout(()=> {
                DOM.selectDropdown.style.zIndex = "-1";
            }, 250)
        }
    })
}

// lazy loading images
export function lazyLoadingImages(image, countryName){
    const imgOptions = {
        treshold: 0,
        rootMargin: "0px 0px 300px 0px"
    }
    
    const imgObserver = new IntersectionObserver((entries, imgObserver) => {
        entries.forEach(entry => {
            if(!entry.isIntersecting){
                return;
            }

            const src = entry.target.getAttribute("data-src");
            
            if(!src) {
                return;
            }

            entry.target.src = src;
            entry.target.alt = countryName;

            imgObserver.unobserve(entry.target);
        })
    }, imgOptions)

    imgObserver.observe(image);
}