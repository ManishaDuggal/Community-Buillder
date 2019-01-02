var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
module.exports = {
 addCommunity:function(name,description,fpath,permission,callback){

    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
     var dbo = db.db("communityproject");
      var myobj = { name:name,description:description,path:fpath,permission:permission,noofusers:0,status:"active"};
      dbo.collection("communities").insertOne(myobj, function(err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      db.close();
      callback();
    });
  });
 },
  getCommunities:function (callback){
     MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("communityproject");
    dbo.collection("communities").find({}).toArray(function(err, result) {
      if (err) throw err;
      db.close();
      callback(result);
    });
     });
  },
  findCommunity:function(obj,callback){
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("communityproject");
        //Find the first document in the users collection:
        dbo.collection("communities").findOne(obj, function(err, result) {
          if (err) throw err;
          callback(result);
          db.close();
        });
      });
      
},
updateCommunity:function(email,newvalue,callback){
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("communityproject");
    var myquery = { email: email};
    var newvalues = {$set: {password: newvalue} };
    dbo.collection("users").updateOne(myquery, newvalues, function(err, res) {
      if (err) throw err;
      console.log("1 document updated");
      db.close();
      callback();
    });
  });
},

}

