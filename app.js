const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const { check, validationResult } = require('express-validator/check')
const bodyParser = require('body-parser')
const cors = require('cors')

app.use(bodyParser.json(), cors())


app.get('/', (req,res, next) => {
	res.json({ 'message' : 'ok'}).status(200)
})

io.on('connection', (socket) => {
	console.log('user connected')
	socket.on('factories', (data) => {
		console.log(data)
		socket.broadcast.emit('new_factories', data)
	})

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

   	], (req, res, next) => {

   		try {
   			validationResult(req)
   			console.log(req.body)
   			return res.json(req.body)
   			
   		}catch(err) {
   			return res.status(422).json({ 'errors' : validationErrors.mapped() })

   		}

   	})


http.listen(3000,() => console.log('listening on:3000'))