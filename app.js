if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config();
}

const express = require('express');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const ejs = require('ejs');
const https = require('https');
const fs = require('fs');

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(favicon(__dirname + '/public/images/favicon.ico'));

const API_KEY = process.env.API;
const NEWS_API_KEY = process.env.NEWS_API;

// storing data temporarily;
let stockData;
let news = [];
let chartData;

app.get("/", (req,res) => {
  res.render('index');   
})

app.post("/display", async (req,res) => {   
     let symbol = req.body.symbol;        
          
     //  get date in necessary format (yy/mm/dd);     
     let date = new Date();
     let formattedDate =  `${date.getFullYear()}-${date.getMonth()+1}-01`;

     const URL1 = `https://api.twelvedata.com/quote?symbol=${symbol}&interval=1min&apikey=${API_KEY}`;
     const URL2 = `https://newsapi.org/v2/everything?q=${symbol}&from=${formattedDate}&sortBy=popularity&apiKey=${NEWS_API_KEY}`;
     const URL3  = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1month&outputsize=24&apikey=${API_KEY}`;

    
      try {
        stockData = await getData(URL1, null);
        news = await getData(URL2, req.headers['user-agent']);
        chartData = await getData(URL3, null);
      } catch (error) {
        return res.send('Internal error in fetching data, Try again!!');
      }
     
      
    res.render('display', { data: stockData, allNews: news.articles, chart: JSON.stringify(chartData.values) });
})

app.listen(process.env.PORT || 3000, () => {
  console.log('Server running on port 3000');
})

// function to make https request;
function getData(URL, userAgent) {
  return new Promise ((resolve, reject) => {

   const options = {
    headers: { 'User-Agent': userAgent }
   }

   https.request(URL, options, response => {//using `response` to differ from `res`;
             
     let body = [];
       response.on('data', (chunk) => {
         body.push(chunk);
       })
       response.on('end', () => {
         try {
           body = JSON.parse(Buffer.concat(body).toString());        
         } catch (error) {
           reject(error);
         }                            
         resolve(body);
       })
   })
   .on('error', error => {
     reject(error);
   })    
   .end();
  })
}