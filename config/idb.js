const Influx = require('influx'); 

const connectIDB = async () => {
  try {
    const influx = new Influx.InfluxDB({
        host: process.env.IDB_HOST,
        database: process.env.IDB_DATABASE        
    });

    console.log(`IDB Connected: `.cyan.underline)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

module.exports = connectIDB