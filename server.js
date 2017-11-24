// Servidor

var express = require('express')
var app = express()
var mongoose = require('mongoose')

//Conexion a db

mongoose.connect('mongodb://localhost:27017/node-demo')

//Configuracion

app.configure( ()=> {
    //Localizacion fichero estático
    app.use(express.static(__dirname + '/public'))
    //Logger en consola
    app.use(express.logger('dev'))
    //Habilitamos POST para HTML
    app.use(express.bodyParser())
    //Simulacion DELETE PUT
    app.use(express.methodOverride())
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

// POST que crea una GALERIA y devuelve todos tras la creación
app.post('/api/galerias', function(req, res) {				
	Galeria.create({
		text: req.body.text,
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
app.delete('/api/todos/:todo', function(req, res) {		
	Galeria.remove({
		_id: req.params.todo
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


//Abrimos un puerto a nuestra app
app.listen(3000, () => console.log('Galeria en puerto 3000'))