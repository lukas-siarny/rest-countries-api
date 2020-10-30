//Init DOM elemenets
//const countriesSection = document.querySelector(".countries");
const template = document.querySelector("[data-country-element-tamplate]");

//Fetch countries from API
const FIELDS = `name;nativeName;population;region;subregion;capital;currencies;topLevelDomain;languages;borders;flag;alpha3Code`;
const API_URL = `https://restcountries.eu/rest/v2/all?fields=${FIELDS}`

function getData(){
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

getData().then(countries => {
    console.log(countries);
    const initCountries = new Countries(countries);
    initCountries.showCountries();
})


//Countries Class
class Countries{
    constructor(countries){
        this.countries = countries;
    }

    showCountries(){
        const countriesSection = document.querySelector(".countries");
        if(countriesSection.innerHTML != ""){
            countriesSection.innerHTML = "";
        }

        this.countries.forEach(country => {
            const countryElement = this.createCountryElement(country);
            countriesSection.appendChild(countryElement); 
        })
    }    

    showCountryDetail(country){
        const countryDetailSection = document.querySelector(".country-detail");
        if(countryDetailSection.innerHTML != ""){
            countryDetailSection.innerHTML = "";
        }

        this.clearMainArea();
        this.backToMainPage();
        const countryDetail = this.createCountryDetail(country);

        countryDetailSection.appendChild(countryDetail);
    }

    createCountryElement(country){
        //create all elemenets
        const templateCountryElemenet = document.querySelector("[data-tamplate-country-element]");
        const template = templateCountryElemenet.content.cloneNode(true);
        const contryElement = template.querySelector(".country");

        //Add info from data to template
        template.querySelector(".country__img").src = country.flag;
        template.querySelector(".country__title").innerHTML = country.name;
        template.querySelector("[data-country-population]").innerHTML = `Population: ${country.population}`;
        template.querySelector("[data-country-region]").innerHTML = `Region: ${country.region}`;
        template.querySelector("[data-country-capital]").innerHTML = `Capital: ${country.capital}`;

        //Show country details
        contryElement.addEventListener("click", () => this.showCountryDetail(country));
       
        return template; 
    }

    createCountryDetail(country){
        //create all elemenets
        const templateCountryDetail = document.querySelector("[data-tamplate-country-detail]");
        const template = templateCountryDetail.content.cloneNode(true);
        const borders = template.querySelector(".country-detail__borders");
        //const bordersTitle = template.querySelector(".borders-title");

        //Find info from data
        const currencies = country.currencies.map(currency => currency.name).join(", ");
        const languages = country.languages.map(language => language.name).join(", ");
        const domain = country.topLevelDomain.join(", ");

        //Add info from data to template
        template.querySelector(".country-detail__image").src = country.flag;
        template.querySelector(".country-detail__title").innerText = country.name;
        template.querySelector("[data-detail-native-name]").innerText = `Native Name: ${country.nativeName}`;
        template.querySelector("[data-detail-populaton]").innerText = `Populaton: ${country.population}`;
        template.querySelector("[data-detail-region]").innerText = `Region: ${country.region}`;
        template.querySelector("[data-detail-subregion]").innerText = `Sub Region: ${country.subregion}`;
        template.querySelector("[data-detail-capital]").innerText = `Capital: ${country.capital}`;
        template.querySelector("[data-detail-domain]").innerText = `Top Level Domain: ${domain}`;
        template.querySelector("[data-detail-currencies]").innerText = `Currencies: ${currencies}`;
        template.querySelector("[data-detail-languages]").innerText = `Languages: ${languages}`;

        //Create border countries
        this.createBorderCountries(country, borders);
        
        return template;
    }    

    createBorderCountries(country, borders){
        //borders [BRA, ECU, PAN]
        //spravim for each loop country.borders(border => )
        //pre kazdy border najdem krajinu na zaklade alphacodu => 
        //ked budem mat krajinu, vezmem jej nazov => vytvorim span s classou
        //vytvorim addEventListener, click => spustim funkciu vyrendrovat template 
        //prudiam cez appednChild do border couutries
        country.borders.forEach(border => {
            const borderCountry = this.countries.find(cntry => cntry.alpha3Code == border);
            const span = document.createElement("span");
            span.className = "btn btn--borders";
            span.innerText = borderCountry.name;
            span.addEventListener("click", () => this.showCountryDetail(borderCountry));
            borders.insertBefore(span, null);
        })

    }

    clearMainArea(){
        if(document.querySelector(".nav-main")){
            document.querySelector(".nav-main").style.display = "none";
            document.querySelector(".nav-detail").style.display = "flex";
        }
        if(document.querySelector(".countries")){
            document.querySelector(".countries").style.display = "none";
            document.querySelector(".country-detail").style.display = "flex";
        }
    }

    clearCountryPage(){
        if(document.querySelector(".nav-detail")){
            document.querySelector(".nav-detail").style.display = "none";
            document.querySelector(".nav-main").style.display = "flex";
        }
        if(document.querySelector(".country-detail")){
            document.querySelector(".country-detail").style.display = "none";
            document.querySelector(".countries").style.display = "flex";
        }
    }

    backToMainPage(){
        const btnBack = document.querySelector(".btn--back");
        btnBack.addEventListener("click", (e) => {
            this.clearCountryPage();
            this.showCountries();
        })
    }

    insertAfter(newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }
}