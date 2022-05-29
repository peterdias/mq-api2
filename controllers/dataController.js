const asyncHandler = require('express-async-handler')
const Influx = require('influx');

const getBars = asyncHandler(async (req, res) => {
    const {symbol, tf, start,stop,limit } = req.body 

    // if (!symbol || !tf || !start || !stop) {
    //   res.status(400)
    //   throw new Error('Some fields are missing')
    // }

    const influx = new Influx.InfluxDB({
        host: process.env.IDB_HOST,
        database: process.env.IDB_DATABASE        
      });
    
    const query = "select time,open,high,low,close,vol from bars limit 2"
    influx.query(query)
    .then( rows => { 
      var output = new Array();

      rows.forEach(row => {        
        output.push([row.time.getNanoTime(),row.open,row.high,row.low,row.close,row.vol]);
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