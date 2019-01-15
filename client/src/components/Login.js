import React from 'react';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import $ from 'jquery';

export class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            prenom: "",
            nom: "",
            password: "",
            errors: [],
			success: false
        }
        this.handleChange.bind(this);
        this.send.bind(this);
    }
    send = event => {
		$.post(
			'http://'+window.location.hostname+':8000/user/login.phjs',
			{
				prenom: this.state.prenom,
                nom: this.state.nom,
				password: this.state.password
			},
	
			(data) => {
				if (data.rep == "success") {
					this.setState({success: true, errors: []});
					localStorage.setItem("session", JSON.stringify(data.infos));
					setTimeout(function () {
						window.location = "/";
					},250);
				} else if (data.rep == "failed") {
                    this.setState({success: false, errors: data.errors});
				}
			},
			'json'
		);
    }    
    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }
    render() {
        return(
            <div className="Login">

                <FormGroup controlId="prenom" bsSize="large">
                <ControlLabel>Prenom</ControlLabel>
                <FormControl autoFocus type="text" value={this.state.prenom} onChange={this.handleChange}/>
                </FormGroup>

                <FormGroup controlId="nom" bsSize="large">
                <ControlLabel>Nom</ControlLabel>
                <FormControl autoFocus type="text" value={this.state.nom} onChange={this.handleChange}/>
                </FormGroup>

                <FormGroup controlId="password" bsSize="large">
                <ControlLabel>Password</ControlLabel>
                <FormControl value={this.state.password} onChange={this.handleChange} type="password"/>
                </FormGroup>
				{this.state.success == true && <font color='green' size='4'>Connexion réussi!!</font>}
                {this.state.errors.map((error) => <div><font size='3' color='red'> - {error}</font><br/></div>)}
                <Button
                onClick={this.send}
                block
                bsSize="large"
                type="submit"
                >
                Connexion
                </Button>
            </div>
        )
    }
}