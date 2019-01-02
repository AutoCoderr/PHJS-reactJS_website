import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { LoginOrLogout } from './components/LoginOrLogout.js';
import { Signup } from './components/Signup.js';
import { Fiche } from './components/Fiche.js';
import { Index } from './components/Index.js';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from "react-bootstrap";
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
	/*return (
		<div style={{position: 'fixed'},{top: '0px'}} id="header">
			<center>
			<a href="/">Racine</a>-<a href="/login">{isAuth == 1 ? "Deconnexion" : "Connexion"}</a>-<a href="/signup">Incription</a>
			{isAuth == 1 && (<span>-<a href="/fiche" >Fiche</a></span>)}
			</center>
		</div>
	)*/

	/*return (
		<Navbar>
  			<Navbar.Header>
    			<Navbar.Brand>
      			<a href="/">Site de merde</a>
    			</Navbar.Brand>
  			</Navbar.Header>
  			<Nav pullRight>
    			<NavItem eventKey={1} href="/login">
      				{isAuth == 1 ? "Deconnexion" : "Connexion"}
    			</NavItem>
    			<NavItem eventKey={2} href="/signup">
      				Incription
    			</NavItem>
    			{isAuth == 1 && (
    			<NavItem eventKey={2} href="/fiche">
      				Fiche
    			</NavItem>
    			)}
  			</Nav>
		</Navbar>
	)*/
	return (
		<nav class="navbar navbar-expand-lg bg-dark navbar-dark">
  			<a class="navbar-brand" title="Sommaire" href="/sommaire.php"><img style={{float: "left"},{marginRight: "10px"},{width: "25px"},{height:"25px"}} src="/img/logo.png" /><span>Castellane-Auto</span></a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>

  <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <ul class="navbar-nav mr-auto">
          <li class="nav-item" id="presentationli">
            <a class="nav-link" href="/index.php">Présentation</a>
          </li>
          <li class="nav-item" id="tarifli">
            <a class="nav-link" href="/tarif.php">Tarif</a>
          </li>
          <li class="nav-item" id="contactli">
			<a class="nav-link" href="/contact.php">Contacts</a>
          </li>
            </ul>
            <ul class="nav navbar-nav navbar-right">
        <li class="nav-item" id="registerli"><a class="nav-link" href="/register.php"><span class="glyphicon glyphicon-user"></span>Inscription</a></li>
    <li class="nav-item" id="loginli"><a class="nav-link" href="/login.php"><span class="glyphicon glyphicon-log-in"></span>connexion</a></li>
      </ul>
    </div>
</nav>
	)
}

export default App;
