function Modele(db,server,port) {

  this.MongoClient = require("mongodb").MongoClient;

  this.db = db;

  this.server = server;

  this.port = port;

  this.getFrom = (collection,conditions,callback) => {

  	this.MongoClient.connect("mongodb://"+this.server+":"+this.port+"/"+this.db, (error, db) => {

		if (error) {

			callback(error);

		} else {

			db.db(this.db).collection(collection).find(conditions).toArray((err,result) => {

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
  	this.MongoClient.connect("mongodb://"+this.server+":"+this.port+"/"+this.db, (error, db) => {
  		if (error) {
        callback(error);
      } else {
  			var nb = 0;
        this.getFrom(collection,{}, (error,result) => {
          if (error) {
            callback(error);
          } else {
            nb = result.length;
            obj._id = nb+1;
            console.log(obj);
            db.db(this.db).collection(collection).insertOne(obj, (err, res) => {
                if (err) {
                  callback(err);
                } else {
                  callback(null,res);
                }
                db.close();
            });
          }
        });
		  }
	 });
  };

  this.deleteFrom = (collection,conditions,callback) => {

  	this.MongoClient.connect("mongodb://"+this.server+":"+this.port+"/"+this.db, (error, db) => {

  		if (error) {

			callback(error);

		} else {

			db.db(this.db).collection(collection).deleteOne(conditions,(err, res) =>{

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

  	this.MongoClient.connect("mongodb://"+this.server+":"+this.port+"/"+this.db, (error, db) => {

  		if (error) {

			callback(error);

		} else {

			db.db(this.db).collection(collection).updateOne(conditions, changes, (err, res) => {

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