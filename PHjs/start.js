var PHjs = require("./PHjs");

var libs = {};

libs.isConnect = (sessions,token) => {
	for (var i=0;i<sessions.length;i++) {
		if (sessions[i].token == token) {
			return true;
		}
	}
	return false;
}

PHjs("/root/projects/node+react/backend/","http",8000,{},libs,"/root/projects/node+react/master/PHjs/access.log","/root/projects/node+react/master/PHjs/error.log","/root/projects/node+react/master/PHjs/config.txt");
