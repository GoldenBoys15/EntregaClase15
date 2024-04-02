const express = require('express');
const exphbs  = require('express-handlebars'); 
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');

// Conectar a la base de datos MongoDB
mongoose.connect('mongodb://localhost:27017/ecommerce', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
db.once('open', () => {
    console.log('Conexión a MongoDB establecida correctamente');
});

// Configurar Handlebars
app.engine('handlebars', exphbs.engine({ defaultLayout: false }));
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/views`);

// Definir modelos de Mongoose
const Product = require('./dao/models/ProductModel');
const Cart = require('./dao/models/CartModel');
const Message = require('./dao/models/MessageModel');

// Rutas para las vistas
app.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.render('home', { products });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await Product.find();
        res.render('realTimeProducts', { products });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/chat', (req, res) => {
    res.render('chat');
});


// Manejo de conexiones WebSocket
io.on('connection', (socket) => {
    console.log('Usuario conectado al chat');

    // Manejar envío de mensaje
    socket.on('sendMessage', (messageData) => {
        // Aquí puedes guardar el mensaje en la base de datos si es necesario
        console.log(`Nuevo mensaje recibido: ${messageData.message} (Usuario: ${messageData.user})`);
        
        // Emitir el nuevo mensaje a todos los clientes
        io.emit('newMessage', messageData);
    });

    // Manejar desconexión de usuario
    socket.on('disconnect', () => {
        console.log('Usuario desconectado del chat');
    });
});



const PORT = 8080;
http.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
