
import axios from "axios";
import Freecurrencyapi from "@everapi/freecurrencyapi-js";
import nodemailer from 'nodemailer';
import { time } from "console";
// var nodemailer = require('nodemailer');

const myAPIKey = "";
const baseCurrency = 'CHY';
const targetCurrency = 'CAD';
const currencyURL = `https://api.freecurrencyapi.com/v1/latest?apikey=${myAPIKey}&currencies=${targetCurrency}%2CJPY%2CUSD&base_currency=${baseCurrency}`;
const yourEmail = ""
const emailPassword = ""
const googleAppPassword = emailPassword;
const currencyRateEmail = 'sendcadrate@gmail.com';

function addHours (hours, date = new Date()) {  
    if (typeof hours !== 'number') {
      throw new Error('Invalid "hours" argument')
    }
    if (!(date instanceof Date)) {
      throw new Error('Invalid "date" argument')
    }
    date.setHours(date.getHours() + hours) 
    return date
}



var transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: currencyRateEmail,
      pass: googleAppPassword
    }
});



async function getRate(target=5.2) {
    const response = await axios.get(currencyURL);
    const result = response.data;
    
    var cad = (1 / result.data.CAD);
    cad = cad.toFixed(4);

    var timeNow = new Date();
    var cdcTime = addHours(8, timeNow);
    var cdcTimeStr = cdcTime.toISOString().replace(/T/, ' ').replace(/\..+/, '')
    if (cad < target) {
        var mailOptions = {
            from: currencyRateEmail,
            to: yourEmail,
            subject: `加币兑人民币实时汇率：${cad}`,
            text: `加币兑人民币实时汇率：${cad} \n${cdcTimeStr}`
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
    }
    return ;
}
var minutes = 30
var the_interval = minutes * 60 * 1000;
setInterval(getRate, the_interval);
