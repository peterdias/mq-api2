const asyncHandler = require('express-async-handler')
const colors = require('colors')
const dotenv = require('dotenv').config()
const connectDB = require('./config/db')

connectDB()

//const Instrument = require('./models/instrument')
const MarketTrade = require('./models/market_trade')
const Instrument = require('./models/instrument')
// const getExchanges = asyncHandler(async (req, res) => {
//     const instruments = await Instrument.find({'exchange':'NFO','segment':'NFO-FUT','instrument_type':'FUT'}).distinct("tradingsymbol")
      
//     console.log(instruments)
// })

// getExchanges()

async function getPositions()
{
    const start = new Date().toDateString();
    const trades  = await MarketTrade.find({createdAt: {$gte : start }})

    const symbols = [...new Set(trades.map(item => item.tradingsymbol))];
    
    let positions = []
    for(const symbol of symbols) {
        let instrument = await Instrument.findOne({'tradingsymbol': symbol})
        let buy_count = 0
        let sell_count = 0
        let buy_qty = 0
        let sell_qty = 0
        let buy_avg_price = 0
        let sell_avg_price = 0
        console.log(instrument)
        for(const trade of trades)
        {

            if(trade.tradingsymbol== symbol)
            {
                if(trade.trans =='BUY'){
                     buy_qty+= trade.qty
                     buy_avg_price+= trade.price 
                     buy_count++
                }    
                else if(trade.trans =='SELL') {
                    sell_qty+= trade.qty
                    sell_avg_price+= trade.price 
                    sell_count++
                }
            }
        }

        if(buy_count >0) buy_avg_price= buy_avg_price / buy_count
        if(sell_count>0) sell_avg_price = sell_avg_price / sell_count
        let net_qty = buy_qty +  sell_qty

        let mtm = net_qty * instrument.tick_size
        positions.push({tradingsymbol: symbol, mtm: mtm,buy_avg_price:buy_avg_price,sell_avg_price: sell_avg_price, buy_qty: buy_qty, sell_qty: sell_qty, net_qty: net_qty})
    }

    console.log(positions)
}

getPositions()