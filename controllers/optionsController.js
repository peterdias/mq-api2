const asyncHandler = require('express-async-handler')
var KiteConnect = require("kiteconnect").KiteConnect;

let spot_exchange = "NSE"
let spot_symbol = "NIFTY BANK"
let expiry = "8/25/2022"
let exchange = "NFO"
let option_name = "BANKNIFTY"    

let instruments = []
let api_key = "br1rb0jwdbfik1ll"
let access_token = "a9Vex3kGvu3NWItH0RTejrmQn5Y0nXiz"

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
    
    if(spot_symbol == 'NITFY') option_name = 'NIFTY'
    else if(spot_symbol == 'NITFY BANK') option_name = 'BANKNIFTY'
    
    kiteConnect = new KiteConnect({api_key: api_key, debug: false});
    kiteConnect.setAccessToken(access_token)

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
                throw {
                    error: 'Failed to load instruments data from Zerodha',
                    details: err
                };
            });  
        }catch(ex)
        {

        }
   
    })

    let rest = await promise   
}

async function getSpotPrices()
{    
    let promise = new Promise((resolve,reject)=>{ 
        let sym = []
        sym.push(spot_exchange+":"+spot_symbol)           
        kiteConnect.getQuote(sym).then(data => { 
                console.log(data)
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

    const tinstruments = instruments  // instruments.filter(el => el.exchange == exchange && el.name == option_name)

    let symbols = []

    for(let i= min_strike; i <= max_strike; i+=diff)
    {
        const call = tinstruments.filter(el => el.strike == i && el.instrument_type == 'CE') 
        const put = tinstruments.filter(el => el.strike == i && el.instrument_type == 'PE') 

        symbols.push(call[0].exchange+":"+call[0].tradingsymbol)
        symbols.push(put[0].exchange+":"+put[0].tradingsymbol)
    }

    const quotes = await getQuotes(symbols)
     
    for(let i= min_strike; i <= max_strike; i+=diff)
    {
        const call = tinstruments.filter(el => el.strike == i && el.instrument_type == 'CE') 
        const put = tinstruments.filter(el => el.strike == i && el.instrument_type == 'PE') 

        let c = Object.values(quotes).find(el => el.instrument_token == call[0].instrument_token);
        let p = Object.values(quotes).find(el => el.instrument_token == put[0].instrument_token);
                  
        let o = {
                ce_oi: c.oi,
                ce_vol: c.last_quantity,
                ce_iv: 0,                                
                ce_ltp: c.last_price, 
                ce_chng: c.net_change,
                ce_bid: c.depth.buy[0].price,
                ce_bid_qty:c.depth.buy[0].quantity, 
                ce_ask: c.depth.sell[0].price,  
                ce_ask_qty:c.depth.sell[0].quantity, 
                strike: i,              
                pe_oi: p.oi,
                pe_vol: p.last_quantity,
                pe_iv: 0,                                
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
    //console.log("Quotes Fetched") 
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


module.exports = {
    getChain
  }