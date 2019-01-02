var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var app = express();
app.set('view engine','ejs');
app.use(cookieParser());
app.use(session({secret: "Shh, its a secret!",resave:false,saveUninitialized:false,cookie:{maxAge:1000000*24*60*60}}));

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));
var db=require('./users-database.js');
const cdb=require('./communities-database');
var validation=require('./checkuser.js');
const fileupload=require('./upload');
 app.get('/login.js', function(req, res){
    res.render('login',{});
 });
 app.post('/checklogin.js', function(req, res){
    db.findUser({email:req.body.email,password:req.body.password},function(result){
        if(result){
            req.session.isLoggedIn=true;
            req.session.email=req.body.email;
            res.redirect('/adminhome');
        }else{
            res.render('login',{});
        }
     })
 });
 app.get('/logout', function(req, res){
     req.session.destroy();
     res.render('login',{});
 });
//admin functions
//form to add a user
app.get('/adduser', function(req, res){
    if(req.session.isLoggedIn){
        res.render('adduser',{str:"welcome"});
    }else{
        res.render('login',{});
    }
    
 });
 //checking username entered by user and giving suggessions
app.get('/checkuser.js/:str', function(req, res){
    if(req.session.isLoggedIn){
        validation.emailValidation(req.params.str,function(result){
            if(result)
            res.send("Username already exists");
            else
            res.send("</br>");
        });
    }else{
        res.render('login',{});
    }
       
    
});
 //when user entered is submitted
app.post('/submit-adduser.js',function(req,res){

    if(req.session.isLoggedIn){
        validation.emailValidation(req.body.email,function(result){
            if(result){
                res.redirect('/adduser');
            }
            validation.passwordValidation(req.body.password,function(result){
    
                if(result){
                   var db=require('./users-database');
                    db.addUser(req.body.email,req.body.password,req.body.phone,req.body.role,function(){
                    var mailer=require('./mail.js');
                    mailer.sendmail('manuduggal9@gmail.com',req.body.password);
                    res.render('adduser',{str:"User successfully added and email is sent to user."});
                    // res.send("success");
                    });
                    
                }else
                res.render('adduser',{str:"Enter a strong password"});
                //res.redirect('/adduser');
               
            });
        });
        
    }else{
        res.render('login',{});
    }
    
});
 
 
 //adminhome
 app.get('/adminhome', function(req, res){

    if(req.session.isLoggedIn){
        db.findUser({},function(result){
            res.render('adminhome',{arr:result});
         })
    }else{
        res.render('login',{});
    }
    
  });

 //admins userslist
 app.get('/userslist', function(req, res){
    if(req.session.isLoggedIn){
        var db=require('./users-database.js');
        db.getUsers(function(result){
         console.log(result);
        res.render('datatable',{arr:result});
       });
    }else{
        res.render('login',{});
       // res.sendFile(__dirname+'/public/login.html');
    }  
    
  });
  //password form
  app.get('/password', function(req, res){
    res.sendFile(__dirname+'/public/changepassword.html');
  });
  app.post('/changepassword',function(req,res){
       if(req.body.password1==req.body.password2){
             db.updateUser(req.session.email,req.body.password1,function(){
                res.sendFile(__dirname+'/public/changepassword.html');
             })
       }
  });

//create community form
app.get('/createcommunity', function(req, res){
    res.render('createcommunity');
});
//saving community in database using upload.js file
app.post('/upload', (req, res) => {
  fileupload.uploadimage(req,res);
});
//communities list
app.get('/communitieslist',function(req,res){
    cdb.getCommunities(function(result){
        console.log(result);
        res.render('communitylist',{arr:result});
  });
});
app.listen(3000);