//jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const app = express();

app.use(express.static("public")); //to use static files styles.css + images
app.use(bodyParser.urlencoded({extended: true})); //for bodyparser

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
})


app.post("/", function(req, res){
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: { //since merge fields is type object so use {}
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data); //so data can be in string format
  const url = "https://us7.api.mailchimp.com/3.0/lists/1967863e8d";
  const options = {
    method: "POST",
    auth: "techacks1:168afead9514646526adab9d64fe276f-us7"
  };

  const request = https.request(url, options, function(response){
    if (response.statusCode === 200){
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function(data){
      console.log(JSON.parse(data));
    })
  })

  request.write(jsonData);//pass the json data to mailchimp server
  request.end();

});

//top is post request for home route
//below is post request for failure route, which will have a completion handler that redirects user to home route
app.post("/failure", function(req, res){
  res.redirect("/");
})

app.listen(process.env.PORT || 3000, function(){ //process.env.PORT is a dynamic port that heroku will define on the go
  console.log("Server is running on port 3000.");
});

//apiKey
// 168afead9514646526adab9d64fe276f-us7
// 5fc118c3e08ca36d593d187fd6a606a0-us7

//listid
//1967863e8d
