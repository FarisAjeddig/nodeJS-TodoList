var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    ent = require('ent'); // Permet de bloquer les caractères HTML (sécurité équivalente à htmlentities en PHP)

var tacheArray = ["Valider le cours d'Openclassrooms"];


// Chargement de la page index.html
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket, pseudo) {
    // Dès qu'on nous donne un pseudo, on le stocke en variable de session et on envoie à l'utilisateur le tableau existant de tâche.
    socket.on('nouveau_client', function(pseudo) {
        pseudo = ent.encode(pseudo);
        socket.pseudo = pseudo;
        socket.emit('tableau', tacheArray);
    });

    // Dès qu'on reçoit un message, on récupère le pseudo de son auteur et on le transmet aux autres personnes
    socket.on('tache', function (tache) {
      console.log(tache);
      tacheArray.push(tache);
      socket.broadcast.emit('tache', tache);
    });

    socket.on('delete', function(id){
      console.log(id);
      tacheArray[id] = ''
      socket.broadcast.emit('delete', id);
    })
});

server.listen(8080);
