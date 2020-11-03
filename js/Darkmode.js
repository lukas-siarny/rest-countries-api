export default class DarkmodeToggle{
    constructor(){
        this.darkMode = localStorage.getItem("darkMode");
        this.darkModeSwitcher = document.querySelector(".header__theme-switcher");
    }

    initDarkModeToggle(){
        if(this.darkMode === "enabled"){
            this.enableDarkMode();
        }
        
        this.darkModeSwitcher.addEventListener("click", () => {
            this.darkMode = localStorage.getItem("darkMode"); 
            if(this.darkMode !== "enabled"){
                this.enableDarkMode();
            } else{
                this.disableDarkMode();
            }
        })
    }

    enableDarkMode(){
        document.body.classList.add("darkmode");
        this.darkModeSwitcher.title = "Turn off Dark Mode";
        this.darkModeSwitcher.querySelector("i").className = `fas fa-moon`;
        localStorage.setItem("darkMode", "enabled"); // we can store key, value pairs to localStorage
    }
    
    disableDarkMode(){
        document.body.classList.remove("darkmode");
        this.darkModeSwitcher.title = "Turn on Dark Mode";
        this.darkModeSwitcher.querySelector("i").className = `far fa-moon`;
        localStorage.setItem("darkMode", null); // we can store key, value pairs to localStorage
    }

    
}