//initialize the socketio

const socket  = io()

//To check if the browser supports geolocation
//if mai ham check kar rahe hai ki kya navigator mai geolocation hai ya nahi 
if(navigator.geolocation){    //navigator ek objecthota hai aur woh windows mai pehle se hi rehtahai 
    navigator.geolocation.watchPosition((position)=>{
        const {latitude, longitude}=position.coords   //ab hamare pass latitude aur longitude aa gaya hai jab woh banda move karega 
        socket.emit("send-location",{latitude,longitude})  //mai frontend se ye socket emit kar raha hu aur usme latitude aur longitude bhej raha hu 
    },(error)=>{
        console.error(error);
        
    },{
        enableHighAccuracy:true,
        timeout:5000,   //iska matlab aap phirse ek baar check karo ki aapka location kya hai 5 seconds k baad ye 5000 milioseconds hai 
        maximumAge:0  //isse hamara woh banda cach nahi karega 
    })  //ye line bata raha hai ki jab bhi banda move karega toh uski position watch karo 

}
const map = L.map("map").setView([0,0],16)   //ye basicall ye keh rahe hai ki uska location do 

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
    attribution:"Reeshu"
}).addTo(map)

const markers = {};


socket.on("receive-location",(data)=>{
    const {id,latitude,longitude} = data;
    map.setView([latitude,longitude]) 
   if(markers[id]) {   //agar marker hai toh set karo long aur latitude 
    markers[id].setLatLng([latitude,longitude])
   }  //agar markers nahi hai toh 
   else{
    markers[id] = L.marker([latitude,longitude]).addTo(map)
   }
})

socket.on("user-disconnected",(id)=>{
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id]
    }
})