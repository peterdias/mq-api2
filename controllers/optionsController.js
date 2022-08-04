const asyncHandler = require('express-async-handler')
const dotenv = require('dotenv').config()
var KiteConnect = require("kiteconnect").KiteConnect;

let spot_exchange = "NSE"
var spot_symbol = "NIFTY BANK"
var expiry = "8/25/2022"
var exchange = "NFO"
var option_name = "BANKNIFTY"    

let instruments = []
let api_key = "br1rb0jwdbfik1ll"

let kiteConnect = null; 
var spot_price = 0;
let diff = 0; 
let min_strike = 0
let max_strike = 0
let output = []

const getChain = asyncHandler(async (req, res) => {
    const {symbol,exp} = req.body 
    spot_symbol = symbol
    expiry = exp
    
    if(spot_symbol == 'NIFTY 50') option_name = 'NIFTY'
    else if(spot_symbol == 'NIFTY BANK') option_name = 'BANKNIFTY'
    
    kiteConnect = new KiteConnect({api_key: api_key, debug: false});
    kiteConnect.setAccessToken(process.env.ACCESS_TOKEN)

    output = []
    await loadInstruments() 
    await getSpotPrices()
    await calculateChain() 

    if (output) {
        res.status(201).json({spot_price: spot_price, data: output})
    }
    else 
    {
        res.status(400)
        throw new Error('Template not found')
    }    
});

async function loadInstruments() 
{            
    let promise = new Promise((resolve,reject)=>{        
        try 
        {             
            kiteConnect.getInstruments('NFO').then(data => {         
                    var fdata = data.filter(function(itm){
                        if(!itm['expiry']) return false;      
                        let dt = new Date(expiry) 
                        return itm.segment == 'NFO-OPT' && dt.getDate() == itm.expiry.getDate()  && itm.name == option_name            
                    });
                    
                    instruments = fdata
                    console.log(`Instruments Loaded= ${fdata.length}`);            
                    resolve('done')   
                }).catch(err => {
                    console.error(`Failed to load instruments.`, err);                 
                });  
        }catch(ex)
        {

        }
   
    })

    await promise   
}

async function getSpotPrices()
{    
    let promise = new Promise((resolve,reject)=>{ 
        let sym = []
        sym.push(spot_exchange+":"+spot_symbol)  
        //console.log(sym)         
        kiteConnect.getQuote(sym).then(data => { 
                //console.log(data)
                Object.keys(data).forEach(function(key) { 
                    spot_price = data[key].last_price 
                });
                
                console.log(spot_symbol+" SPOT Price: ", spot_price)
                resolve()
            }).catch(err => {
                console.error(`Failed to get Spot prices `,err)
            })       
    });

    await promise
    return;
}  

async function calculateChain()
{
    getDiff()
    console.log("Diff: ", diff )
    let mp = spot_price - (spot_price % diff)

    min_strike = mp - (89 * diff)
    max_strike = mp + (39 * diff)

    console.log("Min Strike: ", min_strike)
    console.log("Max Strike: ", max_strike)   

    let symbols = []
   
    for(let i= min_strike; i <= max_strike; i+=diff)
    {
        const call = instruments.filter(el => el.strike == i && el.instrument_type == 'CE') 
        const put = instruments.filter(el => el.strike == i && el.instrument_type == 'PE') 
        
        if(call.length > 0) symbols.push(call[0].exchange+":"+call[0].tradingsymbol)
        if(put.length > 0) symbols.push(put[0].exchange+":"+put[0].tradingsymbol)
    }
    
    if(symbols.length == 0) return; 

    const quotes = await getQuotes(symbols)
     
    for(let i= min_strike; i <= max_strike; i+=diff)
    {
        const call = instruments.filter(el => el.strike == i && el.instrument_type == 'CE') 
        const put = instruments.filter(el => el.strike == i && el.instrument_type == 'PE') 

        if(call.length == 0) continue;
        if(put.length == 0) continue;
        
        let c = Object.values(quotes).find(el => el.instrument_token == call[0].instrument_token);
        let p = Object.values(quotes).find(el => el.instrument_token == put[0].instrument_token);
        
        let days = Math.round((call[0].expiry - new Date() )/(1000*60*60*24))        
        let civ = option_implied_volatility(true,spot_price,i,10/100,days/365, c.last_price)  
        let piv = option_implied_volatility(false,spot_price,i,10/100,days/365, p.last_price)  

        let o = {
                ce_oi: c.oi,
                ce_vol: c.last_quantity,
                ce_iv: civ,                                
                ce_ltp: c.last_price, 
                ce_chng: c.net_change,
                ce_bid: c.depth.buy[0].price,
                ce_bid_qty:c.depth.buy[0].quantity, 
                ce_ask: c.depth.sell[0].price,  
                ce_ask_qty:c.depth.sell[0].quantity, 
                strike: i,              
                pe_oi: p.oi,
                pe_vol: p.last_quantity,
                pe_iv: piv,                                
                pe_ltp: p.last_price, 
                pe_chng: p.net_change,
                pe_bid: p.depth.buy[0].price,
                pe_bid_qty:p.depth.buy[0].quantity, 
                pe_ask: p.depth.sell[0].price,  
                pe_ask_qty: p.depth.sell[0].quantity, 
            }  
        output.push(o) 
    }

}

async function getQuotes(symbols)
{     
    let promise = new Promise((resolve,reject)=>{        
        kiteConnect.getQuote(symbols).then(data=>{            
            resolve(data)
        })
    })

    let result = await promise 
    return result 
}
 
function getDiff()
{
    let last = 0;     
    const tinstruments = instruments.filter(el => el.exchange == exchange && el.name == option_name)
    
    for(let i=0; i < tinstruments.length; i++)
    {
        if(i == 2)
        {            
            diff = tinstruments[i].strike - last
            break;
        }
        else last = tinstruments[i].strike 
    } 
}

const getExpiryDates = asyncHandler(async (req, res) => {
    const {symbol} = req.body
    kiteConnect = new KiteConnect({api_key: api_key, debug: false});
    kiteConnect.setAccessToken(process.env.ACCESS_TOKEN)
     
    if(spot_symbol === 'NIFTY 50') option_name = 'NIFTY'
    else if(spot_symbol === 'NITFY BANK') option_name = 'BANKNIFTY'
    
    let result = []

    let promise = new Promise((resolve,reject)=>{        
       kiteConnect.getInstruments('NFO').then(data => {    
            
            var fdata = data.filter(function(itm){                                
                return itm.segment == 'NFO-OPT' && itm.name == option_name           
            });
            
            let toutput = []
            fdata.filter(function(item){
                var i = toutput.findIndex(x => (x.expiry.toISOString().slice(0, 10) == item.expiry.toISOString().slice(0, 10)));                
                if(i <= -1){
                      toutput.push({expiry: item.expiry});
                }
                return null;
            });

            toutput.sort(function(a,b){                
                return b - a ;
            });

            toutput.forEach(d =>{
                result.push(d.expiry.toISOString().slice(0, 10))
            })            
            resolve('done')   
            }).catch(err => {
                console.error(`Zerodha: failed to load instruments.`, err);
            });  
   
    })

    await promise  

    if (result) {
        res.status(201).json(result)
    }
    else 
    {
        res.status(400)
        throw new Error('Expiry Dates not found')
    }    
})

////////////////////////////////////
function ndist(z) {
    return (1.0/(Math.sqrt(2*Math.PI)))*Math.exp(-0.5*z);
    //??  Math.exp(-0.5*z*z)
  }
   
  function N(z) {
    b1 =  0.31938153;
    b2 = -0.356563782;
    b3 =  1.781477937;
    b4 = -1.821255978;
    b5 =  1.330274429;
    p  =  0.2316419;
    c2 =  0.3989423;
    a=Math.abs(z);
    if (a>6.0) {return 1.0;} 
    t = 1.0/(1.0+a*p);
    b = c2*Math.exp((-z)*(z/2.0));
    n = ((((b5*t+b4)*t+b3)*t+b2)*t+b1)*t;
    n = 1.0-b*n;
    if (z < 0.0) {n = 1.0 - n;}
    return n;
  }  
    
  function black_scholes(call,S,X,r,v,t) { 
  // call = Boolean (to calc call, call=True, put: call=false)
  // S = stock prics, X = strike price, r = no-risk interest rate
  // v = volitility (1 std dev of S for (1 yr? 1 month?, you pick)
  // t = time to maturity
   
  // define some temp vars, to minimize function calls
    var sqt = Math.sqrt(t);
    var Nd2;  //N(d2), used often
    var nd1;  //n(d1), also used often
    var ert;  //e(-rt), ditto
    var delta;  //The delta of the option
   
    d1 = (Math.log(S/X) + r*t)/(v*sqt) + 0.5*(v*sqt);
    d2 = d1 - (v*sqt);
   
    if (call) {
      delta = N(d1);
      Nd2 = N(d2);
    } else { //put
      delta = -N(-d1);
      Nd2 = -N(-d2);
    }
   
    ert = Math.exp(-r*t);
    nd1 = ndist(d1);
   
    gamma = nd1/(S*v*sqt);
    vega = S*sqt*nd1;
    theta = -(S*v*nd1)/(2*sqt) - r*X*ert*Nd2;
    rho = X*t*ert*Nd2;
   
    return ( S*delta-X*ert *Nd2);
   
  } //end of black_scholes
   
  function option_implied_volatility(call,S,X,r,t,o) { 
  // call = Boolean (to calc call, call=True, put: call=false)
  // S = stock prics, X = strike price, r = no-risk interest rate
  // t = time to maturity
  // o = option price
   
  // define some temp vars, to minimize function calls
    sqt = Math.sqrt(t);
    MAX_ITER = 100;
    ACC = 0.0001;
   
    sigma = (o/S)/(0.398*sqt);
    for (i=0;i<MAX_ITER;i++) {
      let price = black_scholes(call,S,X,r,sigma,t);
      let ddiff = o-price;
      if (Math.abs(ddiff) < ACC) return sigma;
      d1 = (Math.log(S/X) + r*t)/(sigma*sqt) + 0.5*sigma*sqt;
      vega = S*sqt*ndist(d1);
      sigma = sigma+ddiff/vega;
    }
    return 0;   
  } 

/////////////////////////////////////
module.exports = {
    getChain,
    getExpiryDates
  }