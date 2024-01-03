var express = require('express')
var fs = require('fs')
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser');
var app = express()
app.set('view engine', 'ejs');


/*app.get("/",function(req,res){
    res.sendFile(__dirname+"/header.html")
})*/
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser());


app.get("/",function(req,res){
    res.sendFile(__dirname+"/login.html")
})

app.get("/login",function(req,res){
    res.sendFile(__dirname+"/login.html")
})

app.get("/register",function(req,res){
    res.sendFile(__dirname+"/register.html")
})



app.post("/registerdetails",function(req,res){
    console.log("request received",req.body)
    var filedata = JSON.parse(fs.readFileSync("register.txt").toString())
    //console.log(filedata)
   // console.log(Array.isArray(filedata))
   filedata.push(req.body)
   fs.writeFileSync("register.txt",JSON.stringify(filedata))
})

app.post("/authentication",function(req,res){
    var logindata = JSON.parse(fs.readFileSync("register.txt"))
    //console.log(logindata)
    //console.log(logindata.toString())
    //console.log(Array.isArray(logindata))
    console.log(req.body)
    var filtereddata = logindata.filter(function(data){
        if(data.email === req.body.email && data.password === req.body.password){
            return true

        }

    })
    //console.log(filtereddata)
    if(filtereddata.length!=0){
        var token = jwt.sign({email:req.body.email,password:req.body.password},'manasa')
        res.cookie('token',token)
        res.redirect("/dashboard")
    }
    else{
        res.sendFile(__dirname+"/login1.html")
    }
     
})

app.get("/dashboard",function(req,res){
    var logedinuser = jwt.decode(req.cookies.token)
    var logindata = JSON.parse(fs.readFileSync("workoutdashboard.txt"))
    //console.log(logindata)
    res.render('workoutdashboard',{logindetails:logindata,user:logedinuser.email})
})

app.get("/categories/:Day",function(req,res){
    var logedinuser = jwt.decode(req.cookies.token)
    var workoutcategories = JSON.parse(fs.readFileSync("workoutcategories.txt").toString())
    //console.log(Array.isArray(workoutcategories))
    //console.log(req.params)
    var workout = workoutcategories.filter(function(a){
        if(a.Day === req.params.Day){
            return true
            
        }
       
    })
   // console.log(workout)
    res.render('workoutcategories',{categories:workout,user:logedinuser.email})
    
    //console.log(workoutcategories)
    //console.log(Array.isArray(workoutcategories))
    //res.send(workoutcategories)
})

app.post("/report/:Day",function(req,res){
    var logedinuser = jwt.decode(req.cookies.token)
   // console.log(req.body)
    var workoutcategories = JSON.parse(fs.readFileSync("workoutcategories.txt").toString())
    var workout = workoutcategories.filter(function(a){
        if(a.Day === req.params.Day){
            return true
            
        }
       
    })
    //console.log(workout)
    var Date = req.body.date
   // console.log({...workout,date:Date})
    //workout.push({...workout[0],date:Date})
    // console.log({...workout[0],date:Date})
    var report = JSON.parse(fs.readFileSync("report.txt").toString())
    report.push({...workout[0],date:Date,user:logedinuser.email})
    fs.writeFileSync("report.txt",JSON.stringify(report))
    // res.render("report",{user:logedinuser.email})
    res.redirect("/report")
   
})

app.get("/report",function(req,res){
    var logedinuser = jwt.decode(req.cookies.token)
    var report = JSON.parse(fs.readFileSync("report.txt"))
    // console.log(report)
    console.log(Array.isArray(report))
    res.render("report.ejs",{user:logedinuser.email,report:report})


})

app.get("/logout",function(req,res){
    res.sendFile(__dirname+"/login.html")
})

  

app.listen(3200,function(){console.log("server is running on port 3200")})