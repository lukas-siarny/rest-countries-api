// INIT DOM ELEMENTS

// layout elements
export const navigationMain = document.querySelector(".nav-main");
export const navigationDetial = document.querySelector(".nav-detail");
export const countriesWrapper = document.querySelector(".countries__wrapper");
export const countryDetailSection = document.querySelector(".country-detail");

//select
export const selectCheckbox = document.querySelector(".select__checkbox");
export const selectDropdown = document.querySelector(".select__dropdown");
export const selectedRegion = document.querySelector(".select__trigger span");
export const regionName = document.querySelector(".select__trigger span").innerText;
export const regions = document.querySelectorAll(".select__dropdown li");

//search
export const search = document.querySelector(".nav-main__search");
export const searchInput = search.querySelector("input");
export const searchButton = document.querySelector(".fa-search");

// templates
export const templateCountryElement = document.querySelector("[data-tamplate-country-element]");
export const templateCountryDetail = document.querySelector("[data-tamplate-country-detail]");

// buttons
export const title = document.querySelector(".header__logo");
export const btnBack = document.querySelector(".btn--back");