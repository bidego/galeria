var express = require('express')
var mongoose = require('mongoose')
mongoose.Promise = global.Promise;mongoose.connect('mongodb://localhost:27017/galeria')

var app = express()
var port = 3000

var bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended:true}))

var nameSchema = new mongoose.Schema({
 firstName: String,
 lastNameName: String
});

var Galeria = mongoose.model('galeria', nameSchema);

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/galeria.html")
})

app.post("/addname", (req, res) => {
 var myData = new Galeria(req.body)
 myData.save()
 .then(item => {
    res.sendFile(__dirname + "/galeria.html")
 })
 .catch(err => {
  res.status(400).send('unable to save to db')
 })
})


//Definimos modelos.
var User = mongoose.model('Galeria', nameSchema)

// Rutas de nuestro API
// GET de todos las GALERIAs
app.get('/api/galerias', function(req, res) {				
	Galeria.find(function(err, galerias) {
		if(err) {
			res.send(err);
		}
		res.json(galerias);
	});
});

/*
app.post('/api/galerias', function(req, res) {				        
    var myData = new Galeria(req.body)
    myData.save()
    .then(item => {
    res.sendFile(__dirname + "/galeria.html")
    })
    .catch(err => {
    res.status(400).send('unable to save to db')
    })
})*/

// POST que crea una GALERIA y devuelve todos tras la creación
app.post('/api/galerias', function(req, res) {				
	Galeria.create({
		firstName: req.body.text,
		done: false
	}, function(err, todo){
		if(err) {
			res.send(err);
		}

		Galeria.find(function(err, galerias) {
			if(err){
				res.send(err);
			}
			res.json(galerias);
		});
	});
});

// DELETE un TODO específico y devuelve todos tras borrarlo.
app.delete('/api/galerias/:galeria', function(req, res) {		
	Galeria.remove({
		_id: req.params.galeria
	}, function(err, todo) {
		if(err){
			res.send(err);
		}

		Galeria.find(function(err, galerias) {
			if(err){
				res.send(err);
			}
			res.json(galerias);
		});

	})
});

// Carga una vista HTML simple donde irá nuestra Single App Page
// Angular Manejará el Frontend
app.get('*', function(req, res) {						
	res.sendfile('./public/galeria.html');				
});


app.listen(port, () => {
 console.log("Server listening on port " + port)
})

