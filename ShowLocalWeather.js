// Comments
$(document).ready(function () {
    var lat, long, api;
     
    // API URL with geolocation JSON statement begins  
    
    $.getJSON("http://ip-api.com/json", function (data2) {
    // Obtain latitude and longitude from ip-api ap
        lat = data2.lat;
        long = data2.lon;
  
     // API URL for openweather using JSON statement begins  
    
        api = 'http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + long + '&appid=1d2b8be920a1fc84c08de95be1834ad9';
        
        $.getJSON(api, function(data) {
    
            var tempSwap = true;   // Boolean variable to toggle between degrees F and degrees C
            // JSON call for Open Weather API
            var weatherType = data.weather[0].description;    // type of weather used for display
            var weatherIcon = data.weather[0].icon;           // icon for the given weather description
            var dayOrNight = weatherIcon[2];                  // toggle between day and night based on the third character or index[2] of the icon string 
            var kTemp = data.main.temp;                       // temperature in degrees K as present in the database
            var windSpeed = data.wind.speed;                  // wind velocity in m/s
            var winDeg = data.wind.deg;                       // degrees the directional componenbt of the wind velocity
            var city = data2.city;                             // city based on the ip-api app
            var state = data2.region;                         // state based on ip-api
            // Temperature conversion from to Fahrenheit
            var fTemp = (kTemp*(9.0/5.0) - 459.67).toFixed(1); // Temperature in degrees Fahrenheit conversion
            var cTemp = (kTemp - 273).toFixed(1);              //Temp conversion to Celsius
    
            
            // Variable for the font color - white at night and indigo during the the day, background colors are reversed 
            
            var fontColorDisplay, backgroundColorDisplay, buttonFontDisplay, buttonBackgroundColorDisplay; 
            
            if (dayOrNight === "d"){
                fontColorDisplay = "white";
                backgroundColorDisplay = "indigo";
                buttonBackgroundColorDisplay = "cyan";
                buttonFontDisplay = "midnightblue";
            }
            else if (dayOrNight === "n") {
                fontColorDisplay = "midnightblue";
                backgroundColorDisplay = "white";
                buttonBackgroundColorDisplay = "hotpink";
                buttonFontDisplay = "white";
            }
          
           
            // Styling the fontcolor and background for each (non-button) section by id    
            document.getElementById("title").style.color = fontColorDisplay;
            document.getElementById("city").style.color = fontColorDisplay;
            document.getElementById("title").style.backgroundColor = backgroundColorDisplay;
            document.getElementById("city").style.backgroundColor = backgroundColorDisplay;
             
            // Using Jquery to style background colors and colors for all button elements
            $(".btn").css({"color" : fontColorDisplay, "background-color" : backgroundColorDisplay });
            
            // Uniquely styling background color and colors for the deg F to deg C button, only button the reacts on click
            document.getElementById("changeTemp").style.backgroundColor = buttonBackgroundColorDisplay;
            document.getElementById("changeTemp").style.color = buttonFontDisplay;
            
            // Writing the "title", "city", weather icon and "temperature" to html 
            $("#title").html("Free Code Camp Local Weather App");
            $("#city").html("Live from " + city +", " + state);
            $("#icon1").html("<img src='http://openweathermap.org/img/w/" + weatherIcon + ".png'>");
            $("#fTemp").html(fTemp + " &#8457;");
            // Change temperature units "on click" the button
            $("#changeTemp").html("&#8457 => &#8451"); 
            $("#changeTemp").click(function() {
                if (tempSwap === false) {
                    $("#fTemp").html(fTemp + " &#8457;");
                    $("#changeTemp").html("&#8457 => &#8451"); 
                    tempSwap = true;
                }
                else {
                    $("#fTemp").html(cTemp + " &#8451;");
                    $("#changeTemp").html("&#8451 => &#8457"); 
                    tempSwap = false;
                }
            });   // End of click event handler
        
           
            $("#weatherType").html(weatherType);
            
            
            /* Total of 16 directions from N, NNE, NE..etc. 360/16 = 22.5 deg for the spread of each direction. However there is an 11.25 deg. offset because "N" ranges from 
             348.75 deg to 11.25 degrees, not 0 deg to 22.5 degrees. The angle plus the offset is divided by 22.5 and truncated using the floor function. This then goes through the modulus operator "%" with 16 # (of directions) so that values of degrees from 348.75 and 360 degress can be sent to the index position of 0. This number is  used as an //index to return string at that position.*/
            
            function getWindDir(direction) {
            var numOfDirections = 16;    // N, NNE, ...,NNW 16 directions total
            var degPerDir = 360/numOfDirections;
            var offSet = degPerDir/2;  
                
            var windArray = [ 'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
            var setPoint =   (Math.floor((direction + offSet ) / degPerDir)) % numOfDirections;   
            return windArray[setPoint];
            }
        
            // Obtain wind direction and specify case in which the wind direction is not defined
            var winDir = getWindDir(winDeg);         
            if (winDeg === undefined){
                winDir = "";
            }
            
            // Converting windspeed from m/s to mph
            windSpeed = (2.237 * (windSpeed)).toFixed(1);
            $("#windSpeed").html(windSpeed + " mph " + winDir);
            
            /* The main difference in appearance of the scenery is primarily due to "clear" versus "cloudy" versus "rainy" or "snowy" conditions and addition to day or night, so it was decided to use city images based on these conditions. City images selected as the "body background" depending on the conditions and the time of day> These values are located in the weather desciption. The functions "indexOf()" and "toLowerCase()" can be used to identify the selected string and refer to the appropriate image. */
            
            if (dayOrNight === "d") {
            
                if ( weatherType.toLowerCase().indexOf("storm") !== -1 || weatherType.toLowerCase().indexOf("rain") !== -1 ||  weatherType.toLowerCase().indexOf("drizzle") !==     -1 )    {
                    $('body').css('background-image', 'url(http://polytopia.net/austinSkyLineRain.jpg)');
                    }
                else if ( weatherType.toLowerCase().indexOf("snow") !== -1)
                    {
                    $('body').css('background-image', 'url(http://polytopia.net/austinSkyLineSnow.jpg)');
                    }
                else if (weatherType.toLowerCase().indexOf("overcast") === -1 && weatherType.toLowerCase().indexOf("clouds") !== -1 )
                    {
                    $('body').css('background-image', 'url(http://polytopia.net/austinSkyLinePartlyCloudy.jpg)');
                    } 
                else if (weatherType.toLowerCase().indexOf("overcast") !== -1 ||  weatherType.toLowerCase().indexOf("mist") !== -1 || weatherType.toLowerCase().indexOf("clouds") !== -1  || weatherType.toLowerCase().indexOf("haze") !== -1  ) 
                    {
                    $('body').css('background-image', 'url(http://polytopia.net/austinSkyLineCloudy.jpg)');
                    }
                else if ( weatherType.toLowerCase().indexOf("clear") !== -1)
                    {
                    $('body').css('background-image', 'url(http://polytopia.net/austinSkyLineSunny.jpg)');
                        
                    }   
            }
            
            else if ( dayOrNight === "n" ){ 
                
                if ( weatherType.toLowerCase().indexOf("clear") !== -1)
                    {    
                    $('body').css('background-image', 'url(http://polytopia.net/austinSkyLineNight.jpg)');

                    } 
                else {
                    $('body').css('background-image', 'url(http://polytopia.net/austinSkyLineCloudyNight.jpg)');
                    }
            }
        });    // Correspond to JSON call to openweather
      // imported JSON statement ends  
    });   // corresponds to getJSON call to ip-api    
});  // corresponds to document.ready
