const cityInput=document.querySelector('.city-input')
const searchBtn=document.querySelector('.search-btn')

const weatherInfosection=document.querySelector('.weather-info')
const notFoundsection=document.querySelector('.not-found')
const searchCitysection=document.querySelector('.search-city')

const countryTxt=document.querySelector('.country-text')
const tempTxt=document.querySelector('.temp-text')
const conditionTxt=document.querySelector('.condition-txt')
const humidityValueTxt=document.querySelector('.humidity-value-text')
const windValueTxt=document.querySelector('.wind-value-text')
const weatherImg=document.querySelector('.weather-img')
const currentDate=document.querySelector('.current-date')
const forecastItemContainer=document.querySelector('.forecast-item-container')

const apiKey = 'YOUR_API_KEY'; 

searchBtn.addEventListener('click',()=>{
    if(cityInput.value.trim()!=''){
        updateWeatherInfo(cityInput.value)
        cityInput.value=''
        cityInput.blur()
    }
}
)
cityInput.addEventListener('keydown',(event)=>{
    if(event.key=='Enter' &&
      cityInput.value.trim()!==' '
    
    )
    {
        updateWeatherInfo(cityInput.value)
        cityInput.value=''
        cityInput.blur()
    }

})
async function getFetchData(endPoint,city){
    const apiUrl=`https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;
    const response= await fetch( apiUrl)
    return response.json()
}

function getWeatherIcon(id){
    if(id<=232) return 'thunderstrom.png'
    if(id<=321) return 'drizzle.png'
    if(id<=531) return 'rain.png'
    if(id<=622) return 'snow.png'
    if(id<=781) return 'atmosphere.png'
    if(id<=800) return 'clear.png'
    else return 'cloud.png'
}

function getCurrentDate(){
    const currentDate=new Date()
    console.log(currentDate)
    const option={
        weekday:'short',
        day:'2-digit',
        month:'short',
    }
    return currentDate.toLocaleDateString('en-GB',option)
}

async function updateWeatherInfo(city) {
    const weatherData=await getFetchData('weather',city)
    if(weatherData.cod!=200){
        showDisplaySection(notFoundsection)
       return
    }
    console.log(weatherData)

       const {
        name:country,
        main:{temp,humidity},
        weather:[{id,main}],
        wind:{speed}

       } =weatherData

        countryTxt.textContent=country
        tempTxt.textContent=Math.round(temp) +'°C'
        conditionTxt.textContent=main
        humidityValueTxt.textContent=humidity +'%'
        windValueTxt.textContent=speed + 'M/s'
        weatherImg.src=`Assets/${getWeatherIcon(id)}`
        currentDate.textContent=getCurrentDate()

        await updateForecastInfo(city)
        showDisplaySection(weatherInfosection)
}
      async function updateForecastInfo(city){
        const forecastData=await getFetchData('forecast',city)

        const timeTaken='12:00:00'
        const todayDate=new Date().toISOString().split('T')[0]

        forecastItemContainer.innerHTML=''
        forecastData.list.forEach(forecastWeather=>{
            if(forecastWeather.dt_txt.includes(timeTaken)&& 
            !forecastWeather.dt_txt.includes(todayDate)){
                updateForecastItem(forecastWeather)
                console.log(forecastWeather)
            }
        })
        console.log(todayDate)
        console.log(forecastData)
    }   
    function  updateForecastItem(weatherData){
      console.log(weatherData)
      const{
        dt_txt:date,
        weather:[{id}],
        main:{temp}
      }=weatherData
       const dateTaken=new Date(date)
       const dateOption={
        day:'2-digit',
        month:'short'
       }
       const dateResult=dateTaken.toLocaleDateString('en-US',dateOption)
      const forecastItem=`
            <div class="forest-item">
                <h5 class="forcast-item regular-text">${dateResult}</h5>
                <img src="Assets/${getWeatherIcon(id)}"  alt="" class="forcast-item-img">
                <h5 class="forcast-item regular-text"> ${Math.round(temp)} °C</h5>
            </div>
      `
      forecastItemContainer.insertAdjacentHTML('beforeend',forecastItem)
    }
    function showDisplaySection(section){
      [weatherInfosection,searchCitysection,notFoundsection]
      .forEach(section=>section.style.display='none')
       section.style.display='flex'
    }