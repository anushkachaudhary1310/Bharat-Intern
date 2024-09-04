const express =require("express");
const mongoose =require("mongoose");
const bodyParser =require("body-parser");
const dotenv =require("dotenv");

const app=express();
dotenv.config();

const port =process.env.PORT || 3000;

const username= process.env.MONGODB_USERNAME;// get the data from an env file 
const password= process.env.MONGODB_PASSWORD;

mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.hr4cp.mongodb.net/RegistrationFormDB`,{
    useNewUrlParser :true,
    useUnifiedTopology : true,
})
.then(()=> console.log("Connected to MongoDB"))
.catch(err=> console.error("could not connect to MongoDB",err));

const registrationSchema = new mongoose.Schema({
    name : String,
    email : String, 
    password: String,
})

const Registration =mongoose.model("Registration", registrationSchema);

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.get("/",(req,res)=>{
    res.sendFile(__dirname + "/page/index.html");
})

app.post("/register", async(req,res)=>{
    try{
        const {name, email,password} =req.body;

        const existingUSer = await Registration.findOne({email: email});
        //check for existing user
        if(!existingUSer){
            const registratinData=new Registration({ //object just like schema
                name,
                email,
                password
            })
            await registratinData.save(); // since we use await we have to make this function as async 
            res.redirect("/sucess");
        }
        else{
            console.log("Sorry!! User already exists.");
            res.redirect("/unsucess");
        }
    }
    catch(e){
        console.log(e);
        res.redirect("/unsucess");
    }
})

app.get("/sucess", (req,res)=>{
    res.sendFile(__dirname + "/page/sucess.html");
})
app.get("/unsucess",(req,res)=>{
    res.sendFile(__dirname+"/page/unsucess.html");
})
// Route to shut down the server
app.get("/shutdown", (req, res) => {
    res.send("Server is shutting down...");
    console.log("Server is shutting down...");
    server.close(() => {
        console.log("Server has shut down.");
        process.exit(0);  // Exit the Node.js process
    });
});
app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})