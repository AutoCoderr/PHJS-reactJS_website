import React from 'react';
import { Login } from './Login.js';
import { Logout } from './Logout.js';

export class LoginOrLogout extends React.Component {
    render() {
		var isAuth = 0;
		if (localStorage.getItem("session") != null) {
			isAuth = 1;
		}
        return(
		<div>
		{isAuth == 0 && (<Login />)}
		{isAuth == 1 && (<Logout />)}
		</div>
        )
    }
}