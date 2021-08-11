var weatherApiKey = 'd91f911bcf2c0f925fb6535547a5ddc9';

var searchBtn = $('.search-btn');
var searchInput = $('.search-input');
var searchHist = $('.search-history');
var weatherToday = $('.weather-today');
var cardList = $('.card-list');
var d = new Date();
var year = d.getFullYear();
var month = d.getMonth();
var day = d.getDate();

function getCoord(cityName) {

    var queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + weatherApiKey;
    
    fetch(queryUrl)
    .then(function(res){
        return res.json();
    })
    .then(function(data){
        var lat = data.coord.lat;
        var lon = data.coord.lon;
        var cityName = data.name;
        getWeather(lat,lon,cityName);
        //append search value to local storage
    })
}

function renderForecast(object,i) {
    var iconcode = object.weather[0].icon;
    var iconurl = "https://openweathermap.org/img/w/" + iconcode + ".png";
    var cardEl = $('<div>');
    cardEl.addClass('col');
    var dateEl = $('<div>');
    dateEl.text((+day+i)+"/"+month+"/"+year);
    cardEl.append(dateEl);
    var iconEl = $('<img>');
    iconEl.attr('src',iconurl);
    cardEl.append(iconEl);
    var tempEl = $('<div>');
    tempEl.text("Temp: " + object.temp.eve+" °F");
    cardEl.append(tempEl);
    var windEl = $('<div>');
    windEl.text("Wind: "+ object.wind_speed+" MPH");
    cardEl.append(windEl);
    var humdEl = $('<div>');
    humdEl.text("Humidity: "+ object.humidity+" %");
    cardEl.append(humdEl);
    cardList.append(cardEl);
}

function renderHistory() {
    for(let i = 0; i<localStorage.length;i++){
        var tempName = localStorage.getItem(i);
        if(!$('.'+i).length){
            var histCard = $('<button>');
        histCard.addClass('row');
        histCard.addClass(i);
        histCard.text(tempName);
        searchHist.append(histCard);
        }
    }
}


function getWeather(lat,lon,cityName) {
    var queryUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon="+ lon + "&units=imperial&exclude=minutely,hourly&appid=" + weatherApiKey;
    fetch(queryUrl)
    .then(function(res){
        return res.json();
    })
    .then(function(data) {
        console.log(data);
        // var currTemp = data.temp;
        var forecast = data.daily;
        var iconcode = data.current.weather[0].icon;
        var iconurl = "https://openweathermap.org/img/w/" + iconcode + ".png";
        console.log(iconurl);
        $('.currCity').text(cityName);
        $('.currDate').text(day+"/"+month+"/"+year);
        $('.currIcon').attr('src',iconurl);
        $('.currTemp').text("Temp: "+data.current.temp+" °F");
        $('.currWind').text("Wind: "+data.current.wind_speed+" MPH");
        $('.currHumd').text("Humidity: "+data.current.humidity+" %");
        $('.currUV').text("UV Index: "+data.current.uvi);
        cardList.empty();
        for(let i = 0; i < 5; i++){
            renderForecast(forecast[i],i);
        }
    })
}

searchBtn.on('click',function() {
    getCoord(searchInput.val());
    let norep=true;
    for(let i = 0; i< localStorage.length;i++){
        if(localStorage.getItem(i)==searchInput.val()){
            norep=false;
        }
    }
    if(norep){
        localStorage.setItem(localStorage.length,searchInput.val());
    }else{
        norep=true;
    }
});

renderHistory();
searchHist.on('click','button',function() {
    getCoord($(this).text());
    // console.log($(this).text());
})
