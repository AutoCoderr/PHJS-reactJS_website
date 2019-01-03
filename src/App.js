import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { LoginOrLogout } from './components/LoginOrLogout.js';
import { Signup } from './components/Signup.js';
import { Fiche } from './components/Fiche.js';
import { Admin } from './components/Admin.js';
import { Index } from './components/Index.js';
//import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from "react-bootstrap";
import { Button, Navbar, Nav, NavItem, NavDropdown, MenuItem } from "reactstrap";
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
				'http://127.0.0.1:8000/user/islogged.phjs',
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
                </Switch>
            </div>
        </div>
        );
    }
}

function Header() {
	var isAuth = 0;
	if (localStorage.getItem("session") != null) {
		isAuth = 1;
	}
	return (
		<nav class="navbar navbar-expand-lg bg-dark navbar-dark">
  			<a class="navbar-brand" title="Sommaire" href="/">
  				<span>Site de merde</span>
  			</a>
  			<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
	    		<span class="navbar-toggler-icon"></span>
  			</button>

  			<div class="collapse navbar-collapse" id="navbarSupportedContent">
    			<ul class="navbar-nav mr-auto">
    				{isAuth == 1 && 
    					(
    					<li className={(window.location.href.split("/")[window.location.href.split("/").length-1] === "fiche") ? "active nav-item" : "nav-item"}>
            				<a class="nav-link" href="/fiche">Fiche</a>
          				</li>
    					)
    				}
    				{(isAuth == 1 && (JSON.parse(localStorage.getItem("session")).perm == "admin" | JSON.parse(localStorage.getItem("session")).perm == "superadmin")) ? (
          				<li className={(window.location.href.split("/")[window.location.href.split("/").length-1] === "admin") ? "active nav-item" : "nav-item"}>
            				<a class="nav-link" href="/admin">Administration</a>
          				</li>
          			) : ""}
            	</ul>
            	<ul class="nav navbar-nav navbar-right">
        			<li className={(window.location.href.split("/")[window.location.href.split("/").length-1] === "signup") ? "active nav-item" : "nav-item"}>
        				<a class="nav-link" href="/signup">
        					<span class="glyphicon glyphicon-user"></span>
        						Inscription
        				</a>
        			</li>

    				<li className={(window.location.href.split("/")[window.location.href.split("/").length-1] === "login") ? "active nav-item" : "nav-item"}><a class="nav-link" href="/login"><span class="glyphicon glyphicon-log-in">
    					</span>{isAuth == 1 ? "Deconnexion" : "Connexion"}</a>
    				</li>
      			</ul>
    		</div>
		</nav>
	)
}

export default App;
