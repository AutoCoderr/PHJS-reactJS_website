import React from 'react';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import $ from 'jquery';

export class MesJouets extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			jouets: JSON.parse(localStorage.getItem("session")).jouets,
		}
	}

    supprJouet = (i) => {
    	var id = this.state.jouets[i].id;

    	$.post(
            'http://'+window.location.hostname+':8000/jouets/supprJouets.phjs',
            {
               id: id,
               token: JSON.parse(localStorage.getItem("session")).token
            },
    
            (data) => {
                if (data.rep == "success") {
                	this.state.jouets[i].errors = [];
                	this.state.jouets[i].success = true;
                	var session = JSON.parse(localStorage.getItem("session"));
                	session.jouets.splice(i,1);
                	localStorage.setItem("session", JSON.stringify(session));
                	setTimeout( () => { window.location.href = "/mesjouets"; },250);
                } else if (data.rep == "failed") {
                    this.setState({success: false, errors: data.errors, nomJouet: "", descriptionJouet: "", statutJouet: {value: ""}});
                }
            },
            'json'
        );
	}

    render() {
		var isAuth = 0;
		if (localStorage.getItem("session") != null) {
			isAuth = 1;
		}
        return(
		<center className="mesJouets">
		<h1>Mes jouets :</h1>
		<table>
		<tbody>
		{this.state.jouets.length == 0 && (<font size='4' color='orange'>Aucun jouet</font>)}
		{Object.keys(this.state.jouets).map((i, index) => (
			<tr>
				{typeof(this.state.jouets[i].errors) == "undefined" && (this.state.jouets[i].errors = [])}
				{typeof(this.state.jouets[i].success) == "undefined" && (this.state.jouets[i].success = false)}
				<td style={{border: '1pt solid black'}}>
					{this.state.jouets[i].nom}
					<br/>
					<img src={'http://'+window.location.hostname+':8000/imgs/jouets/'+this.state.jouets[i].id+'.jpg'} />
					<br/>
					{this.state.jouets[i].description}
					<br/>
					'{this.state.jouets[i].statut}'
				</td>
				<td>
					<Button 
						onClick={() => this.supprJouet(i)} 
						block 
						bsSize="little"
          				type="submit"
					>
					Supprimer
					</Button>
					{this.state.jouets[i].success === true && (<font color='green' size='3'>Suppression reussi!!</font>)}
				</td>
			</tr>
		))}
		</tbody>
		</table>
        <AddJouet />
		</center>
        )
    }
}

class AddJouet extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			success: false,
			errors: [],
			nomJouet: "",
			descriptionJouet: "",
			statutJouet: {value: ""}
		}
		this.handleChange.bind(this);
        this.addJouet.bind(this);
	}

	handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

	addJouet = () => {
		console.log("start addJouet");
		var nom = this.state.nomJouet;
		var description = this.state.descriptionJouet;
		var statut = this.state.statutJouet.value;
		$.post(
            'http://'+window.location.hostname+':8000/jouets/addJouets.phjs',
            {
               nom: nom,
               description: description,
               statut: statut,
               token: JSON.parse(localStorage.getItem("session")).token
            },
    
            (data) => {
                if (data.rep == "success") {
                    this.setState({success: true, errors: [], nomJouet: "", descriptionJouet: "", statutJouet: {value: ""}});
                    var session = JSON.parse(localStorage.getItem("session"));
                    session.jouets.push(data.jouet);
                    alert(data.jouet);
                    localStorage.setItem("session", JSON.stringify(session));
                    setTimeout( () => { window.location.href = "/mesjouets"; },250);
                } else if (data.rep == "failed") {
                    this.setState({success: false, errors: data.errors, nomJouet: "", descriptionJouet: "", statutJouet: {value: ""}});
                }
            },
            'json'
        );
	}

    render() {
		var isAuth = 0;
		if (localStorage.getItem("session") != null) {
			isAuth = 1;
		}
        return(
		<div className="AddJouet">
		<h2>Ajouter un jouets</h2>
		<FormGroup controlId="nomJouet" bsSize="large">
           <ControlLabel>Nom du jouet</ControlLabel>
           <FormControl autoFocus type="text" value={this.state.nomJouet} onChange={this.handleChange}/>
        </FormGroup>
        <FormGroup controlId="descriptionJouet" bsSize="large">
           <ControlLabel>Description du jouet</ControlLabel>
           <FormControl autoFocus type="text" value={this.state.descriptionJouet} onChange={this.handleChange}/>
        </FormGroup>
        <FormGroup controlId="statutJouet">
          <ControlLabel>Son statut</ControlLabel>
          <FormControl
              inputRef={ el => this.state.statutJouet = el}
              componentClass="select" placeholder="select">
            <option value="">Choisissez</option>
            <option value="public">Public</option>
            <option value="prive">Privé</option>
          </FormControl>
        </FormGroup>
        {this.state.success === true && (<font color='green' size='3'>Ajout reussi!</font>)}
        {this.state.errors.map((error) => (<div><font size='3' color='red'> - {error}</font><br/></div>))}
         <Button
           onClick={this.addJouet}
           block
           bsSize="large"
           type="submit"
          >
           Ajouter
         </Button>
     	</div>
        )
    }

}