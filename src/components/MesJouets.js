import React from 'react';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import $ from 'jquery';

export class MesJouets extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			jouets: JSON.parse(localStorage.getItem("session")).jouets,
			comptes: undefined
		}
		this.listComptes();
	}

	listComptes = () => {
		$.post(
           'http://'+window.location.hostname+':8000/jouets/getAllJouets.phjs',
           {
                
           },
    
           (data) => {
               if (data.rep == "success") {
               		for (var id in data.comptes) {
               	   		if (data.comptes[id].prenom == JSON.parse(localStorage.getItem("session")).prenom
               	   		  & data.comptes[id].nom == JSON.parse(localStorage.getItem("session")).nom) {
               	   			delete data.comptes[id];
               	   		}
               	    }
                   this.setState({errors: []});
                   console.log("data.comptes : ");
                   console.log(data.comptes);
                   console.log("("+typeof(data.comptes)+")")
                   this.setState({comptes: data.comptes});
               } else if (data.rep == "failed") {
                   this.setState({success: false, errors: data.errors});
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
			<tr key={i} style={{border: '1pt solid black'}}>
				<td style={{textAlign: 'center'}}>
					{this.state.jouets[i].nom}
					<br/>
					<img src={'http://'+window.location.hostname+':8000/imgs/jouets/'+this.state.jouets[i].id+'.jpg'} />
					<br/>
					{this.state.jouets[i].description}
					<br/>
					'{this.state.jouets[i].statut}'
				</td>
				{typeof(this.state.comptes) !== "undefined" && (
					<MenuJouet comptes={this.state.comptes} jouetIndex={i} jouet={this.state.jouets[i]} />
				)}
			</tr>
		))}
		</tbody>
		</table>
        <AddJouet />
		</center>
        )
    }
}
// uioijpokp
class MenuJouet extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			success: false,
			errorsSuppr: [],
      errorsDemand: [],
			jouetsDst: [],
			jouetDst: {value: ""},
			trocCompteDst: {value: ""},
			comptes: props.comptes,
			jouet: props.jouet,
			jouetIndex: props.jouetIndex,
			ready: false
		}
		console.log("props : ");
		console.log(props);
		this.displayJouets.bind(this);
		this.demmandTroc.bind(this);
	}

	displayJouets = () =>  {
		if (this.state.trocCompteDst.value === "") {
			this.setState({jouetsDst: []});
			return;
		}
		var trocCompteDst = this.state.trocCompteDst.value;
		this.setState({jouetsDst: this.state.comptes[trocCompteDst].jouets});
	}

	supprJouet = () => {
    	var id = this.state.jouet.id;

    	$.post(
            'http://'+window.location.hostname+':8000/jouets/supprJouets.phjs',
            {
               idJouet: id,
               token: JSON.parse(localStorage.getItem("session")).token
            },
    
            (data) => {
                if (data.rep == "success") {
                	this.setState({success: true, errorsSuppr: []})
                	var session = JSON.parse(localStorage.getItem("session"));
                	session.jouets.splice(this.state.jouetIndex,1);
                	localStorage.setItem("session", JSON.stringify(session));
                	setTimeout( function() { window.location.href = "/mesjouets"; },250);
                } else if (data.rep == "failed") {
                    this.setState({success: false, errorsSuppr: data.errors});
                }
            },
            'json'
        );
	}

	demmandTroc = () => {
		$.post(
            'http://'+window.location.hostname+':8000/jouets/demandTroc.phjs',
            {
               idJouetDst: this.state.jouetDst.value,
               idCompteDst: this.state.trocCompteDst.value,
               idJouetSrc: this.state.jouet.id,
               token: JSON.parse(localStorage.getItem("session")).token
            },
    
            (data) => {
                if (data.rep == "success") {
                	this.setState({success: true, errorsDemand: []});
                } else if (data.rep == "failed") {
                  this.setState({success: false, errorsDemand: data.errors});
                }
            },
            'json'
        );
	}

	render() {
		return (
			<section>
			<td style={{display: 'block'}}>
				<Button 
					onClick={() => this.supprJouet()} 
					block 
					bsSize="xs"
          			type="submit"
				>
				Supprimer
				</Button>
        {this.state.errorsSuppr.map((error) => (
            <div><font color='red' size='3'>{error}</font><br/></div>
        ))}
				<FormGroup controlId="trocCompteDst">
          	<ControlLabel>Troquer avec : </ControlLabel>
          	<FormControl
          		onChange={() => this.displayJouets()}
           			inputRef={ el => this.state.trocCompteDst = el}
          			componentClass="select" placeholder="select">
           			<option value="">Choisir</option>
        			{Object.keys(this.state.comptes).map((id, index) => (
          			<option key={id} value={id}>{this.state.comptes[id].prenom} {this.state.comptes[id].nom}</option>
        			))}
        		</FormControl>
       	 </FormGroup>
       	 {this.state.jouetsDst.length > 0 && (
       			<FormGroup controlId="jouetDst">
        		  <ControlLabel>Quel jouet : </ControlLabel>
	       	    <FormControl
	       	    	onChange={() => { this.state.jouetDst.value !== "" ? (this.setState({ready: true})) : (this.setState({ready: false}))} }
            		inputRef={ el => this.state.jouetDst = el}
              	componentClass="select" placeholder="select">
              	<option value="">Choisir</option>
            		{this.state.jouetsDst.map((jouet) => (
	            		<option key={jouet.id} value={jouet.id}>{jouet.nom}</option>
	            	))}
          		</FormControl>
          		</FormGroup>
       		)}
       			 {this.state.ready === true && (
              <div>
       			 	<Button 
					     onClick={this.demmandTroc} 
					     block 
					     bsSize="xs"
          			type="submit"
					     >
					     Demander
					   </Button>
             {this.state.errorsDemand.map((error) => (
              <div><font color='red' size='3'>{error}</font><br/></div>
              ))}
             </div>
       			 )}
			</td>
			</section>
		)
	}
}
// yfugiohjpihou

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