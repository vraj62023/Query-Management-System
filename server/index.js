const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const queryRoutes = require('./routes/queryRoutes');
const adminRoutes = require('./routes/adminRoutes'); 

//load environment variables from .env files
dotenv.config();

const app = express();

//Middleware to let the server read the JSON data from the frontend
app.use(express.json());

app.use('/api/auth',authRoutes); //base pathing
app.use('/api/queries', queryRoutes);
app.use('/api/admin', adminRoutes);

//basic route to test if server is working 
app.get('/',(req,res)=>{
    res.send('server is running');

});
//set the port 
const PORT = process.env.PORT || 5000;

//connect to the mongodb and start the server
mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log('db is connected');
    app.listen(PORT,()=>console.log(`server is running on port ${PORT}`));
})
.catch((err)=>console.log("db connection error:",err));