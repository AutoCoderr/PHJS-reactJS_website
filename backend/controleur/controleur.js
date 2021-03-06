function Controleur() {

  this.Modele = require(__dirname+"/../modele/modele.js");
  this.modele = new this.Modele("jsProject","127.0.0.1","27017");
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
            delete result.jouets;
            delete result.MPs;
            delete result.MSs;
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
          this.modele.insertInto("users",{prenom: prenom, nom: nom, perm: perm, metier: metier, age: age, datetime: curDateTime, passwd: sha1Passwd, MPs: [], MSs: [], jouets: [], banned: 0},(error,result) => {
            if (error) {
              callback(error);
            } else {
              this.modele.getFrom("users",{prenom: prenom, nom: nom},(error,result) => {
                result = result[0];
                delete result.passwd;
                delete result.banned;
                delete result.jouets;
                delete result.MPs;
                delete result.MSs;
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

  this.addJouet = (id,nom,description,statut,imagePath,callback) => {
    this.modele.getFrom("users",{_id: id}, (error,result) => {
      if (error) {
        callback(error);
      } else {
        if (result.length == 0) {
          callback("Votre session n'a pas été trouvée dans la base de données");
        } else {
          var jouets = result[0].jouets;

          var idJouet = result[0].jouets.length+1;

          var newJouet = {id: idJouet, nom: nom, description: description, statut: statut};

          jouets.push(newJouet);

          this.modele.update("users",{_id: id},{$set: {jouets: jouets}}, (error,result) => {
            if (error) {
              callback(error);
            } else {
              var shell = require("shelljs");
              var out = shell.exec("mv "+imagePath+" /root/projects/node+react/backend/imgs/jouets/"+id+"-"+idJouet+".jpg");
              if (out.stderr != "") {
                callback(out.stderr);
              } else {
                callback(null,"OK");
              }
            }
          });
        }
      }
    });
  }

  this.supprJouet = (idUser,idJouet,callback) => {
    this.modele.getFrom("users",{_id: idUser}, (error,result) => {
      if (error) {
        callback(error);
      } else {
        if (result.length == 0) {
          callback("Votre session n'a pas été trouvée dans la base de données");
        } else {
          var jouets = result[0].jouets;

          var deleted = false;

          for (var i=0;i<jouets.length;i++) {
            if (jouets[i].id == idJouet) {
              jouets.splice(i,1);
              deleted = true;
            }
          }
          if (deleted === false) {
            callback("Ce jouet n'a pas été trouvé");
          } else {
            this.modele.update("users",{_id: idUser},{$set: {jouets: jouets}}, (error,result) => {
              if (error) {
                callback(error);
              } else {
                var shell = require("shelljs");
                var out = shell.exec("rm /root/projects/node+react/backend/imgs/jouets/"+idUser+"-"+idJouet+".jpg");
                if (out.stderr != "") {
                  callback(out.stderr);
                } else {
                  callback(null,"OK");
                }
              }
            });
          }
        }
      }
    });
  }

  this.demandTroc = (idCompteSrc,idJouetSrc,idCompteDst,idJouetDst,callback) => {
    this.modele.getFrom("users",{_id: idCompteDst}, (error,result) => {
      if (error) {
        callback(error);
      } else {
        if (result.length == 0) {
          callback("Ce compte n'existe pas");
        } else {
          var public = false;
          var jouets = result[0].jouets;
          for (var i=0;i<jouets.length;i++) {
            if (jouets[i].id == idJouetDst & jouets[i].statut == "public") {
              public = true;
            }
          }
          if (public == false) {
            callback("Ce jouet n'existe pas ou n'est pas public");
          } else {
            this.modele.insertInto("demandTrocs",{idCompteSrc: idCompteSrc, idJouetSrc: idJouetSrc, idCompteDst: idCompteDst, idJouetDst: idJouetDst}, (error,result) => {
              if (error) {
                callback(error);
              } else {
                callback(null,"OK");
              }
            });
          }
        }
      }
    });
  }

  this.countDemandTroc = (id,callback) => {
    this.modele.getFrom("demandTrocs",{idCompteDst: id}, (error,result) => {
      if (error) {
        callback(error);
      } else {
        callback(null,result.length);
      }
    });
  }

  this.getDemandTroc = (id,callback) => {
    this.modele.getFrom("demandTrocs",{idCompteDst: id}, (error,resultDemands) => {
      if (error) {
        callback(error);
      } else {
        this.modele.getFrom("users",{}, (error,resultComptes) => {
          if (error) {
            callback(error);
          } else {
            var prenomSrc;
            var nomSrc;

            var jouetsSrc;
            var jouetSrc;

            var jouetsDst;
            var jouetDst;

            var demands = [];
            for (var i=0;i<resultDemands.length;i++) {
              prenomSrc = "";
              nomSrc = ""
              jouetSrc = "";
              jouetDst = "";
              for (var j=0;j<resultComptes.length;j++) {
                if (resultComptes[j]._id == resultDemands[i].idCompteSrc) {
                  prenomSrc = resultComptes[j].prenom;
                  nomSrc = resultComptes[j].nom;
                  jouetsSrc = resultComptes[j].jouets;
                  for (var k=0;k<jouetsSrc.length;k++) {
                    if (jouetsSrc[k].id == resultDemands[i].idJouetSrc) {
                      jouetSrc = jouetsSrc[k].nom;
                    }
                  }
                } else if (resultComptes[j]._id == resultDemands[i].idCompteDst) {
                  jouetsDst = resultComptes[j].jouets;
                  for (var k=0;k<jouetsDst.length;k++) {
                    if (jouetsDst[k].id == resultDemands[i].idJouetDst) {
                      jouetDst = jouetsDst[k].nom;
                    }
                  }
                }
              }
              demands.push({id: resultDemands[i]._id, prenomSrc: prenomSrc, nomSrc: nomSrc, jouetSrc: jouetSrc, jouetDst: jouetDst});
            }
            callback(null,demands);
          }
        })
      }
    });
  }

  this.supprDemandTroc = (id,idDemand,callback) => {
    this.modele.getFrom("demandTrocs",{_id: idDemand, idCompteDst: id}, (error,result) => {
      if (error) {
        callback(error);
      } else {
        if (result.length == 0) {
          callback("Cette de demande de troc n'existe pas \nou bien elle ne vous ait pas adréssée.");
        } else {
          this.modele.deleteFrom("demandTrocs",{_id: idDemand, idCompteDst: id}, (error,result) => {
            if (error) {
              callback(error);
            } else {
              callback(null,"OK");
            }
          });
        }
      }
    });
  }

  this.getOwnJouet = (id,callback) => {
    this.modele.getFrom("users",{_id: id}, (error,result) => {
      if (error) {
        callback(error);
      } else {
        if (result.length == 0) {
          callback("Votre compte n'a pas été trouvé");
        } else {
          callback(null,result[0].jouets);
        }
      }
    });
  }

  this.acceptDemandTroc = (id,idDemand,callback) => {
    this.modele.getFrom("demandTrocs",{_id: idDemand, idCompteDst: id}, (error,resultDemands) => {
      if (error) {
        callback(error);
      } else {
        if (resultDemands.length == 0) {
          callback("Cette de demande de troc n'existe pas \nou bien elle ne vous ait pas adréssée.");
        } else {
          this.modele.getFrom("users",{}, (error,resultComptes) => {
            if (error) {
              callback(error);
            } else {
              var demand = resultDemands[0];
              var jouetsSrc;
              var jouetSrc;
              var jouetsDst;
              var jouetDst;

              for(var i=0;i<resultComptes.length;i++) {
                if (resultComptes[i]._id == demand.idCompteSrc) {
                  jouetsSrc = resultComptes[i].jouets;
                } else if (resultComptes[i]._id == demand.idCompteDst) {
                  jouetsDst = resultComptes[i].jouets;
                }
              }
              for (var i=0;i<jouetsSrc.length;i++) {
                if (jouetsSrc[i].id == demand.idJouetSrc) {
                  jouetSrc = jouetsSrc[i];
                  jouetsSrc.splice(i,1);
                }
              }
              for (var i=0;i<jouetsDst.length;i++) {
                if (jouetsDst[i].id == demand.idJouetDst) {
                  jouetDst = jouetsDst[i];
                  jouetsDst.splice(i,1);
                }
              }
              jouetsSrc.push(jouetDst);
              jouetsDst.push(jouetSrc);
              this.modele.update("users",{_id: demand.idCompteDst},{$set: {jouets: jouetsDst}}, (error,result) => {
                if (error) {
                  callback(error);
                } else {
                  this.modele.update("users",{_id: demand.idCompteSrc},{$set: {jouets: jouetsSrc}}, (error,result) => {
                    if (error) {
                      callback(error);
                    } else {
                      this.modele.deleteFrom("demandTrocs",{_id: idDemand, idCompteDst: id}, (error,result) => { 
                        if (error) {
                          callback(error);
                        } else {
                          var shell = require("shelljs");

                          var tmpname = Math.round(Math.random()*Math.pow(10,5));

                          var out;

                          out = shell.exec("mv /root/projects/node+react/backend/imgs/jouets/"+demand.idCompteSrc+"-"+demand.idJouetSrc+".jpg /root/projects/node+react/backend/imgs/jouets/"+tmpname+".jpg");
                          if (out.stderr != "") {
                            callback(out.stderr);
                            return;
                          }

                          out = shell.exec("mv /root/projects/node+react/backend/imgs/jouets/"+demand.idCompteDst+"-"+demand.idJouetDst+".jpg /root/projects/node+react/backend/imgs/jouets/"+demand.idCompteSrc+"-"+demand.idJouetDst+".jpg");
                          if (out.stderr != "") {
                            callback(out.stderr);
                            return;
                          }

                          out = shell.exec("mv /root/projects/node+react/backend/imgs/jouets/"+tmpname+".jpg /root/projects/node+react/backend/imgs/jouets/"+demand.idCompteDst+"-"+demand.idJouetSrc+".jpg");
                          if (out.stderr != "") {
                            callback(out.stderr);
                            return;
                          }
                          callback(null,"OK");
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      }
    });
  }

  this.getMessages = (id,callback) => {
    this.modele.getFrom("users",{_id: id}, (error,result) => {
      if (error) {
        callback(error);
      } else {
        if (result.length == 0) {
          callback("votre compte n'a pas été trouvé");
        } else {
          result = result[0];
          callback(null,{MPs: result.MPs, MSs: result.MSs});
        }
      }
    });
  }

  this.sendMessage = (id,dst,objet,content,callback) => {
    this.modele.getFrom("users",{_id: id},(error,resultSrc) => {
      if (error) {
        callback(error);
      } else {
        if (resultSrc.length == 0) {
          callback("Votre compte n'a pas été trouvé");
        } else {
          resultSrc = resultSrc[0];
          this.modele.getFrom("users",{_id: dst},(error,resultDst) => {
            if (error) {
              callback(error);
            } else {
              if (resultDst.length == 0) {
                callback("Le compte de destination n'a pas été trouvé");
              } else {

                resultDst = resultDst[0];
                var date = new Date();
                var curDateTime = (1900+date.getYear())+"/"+(date.getMonth()+1)+"/"+date.getDate()+" "+date.getHours()+":"+date.getMinutes();
                resultSrc.MSs.push({id: resultSrc.MSs.length+1, dst: dst, prenom: resultDst.prenom, nom: resultDst.nom, objet: objet, content: content, datetime: curDateTime});
                resultDst.MPs.push({id: resultDst.MPs.length+1, src: id, prenom: resultSrc.prenom, nom: resultSrc.nom, objet: objet, content: content, datetime: curDateTime});
                this.modele.update("users",{_id: id},{$set: {MSs: resultSrc.MSs}}, (error,result) => {
                  if (error) {
                    callback(error);
                  } else {
                    this.modele.update("users",{_id: dst},{$set: {MPs: resultDst.MPs}}, (error,result) => {
                      if (error) {
                        callback(error);
                      } else {
                        callback(null,"OK");
                      }
                    });
                  }
                });
              }
            }
          });
        }
      }
    });
  }

  this.supprMessage = (id,idMsg,type,callback) => {
    this.modele.getFrom("users",{_id: id},(error,result) => {
      if (error) {
        callback(error);
      } else {
        if (result.length == 0) {
          callback("Votre compte n'a pas été trouvé");
        } else {
          result = result[0];
          var deleted = false;
          if (type == "MP") {
            for (var i=0;i<result.MPs.length;i++) {
              if (result.MPs[i].id == idMsg) {
                result.MPs.splice(i,1);
                deleted = true;
              }
            }
          } else if (type == "MS") {
            for (var i=0;i<result.MSs.length;i++) {
              if (result.MSs[i].id == idMsg) {
                result.MSs.splice(i,1);
                deleted = true;
              }
            }
          }
          if (deleted === false) {
            callback("Jouet non trouvé");
          } else {
            if (type == "MP") {
              this.modele.update("users",{_id: id},{$set: {MPs: result.MPs}},(error, result) => {
                if (error) {
                  callback(error);
                } else {
                  callback(null,"OK");
                }
              });
            } else if (type == "MS") {
              this.modele.update("users",{_id: id},{$set: {MSs: result.MSs}},(error, result) => {
                if (error) {
                  callback(error);
                } else {
                  callback(null,"OK");
                }
              });
            }
          }
        }
      }
    });
  }

  this.getComptes = (id,callback) => {
    this.modele.getFrom("users",{},(error,result) => {
      if (error) {
        callback(error);
      } else {
        var comptes = [];
        for (var i=0;i<result.length;i++) {
          if (result[i]._id != id) {
            comptes.push({id: result[i]._id, prenom: result[i].prenom, nom: result[i].nom});
          }
        }
        callback(null,comptes);
      }
    });
  }

};



module.exports = Controleur;