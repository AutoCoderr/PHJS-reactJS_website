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

PHjs("/root/projects/node+react/tous/backend","http",8000,{},libs,"/root/projects/node+react/tous/access.log","/root/projects/node+react/tous/error.log","/root/projects/node+react/tous/config.txt");
