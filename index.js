const express = require("express"); 
const app = express(); 
const bcrypt = require("bcrypt");
app.use(express.json());

const db = { 
    users: []
};

app.get("/",(req, res)=> {          
    console.log("Hello world");
    res.send("Hello World");
});

app.get("/users",(req, res)=> {  
    res.status(200).json({
        message: "All users",
        data: db.users
    });
});

app.get("/users/:id",(req, res)=> {  
    const userID = req.params.id;   
    const reqUser = db.users.find(user => user.id === parseInt(userID));
    res.status(200).json({
        message: "user requested",
        data: reqUser
    });
});

app.post("/login", async (req, res)=> {          
    const data = req.body;
    const reqUser = db.users.find(user => user.email === data.email);
    bcrypt.compare(data.password, reqUser.password, function (err, result) {
        if(result) {
            return res.status(200).json({
                message: "User logged in",
                data: reqUser
            })
        } else {
            return res.status(401).json({
                message: "Incorrect email or password"
            })
        }
    })
    
});

app.post("/register", async (req, res) => {
    const data = req.body;

    const hashedPass = await bcrypt.hash(data.password, 10)

    const user = {
        id: db.users.length + 1,
        name: data.name,
        last: data.last,
        email: data.email,
        password: hashedPass
    }

    db.users.push(user);

    return res.status(200).json({
        message: "User created",
        data: user
    });
});

app.listen(3000);       

