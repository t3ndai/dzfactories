const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io').listen(http, { origins : '*:*'})
const { check, validationResult } = require('express-validator/check')
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()
const sql = require('./sql')
const Factory = require('./factory')

app.use(bodyParser.json(), cors())

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  res.header('Access-Control-Allow-Credentials', false)
  res.header('Access-Control-Allow-Methods', 'OPTIONS, POST, GET, PATCH, PUT')
  next()
})

const connectToServices = (async() => {
	try {
		await sql.prepareDB()

	}catch(err) {
		console.log(err)
	}
})()


app.get('/', (req,res, next) => {
	res.json({ 'message' : 'ok'}).status(200)
})

io.on('connection', (socket) => {
	console.log('user connected')

})

app.route('/factories')
   .all((req,res,next) => {
   		next()
   })
   .post([

   		check('name').isLength({ min : 1}),
   		check('max').isInt(),
   		check('min').isInt(),
   		check('numChild').isInt({ max : 15 }),
   		check('children').isArray(),

   	], (req, res, next) => {

   		try {
   			validationResult(req)
   			const factory = req.body
   			Factory.create(factory)
   				.then(() => {
   					Factory.index()
   						.then(response => {
   							io.emit('new_factories', response)
   							return res.json(response)
   						})
   				})
   			//console.log(factory)
   			
   			
   		}catch(err) {
   			return res.status(422).json({ 'errors' : validationErrors.mapped() })

   		}

   	})

   .get((req, res, next) => {

   		try {
   			Factory.index()
   				.then(response => res.json(response))

   		} catch(err) {
   			return res.status(502).json({'errors' : 'could not get factories'})
   		}

   })

   .patch([

   		check('name').isLength({ min : 1}),
   		check('max').isInt(),
   		check('min').isInt(),
   		check('children').isArray(),

   	],(req, res, next) => {

   		try {

   			validationResult(req.body)
   			const factory = req.body

   			Factory.update(factory)
   				.then(() => {
   					Factory.index()
   						.then(response => {
   							io.emit('new_factories', response)
   							return res.json(response)
   						})
   						
   				})


   		}catch(err) {
   			return res.json({'errors' : 'update not completed'})
   		}
   		
   })

   .delete((req, res, next) => {

   		try {

   			const factory = req.body

   			Factory.remove(factory)
   				.then(() => {
   					Factory.index()
   						.then(response => {
   							io.emit('new_factories', response)
   							return res.json(response)
   						})
   						
   				})

   		}catch(err) {
   			return res.json({ 'errors' : 'item could not be deleted'})
   		}

   })


const port = process.env.PORT
http.listen(port,() => console.log(`listening on:${port}`))