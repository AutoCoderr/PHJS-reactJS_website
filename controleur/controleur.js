function Controleur() {

  this.Modele = require(__dirname+"/../modele/modele.js");

  this.modele = new this.Modele("db","127.0.0.1","27017");

  this.login = (prenom,nom,passwd,callback) => {

    var crypto = require("crypto");

    var sha1 = crypto.createHash("sha1");

    sha1.update(passwd);

    var sha1Passwd = sha1.digest("hex");

    this.modele.getFrom("users",{prenom: prenom, nom: nom, passwd: sha1Passwd},(error,result) => {

      if (error) {

        callback(error);

      } else {

        if (result.length > 0) {

          if (result[0].banned == 1) {

            callback(null,'banned');

          } else {

            result = result[0]

            delete result.passwd;

            delete result.banned;

            result.token = Math.round(1+Math.random()*(Math.pow(10,12)-1));

            callback(null,result);

          }

        } else {

          callback(null,'NO');

        }

      }

    });

  };

  this.signUp = (prenom,nom,passwd,metier,age,perm,callback) => {

    this.modele.getFrom("users",{prenom: prenom, nom: nom},(error,result) => {

      if (error != null) {

        callback(error);

      } else {

        if (result.length > 0) {

          callback(null,"ALREADY_EXIST");

        } else {

          var crypto = require("crypto");

          var sha1 = crypto.createHash("sha1");

          sha1.update(passwd);

          var sha1Passwd = sha1.digest("hex");

          var date = new Date();

          var curDateTime = (1900+date.getYear())+"/"+(date.getMonth()+1)+"/"+date.getDate()+" "+date.getHours()+":"+date.getMinutes();

          this.modele.insertInto("users",{prenom: prenom, nom: nom, perm: perm, metier: metier, age: age, datetime: curDateTime, passwd: sha1Passwd, jouets: [], banned: 0},(error,result) => {

            if (error) {

              callback(error);

            } else {

              this.modele.getFrom("users",{prenom: prenom, nom: nom},(error,result) => {

                result = result[0];

                delete result.passwd;

                delete result.banned;

                result.token = Math.round(1+Math.random()*(Math.pow(10,12)-1));

                callback(null,result);

              });

            }

          });

        }

      }

    });

  }

  this.getOtherFiches = (_id,callback) => {

    this.modele.getFrom("users",{},(error,result) => {

      if (error) {

        callback(error);

      } else {

        var comptes = {};

        for (var i=0;i<result.length;i++) {

          if (result[i]._id != _id & result[i].perm != "superadmin") {

            comptes[result[i]._id] = {prenom: result[i].prenom, nom: result[i].nom, perm: result[i].perm, metier: result[i].metier, age: result[i].age, datetime: result[i].datetime, banned: result[i].banned, errors: []};

          }

        }

        callback(null,comptes);

      }

    });

  }

  this.banUnban = (toSet,id,callback) => {

    this.modele.update("users",{_id: id},{$set: {banned: parseInt(toSet)}}, (error,result) => {

      if (error) {

        callback(error);

      } else {

        callback(null,'OK');

      }

    });

  }

  this.changePasswd = (id,password,callback) => {

    var crypto = require("crypto");

    var sha1 = crypto.createHash("sha1");

    sha1.update(password);

    var sha1Passwd = sha1.digest("hex");

    this.modele.update("users",{_id: id},{$set: {passwd: sha1Passwd}}, (error,result) => {

      if (error) {

        callback(error);

      } else {

        callback(null,'OK');

      }

    });

  }

  this.getAllJouets = (callback) => {
    this.modele.getFrom("users",{}, (error,result) => {
      if (error) {
        callback(error);
      } else {
        var comptes = {};
        var jouets;
        for (var i=0;i<result.length;i++) {
          jouets = [];
          for (var j=0;j<result[i].jouets.length;j++) {
            if (result[i].jouets[j].statut == "public") {
              jouets.push({id: result[i].jouets[j].id, nom: result[i].jouets[j].nom, description: result[i].jouets[j].description})
            }
          }
          comptes[result[i]._id] = {prenom: result[i].prenom, nom: result[i].nom, jouets: jouets}
        }
        callback(null,comptes);
      }
    });
  }

  this.addJouet = (id,nom,description,statut,callback) => {
    this.modele.getFrom("users",{_id: id}, (error,result) => {
      if (error) {
        callback(error);
      } else {
        if (result.length == 0) {
          callback("Votre session n'a pas été trouvée dans la base de données");
        } else {
          var jouets = result[0].jouets;

          var ObjectID = require('mongodb').ObjectID;
          var idJouet = new ObjectID();
          idJouet = idJouet.toString();

          var newJouet = {id: idJouet, nom: nom, description: description, statut: statut};

          jouets.push(newJouet);

          this.modele.update("users",{_id: id},{$set: {jouets: jouets}}, (error,result) => {
            if (error) {
              callback(error);
            } else {
              callback(null,newJouet);
            }
          });
        }
      }
    });
  }

};



module.exports = Controleur;