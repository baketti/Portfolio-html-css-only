const btn = document.getElementById("httpReqBtn");
btn.addEventListener("click",()=>weatherRequest())

    const API_KEY = 'fac4fcb37b5a41ff0a69c55dba5e3ad7';
    const cityNameInput = document.getElementById('city-name');
  
    function weatherRequest() {
      const cityName = cityNameInput.value ?? null;
      const weatherCard = document.getElementById('weather-card');
      const errorContainer = document.getElementById('error');
      // Se l'utente digita una città valida  
      if(cityName){
          // Effettua la richiesta API e aggiorna il contenuto HTML
          fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&lang=en`)
          .then(response => response.json())
            .then(data => {
                const weatherData = {
                    weather: data.weather[0].main,
                    description: data.weather[0].description,
                    temperature: data.main.temp,
                    city: data.name,
                    icon: data.weather[0].icon
                };
                console.log(data)   
                // Costruisci il contenuto della card e visualizzalo
                const cardContent = `
                    <div class='card'>
                        <div class='prev'>
                            <h2>${weatherData.city}</h2>
                            <div class="icons">
                                <img id='icon' 
                                src='http://openweathermap.org/img/w/${weatherData.icon}.png' alt='weather icon'>
                                </img>
                                <img id='icon' 
                                src='http://openweathermap.org/img/w/${weatherData.icon}.png' alt='weather icon'>
                                </img>
                                <img id='icon' 
                                src='http://openweathermap.org/img/w/${weatherData.icon}.png' alt='weather icon'>
                                </img>
                            </div>
                            <p>${capitalizeFirstLetter(weatherData.description)}</p>
                            <h3>${kelvinToCelsius(weatherData.temperature).toFixed(1)}°C</h3>
                        </div>
                    </div>
                `;
                weatherCard.innerHTML = cardContent;
                errorContainer.innerHTML = '';
                })
            .catch(error => {
                // Gestisci l'errore
                console.log(error);
                weatherCard.innerHTML = '';
                errorContainer.innerHTML = `
                <span class="material-symbols-outlined">error</span>
                <h4>City not found!</h4>`;
                document.querySelector('#error span').style.color = 'red';
            });
        }else {
            weatherCard.innerHTML = '';
            errorContainer.innerHTML = `
            <span class="material-symbols-outlined">warning</span>
            <h4> City is a required field!</h4>`;
            document.querySelector('#error span').style.color = 'orange'
        }
    }

    const kelvinToCelsius = (kelvin) => {
        return kelvin - 273.15;
    }
    const capitalizeFirstLetter = (word) => {
        return word?.charAt(0).toUpperCase() + word?.slice(1);
    }
  
  