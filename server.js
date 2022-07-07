const express = require('express')
const cors = require('cors');
const colors = require('colors')
const dotenv = require('dotenv').config()
const { errorHandler } = require('./middleware/errorMiddleware')
const connectDB = require('./config/db')
const port = process.env.PORT || 80

connectDB()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(cors({
  origin: '*'
}));

app.use('/api/user', require('./routes/userRoutes'))
app.use('/api/data', require('./routes/dataRoutes'))
app.use('/api/watchlist', require('./routes/watchlistRoutes'))
app.use('/api/instruments', require('./routes/instrumentRoutes'))
// Serve frontend
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')))

  app.get('*', (req, res) =>
    res.sendFile(
      path.resolve(__dirname, '../', 'frontend', 'build', 'index.html')
    )
  )
} else {
  app.get('/', (req, res) => res.send('MQ API Gateway'))
}

app.use(errorHandler)

app.listen(port, () => console.log(`Server started on port ${port}`))