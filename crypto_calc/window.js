/* global $ */
//const csv = require('papaparse')
const request=require('request').defaults({ rejectUnauthorized: false });
//const csv = require('papaparse');
const dataservice=require('./service/data.js');
const _=require("underscore");

let dataFiat =[];
const marketData={
    "topTenfiat":
        [
        "USD",
        "GBP",
        "EUR",
        "AUD",
        "CAD",
        "CHF",
        "CNY",
        "INR",
        "JPY",
        "SEK"
        ]
    ,"topTenCrypto":
    [
        "BTC",
        "ETH",
        "bch",
        "XRP",
        "LTC",
        "XEM",
        "DASH",
        "MIOTA",
        "XMR",
        "NEO"        
        ]
};
// Run this function after the page has loaded

$(() => {
//   let url='https://www.lb.lt/en/currency/daylyexport/?csv=1&class=us&type=day'
//     csv.parse(url, {
//       download: true,
//       delimiter: ';',
//       complete: (results) => {
//           dataFiat=results.data; 
//           dataFiat.push(["Euro", "EUR", "1"]);
        
//       }
      
//     });
dataservice.getRates('fiat',(err,rates)=>{
    var $element=$('crypto-container');
    console.log(err);
    dataFiat=rates;
    dataservice.getRates('crypto',(err,data)=>{
        console.log(data);
        
        renderHTML(data);       
    });
});
    
 

// wire client events
  wireEvents();
   
})
function convert(from,to){

}
function renderHTML(data){
    let $element=$('div.crypto-container');   


      data.map((e,i)=>{
      let fiat = _.find(dataFiat,(item)=>{
          //console.log(item);
        return (item[1] == marketData.topTenfiat[i]);

      });
      // get usd rate
      let usdrecord = _.find(dataFiat,(item)=>{
        //console.log(item);
      return (item[1] =='USD' );

    });
    let usdrate = usdrecord[2].replace(",",".");
    usdrate= (1/usdrate)
      let rate=fiat[2].replace(",",".");
        rate = rate * usdrate;
        $element.append (`
        <div class="row">
        <div class="col-xs-6 col-md-6 col-lg-6 col-fiat">
            <div class="input-group">
                <span class="input-group-addon">${marketData.topTenfiat[i]}</span>
                <input 
                    id="${marketData.topTenfiat[i]}" 
                    type="text" 
                    class="fiat-textBox" 
                    name="${e.id}" 
                    placeholder="0.00"
                    value="${rate}"
                    data-baseccy="USD"
                    data-priceusd="${rate}"                    
                    onchange="return updatePrice('fiat',this)"
                    />
            </div>
        </div>
        <div class="col-xs-6 col-md-6 col-lg-6 col-crypo">
                <div class="input-group">
                    <span class="input-group-addon">${e.symbol}</span>
                    <input 
                            id="${e.id}" 
                            type="text" 
                            class="crypto-textBox" 
                            name="${e.id}" 
                            placeholder="0.00"                            
                            value=${e.price_usd}
                            data-marketdata=${JSON.stringify(e)}
                            data-priceusd=${e.price_usd}
                            data-pricebtc=${e.price_btc}
                            onchange="return updatePrice('crypto',this)"
                            />
                </div>
            </div>
        </div>`);

      })
    
      
}

function wireEvents(){

   console.log('wiring events %d',$('input.crypto-textBox').length);

   $('input.crypto-textBox').bind('input propertychange',()=>{
       console.log(this.value);
   
});

    $('input.fiat-textBox').bind('input propertychange',()=>{
       
        console.log($(this).data('marketdata'));

    });
}

function updatePrice(ccy,e){
    let $item={};
    console.log($(e).val());
    //let priceData= $(e).data('marketdata');
    $item.priceusd=($(e).data('priceusd')) || 0.00;
    $item.pricebtc=($(e).data('pricebtc')) || 0.00;   
    $item.newValue = $(e).val() || 0.00;    
    $item.totalbtc = ( $item.pricebtc * $item.newValue);

    if (ccy=='crypto')
    $item.totalusd = ( $item.priceusd *  $item.newValue);    
  else
  {   
    $item.totalusd = ( 1/$item.priceusd * $item.newValue);
  }

  $('.crypto-textBox').not(e).each(function(item){
  
    let priceusd = $(this).data('priceusd');
    let pricebtc = $(this).data('pricebtc');

   if (ccy=='crypto')
      $(this).val($item.totalbtc/pricebtc) ;
  else
  $(this).val($item.totalusd/priceusd);
   //$(this).val($.number($temp).format('0,0'));
   console.log($item);
 });

 $('.fiat-textBox').not(e).each(function(item){
    
    let $rate = $(this).data('priceusd');

    //let $temp=  $item.totalusd*$rate ;
         
    $(this).val($item.totalusd*$rate);    
    
  });
  
console.log($item);
}