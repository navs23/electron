//const request=require('request').defaults({ rejectUnauthorized: false });
const csv = require('papaparse');

(function(price){
    const csv = require('papaparse');
    const _=require("underscore");
    price.getRates=(type,cb)=>{
        if (type =="fiat")
            return getFiatRate(cb);
        else if (type =="crypto")
            return getCryptoRate(cb);
        
    }

}(module.exports)
);


function getFiatRate(cb){
  
   
   //return new Promise((resolve,reject)=>{
    console.log('here');
    let url='https://www.lb.lt/en/currency/daylyexport/?csv=1&class=us&type=day'
    csv.parse(url, {
      download: true,
      delimiter: ';',
      complete: (results) => {
        console.log(2);
         
          results.data.push(["Euro", "EUR", "1"]);
          return (cb(null,results.data));
        // resolve(results.data);
      },
      error: function(err, file, inputElem, reason)
    {
        console.log(err);
        return (cb(err,null));
        // executed if an error occurs while loading the file,
    // or if before callback aborted for some reason
    },
      
    });


}
function getCryptoRate(cb){
    let url='https://api.coinmarketcap.com/v1/ticker/?limit=10'
     
    request(url,(err,response,body)=>{
       
      let data =JSON.parse(body);
      return cb(null,data);
      
    });
  
}