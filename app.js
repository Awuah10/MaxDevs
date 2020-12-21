//jshint esversion:6
require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const nodemailer = require('nodemailer');
const xoauth2 = require("simple-oauth2");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

//create a transporter to send emails
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        type: 'OAuth2',
        user: process.env.USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: process.env.ACCESS_TOKEN,
        expires: 1484314697598
    }
});

const notificationMessage = {
  success:" ",
  failure: " "
};

app.get("/", function(req, res) {
    res.render("home");
});

app.get("/contact", function(req, res) {
    res.render("contact");
});

app.get("/info", function(req, res){
  res.render("info");
});

app.get("/details", function(req, res) {
  res.render("details");
})

app.post("/contact", function(req, res) {
    
        const name = req.body.name;
        const email = req.body.email;
        const phone = req.body.phone;
        const message = req.body.message;

        //send one mail to myself
        const mailOptions = {
            from: 'MaxDevs <mhenneh20@gmail.com>',
            to: 'awua10@gmail.com', 
            subject: 'MaxDevs Client Request',
            text: "Client name: " + name + "\n" + "Email: " + email +"\n" + "phone: "+ phone + "\n" + "message: " + message
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
              notificationMessage.failure = "Ooops!! Something went wrong. Please try again!";
             res.render("info", {notificationMessage: notificationMessage});
            } else {
              notificationMessage.success = "Thanks for contacting MaxDevs. Please check your email for further details";
              res.render("info", {notificationMessage: notificationMessage});
            }
          });

          //creat another object to send mail to the client
          const clientMailOptions = {
            from: 'MaxDevs <mhenneh20@gmail.com>',
            to: email, 
            subject: 'Thank you for contacting MaxDevs',
            text: "Dear " + name + ",\nThank you for rquesting the services of MaxDevs! \n" + 
            "Please follow the link below and provide specific details for your project request.\n \n http://localhost:3000/details \n \n Best Regards\n The MaxDevs Team."
          };

          
          transporter.sendMail(clientMailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response); 
            }
          });

})



app.listen(3000, function() {
    console.log("Server started on port 3000.");
});