var express = require('express')
var mongoose = require('mongoose')
var jobs = require('./jobs.js')

var fs = require('fs')
var formidable = require('formidable')
var path = require('path')

mongoose.Promise = global.Promise;mongoose.connect('mongodb://localhost:27017/galeria')

var app = express()
var server = require('http').Server(app);
var io = require('socket.io')(server)
var port = 3000

var bodyParser = require('body-parser')
//var multer = require('multer')


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended:false}))
app.use(express.static(__dirname + '/public'))

//app.use(multer({dest: './uploads/'}))

var nameSchema = new mongoose.Schema({
    name: String,
    description: String,
    photos: [{
        url: String
    }]
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

app.get('/api/galeria/:id', (req, res) => {
	Galeria.find({_id:req.params.id}, (err, galeria) => {
		if(err) { res.send(err) }
		res.json(galeria)
	})
})

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

app.post('/api/galeria/uploadPhoto/:id', (req,res) => {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        var old_path = files.filenew.path,
            file_size = files.filenew.size,
            file_ext = files.filenew.name.split('.').pop(),
            index = old_path.lastIndexOf('/') + 1,
            file_name = old_path.substr(index),
            new_path = path.join(process.env.PWD, '/uploads/', file_name + '.' + file_ext);
/*
        fs.readFile(old_path, function(err, data) {
            fs.writeFile(new_path, data, function(err) {
                fs.unlink(old_path, function(err) {
                    if (err) {
                        res.status(500);
                        res.json({'success': false});
                    } else {
                        res.status(200);
                        res.json({'success': true});
                    }
                });
            });
        });*/
    });

    Galeria.update( { "_id": req.params.id }, {"$push": { photos: req.body.filename }}, {"upsert":true})

    res.json({success: true, changed: 12 })
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

app.post('/addPhoto', (req, res) => {						
	res.sendFile(__dirname+'/public/addPhoto.html');
});

app.get('/', (req, res) => {						
	res.sendFile(__dirname+'/public/galeria.html');
});

app.get('/public/main.js', (req, res) => {                        
    res.sendFile(__dirname+'/public/main.js');
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

