const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const errorScreen = document.querySelector(".errorImg")
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInputContainer = document.querySelector(".user-info-container");

// initial variable are

let currentTab = userTab ;
const API_KEY = "7023fd5f6904a8fa91608deee3e23acb";
currentTab.classList.add("current-tab");
getfromSessionStorage();

function switchTab(clickedTab){
    //clickedTab is parameter, it takes the value when the function is called , takes the value of the function which called the switchTab Function
    if(clickedTab != currentTab) {
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");
    }
    if (!searchForm.classList.contains("active")){
        userInputContainer.classList.remove("active");
        grantAccessContainer.classList.remove("active");
        searchForm.classList.add("active");
        
    }
    else{
        //main pehlai search tab mai tha ab your weather mai aa hu
        
        searchForm.classList.remove("active");
        userInputContainer.classList.remove("active");
        errorScreen.classList.remove("active");
        getfromSessionStorage();
    }
}


userTab.addEventListener("click",() => {
        switchTab(userTab);
});

searchTab.addEventListener("click" , () => {
        switchTab(searchTab);
})


//check if cordinates are already present
function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}


async function fetchUserWeatherInfo(coordinates,){
    const{lat ,lon} = coordinates;
    //make grant location invisible
    grantAccessContainer.classList.remove("active");
    //make loader visible
    loadingScreen.classList.add("active");

    //API CALL
        try{
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`
            );

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            loadingScreen.classList.remove("active");
            userInputContainer.classList.add("active");
           
                renderWeatherInfo(data);
        }
        catch(error){
            loadingScreen.classList.remove("active");
            alert("An Error occured ");
            console.error("Error:", error);
        }
}



function renderWeatherInfo(WeatherInfo){

    //fetching the element

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-counterIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const WeatherIcon = document.querySelector("[data-weatherIcon]");
    const tem = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    //fetch values from weatherINFO object and and aput it into ui

    cityName.innerText = WeatherInfo?.name;
    countryIcon.src =`https://flagcdn.com/16x12/${WeatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = WeatherInfo?.weather?.[0]?.description;
    WeatherIcon.src = `https://openweathermap.org/img/w/${WeatherInfo?.weather?.[0]?.icon}.png`
    tem.innerText= `${((WeatherInfo?.main?.temp)-(272.15)).toFixed(2)} ℃`;
    windspeed.innerText = `${WeatherInfo?.wind?.speed} m/s` ;
    humidity.innerText = `${ WeatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${WeatherInfo?.clouds?.all}%`  ;
}

function getLocation(){
    loadingScreen.classList.add("active")
    grantAccessContainer.classList.remove("active")
    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition, handleLocationError);
       
    }
    else{
        alert("Geolocation not supported not supported by this browser");
    }
    
}

function handleLocationError(error){
   
    setTimeout(()=>{
        alert("access to location denied")
        console.error("Geolocation Error:", error)
    }, 1000)
    
   grantAccessButton.classList.add("active");
    
}

function showPosition(position){

    const userCoordinates = {
        lat : position.coords.latitude,
        lon : position.coords.longitude,
    }
    
    sessionStorage.setItem("user-coordinates" , JSON.stringify(userCoordinates));
    getfromSessionStorage();
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation ,);

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit" , (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if (cityName === "")
       return;

    else
    fetchSearchWeatherInfo(cityName);
})

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInputContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");



    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q= ${city}&appid=${API_KEY}`
        );
        
        if (!response.ok) {
            loadingScreen.classList.remove("active");
            errorScreen.classList.add("active");
            console.log("hello")
            throw new Error(`HTTP error! Status: ${response.status}`);
            
        }

        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInputContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(error){
        loadingScreen.classList.remove("active");
        errorScreen.classList.add("active")
        console.log("nhi chlra bhais");
          
    }

    
}