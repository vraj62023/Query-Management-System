const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const queryRoutes = require('./routes/queryRoutes');
const adminRoutes = require('./routes/adminRoutes'); 

dotenv.config();

const app = express();

app.use(cors({
    origin: [
        "http://localhost:5173",                 
        process.env.CLIENT_URL                   
    ],
    credentials: true  
}))                         

app.use(express.json());


app.use('/api/auth',authRoutes);
app.use('/api/queries', queryRoutes);
app.use('/api/admin', adminRoutes);


app.get('/',(req,res)=>{
    res.send('server is running');

});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log('db is connected');
    app.listen(PORT,()=>console.log(`server is running on port ${PORT}`));
})
.catch((err)=>console.log("db connection error:",err));