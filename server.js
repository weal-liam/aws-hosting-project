const express = require('express');
const path =  require('path');
const http = require('http');
const {Server} =require('socket.io');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const router = require('./routes');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'static_files/')))
app.use(express.static(path.join(__dirname, 'static_scripts/')))
app.use(express.urlencoded({ extended: true }));

app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs')

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https://images.unsplash.com"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://cdnjs.cloudflare.com",
          "https://cdn.jsdelivr.net"
        ],
        styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
      },
    },
  })
);

app.use(cors({
  origin: ['http://localhost:10000', 'https://yourdomain.com'], // allow multiple
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // allow cookies and Authorization headers
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    message: "Too many requests from this IP, please try again later."
  },
  headers: true
});

app.use('/',limiter,router)

app.use(morgan('combined'));

//socket.IO connection handling
io.on('connection',(socket)=>{
    console.log('a user connected:',socket.id);

    //listening for custom events from the client
    socket.on('chat message',(msg)=>{
    console.log("Messsage from client:",msg)
    //Emit message to all connected clients
    io.emit('chat message',msg);//i.emit sends to everyone
    });
    //listen for disconnect event
    socket.on('disconnect',(socket)=>{
    console.log('User disconnected:',socket.id)
    });
});

const PORT = process.env.PORT || 10000
server.listen(PORT,'0.0.0.0', ()=>{
    console.log(`Server is listening on port ${PORT}....`);
})