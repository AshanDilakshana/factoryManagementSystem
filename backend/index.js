const express = require("express");
const mongoose = require('mongoose');
require("dotenv").config();
const cors = require('cors');

const PORT = process.env.PORT || 3001;
const app = express();

require("dotenv").config(); 
app.use(express.json()); 
app.use(cors());

//declare the parth hear
const WorkOder = require("./Routes/workoder_routes.js");
const machine = require("./Routes/machine_routes.js");
const employee = require("./Routes/employee_routes.js");


app.get('/',(req,res)=>res.send("Helow server is running .."));
app.use("/", WorkOder);
app.use("/",machine);
app.use("/",employee);

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log(`port number => ${PORT} 📌`);
        app.listen(PORT, () => console.log("MongoDB Database Connected 🌿 ✅"));
    }).catch((err) => {
        console.log(err);
        console.error('MongoDB Database Connection Failed:', err);
    });
