const asyncHandler = require('express-async-handler')
const Influx = require('influx');

const getBars = asyncHandler(async (req, res) => {
     
    const influx = new Influx.InfluxDB({
        host: '10.122.0.4',
        database: 'databank'        
      });
    
    influx.query(`
      select * from bars
      limit 5
    `)
    .then( result => res.status(200).json(result) )
    .catch( error => res.status(500).json({ error }) );

    

    return({})
  })

module.exports = {
    getBars
  }