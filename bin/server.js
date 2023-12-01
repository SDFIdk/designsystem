import express from 'express'

const app = express()
const port = 3000

// Middleware to serve static files from the "public" directory
app.use(express.static('./'))

// Default route
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
})
