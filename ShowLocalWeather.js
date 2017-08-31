
$(document).ready(function () {
         
    $.getJSON("http://ip-api.com/json", function (data2) {

      var  lat = data2.lat;
      var long = data2.lon;
  
      var api = "http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + long + "&appid=1d2b8be920a1fc84c08de95be1834ad9";
        
        $.getJSON(api, function(data) {
    
            var tempSwap = true;   
            var weatherType = data.weather[0].description;    
            var weatherIcon = data.weather[0].icon;           
            var dayOrNight = weatherIcon[2];                  
            var kTemp = data.main.temp;                      
            var windSpeed = data.wind.speed;                  
            var winDeg = data.wind.deg;                       
            var city = data2.city;                           
            var state = data2.region;                         
            
            var fTemp = (kTemp*(9.0/5.0) - 459.67).toFixed(0); 
            var cTemp = (kTemp - 273).toFixed(0);              
    
            var fontColorDisplay, backgroundColorDisplay, buttonFontDisplay, buttonBackgroundColorDisplay, surroundIconDisplay; 
            
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
            $("#title").css({ color: fontColorDisplay, "background-color": backgroundColorDisplay });
            $("#city").css({ color: fontColorDisplay, "background-color": backgroundColorDisplay });
          
            // Using Jquery to style background colors and colors for all button elements
            $(".btn").css({"color" : fontColorDisplay, "background-color" : backgroundColorDisplay });
            
            // Uniquely styling background color and colors for the deg F to deg C button, only button the reacts on click
            $("#changeTemp").css({color: buttonFontDisplay,"background-color": buttonBackgroundColorDisplay});
            
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
                   
            function getWindDir(direction) {
            var numOfDirections = 16;    // N, NNE, ...,NNW 16 directions total
            var degPerDir = 360/numOfDirections;
            var offSet = degPerDir/2;  
                
            var windArray = [ "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
            var setPoint =   (Math.floor((direction + offSet ) / degPerDir)) % numOfDirections;   
            return windArray[setPoint];
            }
        
            // Obtain wind direction and specify case in which the wind direction is not defined
            var winDir = getWindDir(winDeg);         
            if (winDeg === undefined){
                winDir = "";
            }
            
            // Converting windspeed from m/s to mph
            windSpeed = (2.237 * (windSpeed)).toFixed(0);
            $("#windSpeed").html(windSpeed + " mph " + winDir);
			
			
            surroundIconDisplay = "white";
            if (dayOrNight === "d") {
            		
                if ( weatherType.toLowerCase().indexOf("storm") !== -1 || weatherType.toLowerCase().indexOf("rain") !== -1 ||  weatherType.toLowerCase().indexOf("drizzle") !==     -1 )    {
                    $("body").css("background-image", "url(http://polytopia.net/austinSkyLineRain.jpg)");
                    }
                else if ( weatherType.toLowerCase().indexOf("snow") !== -1)
                    {
                    $("body").css("background-image", "url(http://polytopia.net/austinSkyLineSnow.jpg)");
                    }
                else if (weatherType.toLowerCase().indexOf("overcast") === -1 && weatherType.toLowerCase().indexOf("clouds") !== -1 )
                    {
                    $("body").css("background-image", "url(http://polytopia.net/austinSkyLinePartlyCloudy.jpg)");
                    } 
                else if (weatherType.toLowerCase().indexOf("overcast") !== -1 ||  weatherType.toLowerCase().indexOf("mist") !== -1 || weatherType.toLowerCase().indexOf("clouds") !== -1  || weatherType.toLowerCase().indexOf("haze") !== -1  ) 
                    {
                    $("body").css("background-image", "url(http://polytopia.net/austinSkyLineCloudy.jpg)");
                    }
                else if ( weatherType.toLowerCase().indexOf("clear") !== -1)
                    {
                    $("body").css("background-image", "url(http://polytopia.net/austinSkyLineSunny.jpg)");
                        surroundIconDisplay = "midnightblue";
                    }   
            }
            
            else if ( dayOrNight === "n" ){ 
                
                if ( weatherType.toLowerCase().indexOf("clear") !== -1)
                    {    
                    $("body").css("background-image", "url(http://polytopia.net/austinSkyLineNight.jpg)");

                    } 
                else {
                    $("body").css("background-image", "url(http://polytopia.net/austinSkyLineCloudyNight.jpg)");
                    }
            }
				$("#surroundIcon").css("background-color", surroundIconDisplay);
        });    
       
    });     
});  
