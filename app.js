var express = require('express')
var mongoose = require('mongoose')

mongoose.Promise = global.Promise;mongoose.connect('mongodb://localhost:27017/galeria')

var app = express()
var server = require('http').Server(app);
var io = require('socket.io')(server)
var port = 3000

var bodyParser = require('body-parser')
//var multer = require('multer')


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended:true}))
app.use(express.static(__dirname + '/public'))

//app.use(multer({dest: './uploads/'}))

var nameSchema = new mongoose.Schema({
    name: String,
    description: String
/*    photos: [{
        url: String,
        title: String,
        description: String
    }]*/
});

//Definimos modelos.
var Galeria = mongoose.model('galeria', nameSchema);

// Rutas de nuestro API
// GET de todos las GALERIAs
app.get('/api/galerias', (req, res) => {
	Galeria.find( (err, galerias) => {
		if(err) {
			res.send(err);
		}
		res.json(galerias);
	});
});

// POST que crea una GALERIA y devuelve todos tras la creación
app.post('/api/galerias', (req, res) => {
	Galeria.create({
        name: req.body.name,
        description: req.body.description,
		done: false
	}, (err, galeria) => {
		if(err) {
			res.send(err);
		}

		Galeria.find( (err, galerias) => {
			if(err){
				res.send(err);
			}
			res.json(galerias);
		});
	});
});

app.post('/upload', (req,res) => {
    console.log(req.body)
    console.log(req.files)
    res.json({success: true})
})

// DELETE un TODO específico y devuelve todos tras borrarlo.
app.delete('/api/galerias/:galeria', (req, res) => {		
	Galeria.remove({
		_id: req.params.galeria
	}, (err, galeria) => {
		if(err){
			res.send(err);
		}

		Galeria.find( (err, galerias) => {
			if(err){
				res.send(err);
			}
			res.json(galerias);
		});

	})
});

// Carga una vista HTML simple donde irá nuestra Single App Page
// Angular Manejará el Frontend

app.get('*', (req, res) => {						
	res.sendFile(__dirname+'/public/galeria.html');				
});

io.on('connection', socket => {
    console.log("new connection")

    socket.on('my other event', (data) => {
        io.emit('notif', {
            message: 'new event',
            event: event
        })
        console.log(data);
    })
});

app.listen(port, () => {
 console.log("Server listening on port " + port)
})

