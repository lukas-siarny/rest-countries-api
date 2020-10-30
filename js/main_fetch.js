//DARK MODE SWITCHER
//do premenej dakmode sa zapise hodnota z localStrage len pri nacitani stranky,
//funkcie setItem ich zmenia v localStorage, avsak mi potrebujeme pri kazdom kliku updatetnut darkMode variable a zobrat aktualny stav z localStorage
let darkMode = localStorage.getItem("darkMode");
const darkModeSwitcher = document.querySelector(".header__theme-switcher");

function enableDarkMode(){
    document.body.classList.add("darkmode");
    darkModeSwitcher.title = "Turn off Dark Mode";
    darkModeSwitcher.querySelector("i").className = `fas fa-moon`;
    localStorage.setItem("darkMode", "enabled"); // we can store key, value pairs to localStorage
}

function disableDarkMode(){
    document.body.classList.remove("darkmode");
    darkModeSwitcher.title = "Turn on Dark Mode";
    darkModeSwitcher.querySelector("i").className = `far fa-moon`;
    localStorage.setItem("darkMode", null); // we can store key, value pairs to localStorage
}

//aby aj po refresnuti stranky ostal nastaveny posledny stav zvoleny uzivatelom
if(darkMode === "enabled"){
    enableDarkMode();
}

darkModeSwitcher.addEventListener("click", () => {
    darkMode = localStorage.getItem("darkMode"); 
    if(darkMode !== "enabled"){
        enableDarkMode();
    } else{
        disableDarkMode();
    }
})

//OTHER FUNCTIONS
//fetchData
function fetchData(API_URL){
    return fetch(API_URL)
    .then(res => {
        if(res.ok){
            return res.json();
        } else{
            throw Error(res.statusText);
        }    
    })
    .catch(err => console.log(err))
}

//show Coutries
function showCountries(countries){
    const countriesSection = document.querySelector(".countries");
    if(countriesSection.innerHTML != ""){
        countriesSection.innerHTML = "";
    }

    countries.forEach(country => {
        const countryElement = createCountryElement(country);
        countriesSection.appendChild(countryElement); 
    })
}

//show country detial
function showCountryDetail(countryName){
    const countryDetailSection = document.querySelector(".country-detail");
    
    if(countryDetailSection.innerHTML != ""){
        countryDetailSection.innerHTML = "";
    }

    clearMainArea();
    backToMainPage();

    //Fetch data from API and create new country detial page
    const fields = `name;nativeName;population;region;subregion;capital;currencies;topLevelDomain;languages;borders;flag;alpha3Code;`
    fetchData(`https://restcountries.eu/rest/v2/name/${countryName}?fields=${fields}`)
    .then(country => {
        const countryDetail = createCountryDetail(country[0], countryDetailSection);
        countryDetailSection.appendChild(countryDetail);
    })
}

//create country elemenet
function createCountryElement(country){ 
    //create all elemenets
    const templateCountryElemenet = document.querySelector("[data-tamplate-country-element]");
    const template = templateCountryElemenet.content.cloneNode(true);
    const countryElement = template.querySelector(".country");
    
    //Add info from data to template
    template.querySelector(".country__img").src = country.flag;
    template.querySelector(".country__title").innerHTML = country.name;
    template.querySelector("[data-country-population]").innerHTML = `<span>Population:</span> ${formatPopulation(country.population)}`;
    template.querySelector("[data-country-region]").innerHTML = `<span>Region:</span> ${country.region}`;
    template.querySelector("[data-country-capital]").innerHTML = `<span>Capital:</span> ${country.capital}`;
    
    //Show country details
    countryElement.addEventListener("click", () => showCountryDetail(country.name));
    
    return countryElement;
}

//create country detial page
function createCountryDetail(country){
    //create all elemenets
    const templateCountryDetail = document.querySelector("[data-tamplate-country-detail]");
    const template = templateCountryDetail.content.cloneNode(true);
    const borders = template.querySelector(".country-detail__borders");

    //Find info from data
    const currencies = country.currencies.map(currency => currency.name).join(", ");
    const languages = country.languages.map(language => language.name).join(", ");
    const domain = country.topLevelDomain.join(", ");

    //Add info from data to template
    template.querySelector(".country-detail__image").src = country.flag;
    template.querySelector(".country-detail__title").innerText = country.name;
    template.querySelector("[data-detail-native-name]").innerHTML = `<span>Native Name:</span> ${country.nativeName}`;
    template.querySelector("[data-detail-population]").innerHTML = `<span>Population:</span> ${formatPopulation(country.population)}`;
    template.querySelector("[data-detail-region]").innerHTML = `<span>Region:</span> ${country.region}`;
    template.querySelector("[data-detail-subregion]").innerHTML = `<span>Sub Region:</span> ${country.subregion}`;
    template.querySelector("[data-detail-capital]").innerHTML = `<span>Capital:</span> ${country.capital}`;
    template.querySelector("[data-detail-domain]").innerHTML = `<span>Top Level Domain:</span> ${domain}`;
    template.querySelector("[data-detail-currencies]").innerHTML = `<span>Currencies:</span> ${currencies}`;
    template.querySelector("[data-detail-languages]").innerHTML = `<span>Languages:</span> ${languages}`;

    //Create border countries
    createBorderCountries(country, borders);
    
    return template;
}   

//create border country buttons
function createBorderCountries(country, borders){
    const fields = `name;alpha3Code;`

    country.borders.forEach(border => {
        console.log(border);
        fetchData(`https://restcountries.eu/rest/v2/alpha/${border}?fields=${fields}`)
        .then(borderCountry => {
            console.log(borderCountry);
            const span = document.createElement("span");
            span.className = "btn btn--borders";
            span.innerText = borderCountry.name;
            span.addEventListener("click", () => showCountryDetail(borderCountry.name));
            borders.insertBefore(span, null);
        })
    })
}

//clear main page
function clearMainArea(){
    if(document.querySelector(".nav-main")){
        document.querySelector(".nav-main").style.display = "none";
        document.querySelector(".nav-detail").style.display = "flex";
    }
    if(document.querySelector(".countries")){
        document.querySelector(".countries").style.display = "none";
        document.querySelector(".country-detail").style.display = "flex";
    }
}

//clear country detail page
function clearCountryPage(){
    if(document.querySelector(".nav-detail")){
        document.querySelector(".nav-detail").style.display = "none";
        document.querySelector(".nav-main").style.display = "flex";
    }
    if(document.querySelector(".country-detail")){
        document.querySelector(".country-detail").style.display = "none";
        document.querySelector(".countries").style.display = "flex";
    }
}

//add functionality to Back button
function backToMainPage(){
    const btnBack = document.querySelector(".btn--back");
    btnBack.addEventListener("click", (e) => {
        clearCountryPage();
    })
}

//format Population
function formatPopulation(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

//Select by region
function selectByRegion(countries){
    const selectCheckbox = document.querySelector(".select__checkbox");
    const selectTriggerText = document.querySelector(".select__trigger span");
    const regions = document.querySelectorAll(".select__dropdown li"); 

    regions.forEach(region => {
        region.addEventListener("click", () => {
            selectTriggerText.innerText = region.innerText;
            selectCheckbox.checked = false;

            //All regions
            if(region.innerText == "All regions"){
                showCountries(countries);
                return;
            }

            //Specified region
            fetchData(`https://restcountries.eu/rest/v2/region/${region.innerText}?fields=name;population;region;capital;flag;`)
            .then(countriesByRegion => {
                if(document.querySelector(".countries").innerHTML != ""){
                    document.querySelector(".countries").innerHTML = ""
                }
                
                showCountries(countriesByRegion);
            })
        })
    })
}

//Select by region - solve Z-index problem
function selectByRegionZindex(){
    const selectCheckbox = document.querySelector(".select__checkbox");
    const selectDropdown = document.querySelector(".select__dropdown");
    
    selectCheckbox.addEventListener("click", () => {
        if(selectCheckbox.checked){
            selectDropdown.style.zIndex = "2";
        } else{
            setTimeout(()=> {
                selectDropdown.style.zIndex = "-1";
            }, 250)
        }
    })
}

//Search country
function searchCountry(countries){
    const search = document.querySelector(".nav-main__search");
    const searchInput = search.querySelector("input");
    const countryName = searchInput.value;
    const selectedRegion = document.querySelector(".select__trigger span");
    const regionName = document.querySelector(".select__trigger span").innerText;

    if(countryName === ""){
        showCountries(countries);
        
        if(regionName != "All regions" || regionName != "Filter by region"){
            selectedRegion.innerText = "All regions";
        }
        return;
    }

    const fields = `name;population;region;capital;flag;`
    fetchData(`https://restcountries.eu/rest/v2/name/${countryName}?fullText=true?fields=${fields}`)
    .then(country => {
        if(country != undefined){
            if(regionName == "All regions" || regionName == "Filter by region"){
                showCountries(country);
            } else if(country[0].region == regionName){
                showCountries(country);
            } else {
                countryNotFound("There is no such coutry in this region. Try different region and search again!");
            }
        } else {
            countryNotFound("There is no such country. Search again!");
        }
    }).catch(err => console.log(err));
}

//show not found
function countryNotFound(massage){
    const countriesSection = document.querySelector(".countries");
    if(countriesSection.innerHTML != ""){
        countriesSection.innerHTML = "";
    }
    
    countriesSection.innerHTML = massage;
}

//INIT APPLICATION
const fields = `name;population;region;capital;flag;`
fetchData(`https://restcountries.eu/rest/v2/all?fields=${fields}`)
.then(countries => {
    //show countires at homepage after first load from API
    showCountries(countries);
    
    //filter countries by region
    selectByRegion(countries);
    
    //solve problem with z-index on Select region menu
    selectByRegionZindex();

    //search countries by name
    const searchButton = document.querySelector(".fa-search");
    searchButton.addEventListener("click", () => searchCountry(countries));

})
