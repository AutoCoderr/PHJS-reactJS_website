function Modele(db,server,port) {
  this.MongoClient = require("mongodb").MongoClient;
  this.db = db;
  this.server = server;
  this.port = port;
  this.getFrom = (collection,conditions,callback) => {
  	this.MongoClient.connect("mongodb://"+this.server+":"+this.port+"/"+this.db, function(error, db) {
		if (error) {
			callback(error);
		} else {
			db.db(this.db).collection(collection).find(conditions).toArray(function (err,result) {
				if (err) {
					callback(err);
				} else {
					callback(null,result);
				}
				
				db.close();
			});
		}
	});
  };
  this.insertInto = (collection,obj,callback) => {
  	this.MongoClient.connect("mongodb://"+this.server+":"+this.port+"/"+this.db, function(error, db) {
  		if (error) {
			callback(error);
		} else {
			if (typeof(obj._id) == "undefined") {
				var ObjectID = require('mongodb').ObjectID;
				obj._id = new ObjectID();
				obj._id = obj._id.toString();
			}
			db.db(this.db).collection(collection).insertOne(obj, function(err, res) {
    			if (err) {
    				callback(err);
    			} else {
    				callback(null,res);
    			}
    			db.close();
  			});
		}
	});
  };
  this.deleteFrom = (collection,conditions,callback) => {
  	this.MongoClient.connect("mongodb://"+this.server+":"+this.port+"/"+this.db, function(error, db) {
  		if (error) {
			callback(error);
		} else {
			db.db(this.db).collection(collection).deleteOne(conditions, function(err, res) {
    			if (err) {
    				callback(err);
    			} else {
    				callback(null,res);
    			}
    			db.close();
  			});
		}
	});
  };
  this.update = (collection,conditions,changes,callback) => {
  	this.MongoClient.connect("mongodb://"+this.server+":"+this.port+"/"+this.db, function(error, db) {
  		if (error) {
			callback(error);
		} else {
			db.db(this.db).collection(collection).updateOne(conditions, changes, function(err, res) {
    			if (err) {
    				callback(err);
    			} else {
    				callback(null,res);
    			}
    			db.close();
  			});
		}
	});
  };
};

module.exports = Modele;