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
      where exchange='${exchange}' and tradingsymbol='${symbol}' and high!=low order by time desc limit ${limit}`;
    }
    else 
    {
      query  = `select time as ts, * from (select time,first(open) as open,max(high) as high,min(low) as low,last(close) as close,sum(vol) as vol from bars 
      where exchange='${exchange}' and tradingsymbol='${symbol}' group by time(${tf}),*) order by time desc limit ${limit}`;
    }
    
    //console.log(query)

    influx.query(query)
    .then( rows => { 
      var output = new Array();  
   
      rows.forEach(row => { 
            //console.log(row)
            let ts = 0
            if(tf == '1m')
            {
                ts =parseInt(row.time.getNanoTime()) /1000; 
                ts = ts / 1000
            } 
            else 
            {
                ts = new Date(row.ts).getTime();           
            }
            output.push([ts,row.open,row.high,row.low,row.close,row.vol]);      
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