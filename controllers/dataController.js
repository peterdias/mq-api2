const asyncHandler = require('express-async-handler')
const Influx = require('influx');

const getBars = asyncHandler(async (req, res) => {
    const {exchange, symbol, tf, start,stop,limit } = req.body 
    //console.log(req.body) 
    // if (!symbol || !tf || !start || !stop) {
    //   res.status(400)
    //   throw new Error('Some fields are missing')
    // }
     
    const influx = new Influx.InfluxDB({
        host: process.env.IDB_HOST,
        database: process.env.IDB_DATABASE        
      });
    
    let query = '';
    if(tf == '1m')
    {
      query  = `select time,open,high,low,close,vol from bars 
      where exchange='${exchange}' and tradingsymbol='${symbol}' and open!=close and high!=low order by time desc limit ${limit}`;
    }
    else 
    {
      query  = `select time,open,high,low,close,vol from bars 
      where exchange='${exchange}' and tradingsymbol='${symbol}' order by time desc limit ${limit}`;
    }
    
    //console.log(query)

    influx.query(query)
    .then( rows => { 
      var output = new Array();       
      rows.forEach(row => {        
          output.push([parseInt(row.time.getNanoTime())/1000,row.open,row.high,row.low,row.close,row.vol]);
        })
        res.status(200).json(output.reverse()) 
      } 
    )
    .catch( error => res.status(500).json({ error }) );
   
    return({})
  })

module.exports = {
    getBars
  }