const express = require('express')
const app = express()
const http =  require('http')
const path = require('path')
const socketio = require('socket.io')

const server = http.createServer(app)

const io = socketio(server)

io.on("connection", function(socket){
    socket.on("send-location",function (data){  //ye hamne send-location receive kare hai backend pe 
        io.emit("receive-location",{id:socket.id,...data})     //io.emit() se jitne bhi log mera location dekhege toh unko dikhega 
    })//id:socket.id--> iska matlab ki ham socket k pass ek unique id hota hai woh milega 
    console.log("connected!");

    socket.on("disconnect",function(){
   io.emit("user-disconnected",socket.id)   //yebata raha hai ki socket.id disconnect hua hai 
})
    
})



app.set("view engine","ejs")
app.use(express.static(path.join(__dirname,"public")))

app.get("/",function(req,res){
    res.render("index")
})

server.listen(3000,(req,res)=>{
    console.log("socket io connected");
    
})