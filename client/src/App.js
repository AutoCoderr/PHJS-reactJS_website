import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { LoginOrLogout } from './components/LoginOrLogout.js';
import { Signup } from './components/Signup.js';
import { Fiche } from './components/Fiche.js';
import { Admin } from './components/Admin.js';
import { Index } from './components/Index.js';
import { MesJouets } from './components/MesJouets.js';
import { Demands } from './components/Demands.js';
import { Messages } from './components/Messages.js';
//import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from "react-bootstrap";
//import { Button, Navbar, Nav, NavItem, NavDropdown, MenuItem } from "reactstrap";
import $ from 'jquery';
import './App.css';

class App extends Component {
    render() {
		var isAuth = 0;
		if (localStorage.getItem("session") != null) {
			isAuth = 1;
		}
		if (isAuth == 1) {
			$.post(
				'http://'+window.location.hostname+':8000/user/islogged.phjs',
				{
					token: JSON.parse(localStorage.getItem("session")).token
				},
	
				(data) => {
					if (data.rep == "success") {
						if (data.logged == "no") {
							localStorage.removeItem("session");
							setTimeout(function () {
								window.location = "/login";
							},250);
						}
					}
				},
				'json'
			);
		}
        return (
        <div className="App">
        	<Header />
        	<br/>
        	<br/>
            <div className="App-content">
                <Switch>
					<Route exact path="/" component={Index}/>
                    <Route exact path="/login" component={LoginOrLogout}/>
                    <Route exact path ="/signup" component={Signup} />
                    <Route exact path ="/fiche" component={Fiche} />
                    <Route exact path ="/admin" component={Admin} />
                    <Route exact path ="/mesjouets" component={MesJouets} />
                    <Route exact path ="/demands" component={Demands} />
                    <Route exact path ="/messages" component={Messages} />
                </Switch>
            </div>
        </div>
        );
    }
}
// iuhoi

class Header extends Component {
	constructor(props) {
		super(props);
		this.state = {
			countDemandTroc: 0
		}
		this.countDemandTroc.bind(this);
		this.countDemandTroc();
	}

	countDemandTroc = () => {
		if (localStorage.getItem("session") != null) {
			$.post(
				'http://'+window.location.hostname+':8000/troc/countDemandTroc.phjs',
				{
					token: JSON.parse(localStorage.getItem("session")).token
				},
		
				(data) => {
					if (data.rep == "success") {
						this.setState({countDemandTroc: data.count});
					}
				},
				'json'
			);
		}

	}

	render() {
		var isAuth = 0;
		if (localStorage.getItem("session") != null) {
			isAuth = 1;
		}
		return (
			<nav className="navbar navbar-expand-lg bg-dark navbar-dark">
	  			<a className="navbar-brand" title="Sommaire" href="/">
	  				<span>Site de merde</span>
	  			</a>
	  			<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
		    		<span className="navbar-toggler-icon"></span>
	  			</button>

	  			<div className="collapse navbar-collapse" id="navbarSupportedContent">
	    		<ul className="navbar-nav mr-auto">
	            	
	            	{isAuth == 1 && (
	              	<li className={(window.location.href.split("/")[window.location.href.split("/").length-1] === "mesjouets") ? "active nav-item" : "nav-item"}>
	                    	<a className="nav-link" href="/mesjouets">Mes jouets</a>
	              	</li>
	              	)}
	            	
	            	{isAuth == 1 && (
	              	<li className={(window.location.href.split("/")[window.location.href.split("/").length-1] === "fiche") ? "active nav-item" : "nav-item"}>
	                    	<a className="nav-link" href="/fiche">Fiche</a>
	              	</li>
		            )}
	    		
	    			{(isAuth == 1 && (JSON.parse(localStorage.getItem("session")).perm == "admin" | JSON.parse(localStorage.getItem("session")).perm == "superadmin")) ? (
	          		<li className={(window.location.href.split("/")[window.location.href.split("/").length-1] === "admin") ? "active nav-item" : "nav-item"}>
	           			<a className="nav-link" href="/admin">Administration</a>
	          		</li>
	          		) : ""}

	    			{isAuth == 1 && (
	              	<li className={(window.location.href.split("/")[window.location.href.split("/").length-1] === "demands") ? "active nav-item" : "nav-item"}>
	                    	<a className="nav-link" href="/demands">Demandes de troc {this.state.countDemandTroc > 0 && (<span>({this.state.countDemandTroc})</span>)}</a>
	              	</li>
		            )}

	            </ul>
	            <ul className="nav navbar-nav navbar-right">
	            	 {isAuth === 1 && (
	            	 	<li className={(window.location.href.split("/")[window.location.href.split("/").length-1] === "messages") ? "active nav-item" : "nav-item"}>
    				 		<a className="nav-link" href="/messages"><span className="glyphicon glyphicon-log-in">
    							</span>Messages privés</a>
    				 	</li>
	            	 )}
	        		 <li className={(window.location.href.split("/")[window.location.href.split("/").length-1] === "signup") ? "active nav-item" : "nav-item"}>
	        			<a className="nav-link" href="/signup">
	        				<span className="glyphicon glyphicon-user"></span>
	        					Inscription
	        			</a>
	        		 </li>

    				 <li className={(window.location.href.split("/")[window.location.href.split("/").length-1] === "login") ? "active nav-item" : "nav-item"}>
    				 	<a className="nav-link" href="/login"><span className="glyphicon glyphicon-log-in">
    						</span>{isAuth == 1 ? "Deconnexion" : "Connexion"}</a>
    				 </li>
      			 </ul>
	    		</div>
			</nav>
		)
	}
	

}

export default App;
