var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
module.exports = {
 addUser:function(email,password,phone,role){

    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
     var dbo = db.db("communityproject");
      var myobj = { email:email,password:password,phone:phone,status:"pending",role:role,};
      dbo.collection("users").insertOne(myobj, function(err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      db.close();
    });
  });
 },
  getUsers:function (callback){
     MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("communityproject");
    dbo.collection("users").find({}).toArray(function(err, result) {
      if (err) throw err;
      db.close();
      callback(result);
    });
     });
  }

}

