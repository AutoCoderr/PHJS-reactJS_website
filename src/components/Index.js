import React from 'react';

export class Index extends React.Component {
    render() {
		var isAuth = 0;
		if (localStorage.getItem("session") != null) {
			isAuth = 1;
		}
        return(
		<div>
		<a href="/login">{isAuth == 1 ? "Deconnexion" : "Connextion"}</a><br/>
		<a href="/signup">Inscription</a><br/>
		{isAuth == 1 && (<a href="/fiche">Fiche</a>)}
		</div>
        )
    }
}