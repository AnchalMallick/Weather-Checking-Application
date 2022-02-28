const express = require("express"); //require express,an external module
const https = require("https"); //require https,a native module
const bodyParser = require("body-parser"); //require body parser


const app = express(); //set up an express application

app.use(express.static("public")); //to make sure static files-> css and image file present in public folder can be rendered
app.use(bodyParser.urlencoded({
  extended: true
})); //use body parser in our application,urlencoded mode is used to parse data that comes frm html form,extended:true allows us to post nested obtects

//------------------------------------------------------------------------------

app.get("/", function(req, res) { //create a root route get method
  res.sendFile(__dirname + "/index.html")
});

//------------------------------------------------------------------------------

app.post("/", function(req, res) { //create a post method that handles post requests to server at root route
  const query = req.body.cityName;
  const apiKey = <API Key>;
  const unit = "metric";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&units=" + unit + "&appid=" + apiKey;
  https.get(url, function(response) { //make http get request to the url(external server) to fetch some data
    response.on("data", function(data) { //add an event handler to detect if data is successfully fetched from the external server
      //data received from the web is in some other format like string,hex
      const weatherData = JSON.parse(data); //parse the data to convert it into a javaScript object
      if(weatherData.cod === 200){  //if the status code is fine, send the relevant details as the response
      const temp = weatherData.main.temp + "°C";
      const feelsLike = weatherData.main.feels_like + "°C";
      const tempMin = "↓" + weatherData.main.temp_min + "°C";
      const tempMax = "↑" + weatherData.main.temp_max + "°C";
      const pressure = weatherData.main.pressure + " hPa";
      const humidity = weatherData.main.humidity + "%";
      const speed = weatherData.wind.speed + " metres/second"
      const desc = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const iconURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
      console.log("Temperature: " + temp);
      console.log("Description: " + desc);
      res.write("<head><meta charset=" + "utf-8" + "><title>Weather in "+ weatherData.name +"</title></head>");
      res.write("<style>h1{font-size: 4rem;color:  #406882;}p{font-size: 1.5rem;}img{background-color: #97BFB4;}</style>");
      res.write("<h1>The temperature at " + weatherData.name + " is " + temp + "</h1>");
      res.write("<img src=" + iconURL + ">");
      res.write("<p>Weather description: " + desc + "</p>");
      res.write("<p>Feels like " + feelsLike + "</p>");
      res.write("<p>"+tempMin+" and "+tempMax+"</p>");
      res.write("<p>Pressure: " + pressure);
      res.write("<p>Humidity: " + humidity);
      res.write("<p>Wind speed: "+ speed);
      res.send();   //send response to the root route
    }
    else{   //in case an error occurs,display error details
      res.send("<h2>An error occurred! Error" + weatherData.cod + ": " + weatherData.message);
    }
    });
  });
});

//------------------------------------------------------------------------------

app.listen(process.env.PORT || 3000, function() { //start server on port 3000
  console.log("The server has started running on port 3000");
});
