import React from 'react';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import $ from 'jquery';

export class Signup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            prenom : "",
            nom : "",
            password: "",
            cpassword: "",
            metier: "",
            age: "",
            errors: []
        }
        this.handleChange.bind(this);
        this.send.bind(this);
    }
    send = event => {
        if(this.state.password !== this.state.cpassword){
            this.setState({success: false, errors: ["Vous n'avez pas rentré deux fois le même mot de passe"]});
            return;
        }
        var token = 0;
        if (localStorage.getItem("session") != null) {
            token = JSON.parse(localStorage.getItem("session")).token;
        }
        $.post(
            'http://'+window.location.hostname+':8000/user/signup.phjs',
            {
                prenom: this.state.prenom,
                nom: this.state.nom,
                metier: this.state.metier,
                age: this.state.age,
                password: this.state.password,
                token: token
            },
    
            (data) => {
                if (data.rep == "success") {
                    this.setState({success: true, errors: []});
                    if (localStorage.getItem("session") != null) {
                        localStorage.removeItem("session");
                    }
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
            <div className="Signup">
                <FormGroup controlId="prenom" bsSize="large">
                <ControlLabel>Prenom</ControlLabel>
                <FormControl autoFocus type="text" value={this.state.prenom} onChange={this.handleChange}/>
                </FormGroup>
                <FormGroup controlId="nom" bsSize="large">
                <ControlLabel>Nom</ControlLabel>
                <FormControl autoFocus type="text" value={this.state.nom} onChange={this.handleChange}/>
                </FormGroup>
                <FormGroup controlId="metier" bsSize="large">
                <ControlLabel>Metier</ControlLabel>
                <FormControl autoFocus type="text" value={this.state.metier} onChange={this.handleChange}/>
                </FormGroup>
                <FormGroup controlId="age" bsSize="large">
                <ControlLabel>Age</ControlLabel>
                <FormControl autoFocus type="text" value={this.state.age} onChange={this.handleChange}/>
                </FormGroup>
                <FormGroup controlId="password" bsSize="large">
                <ControlLabel>Password</ControlLabel>
                <FormControl value={this.state.password} onChange={this.handleChange} type="password"/>
                </FormGroup>
                <FormGroup controlId="cpassword" bsSize="large">
                <ControlLabel>Confirm Password</ControlLabel>
                <FormControl value={this.state.cpassword} onChange={this.handleChange} type="password"/>
                </FormGroup>
                {this.state.success == true && <font color='green' size='4'>Connexion réussi!!</font>}
                {this.state.errors.map((error) => (<div><font size='3' color='red'> - {error}</font><br/></div>))}
                <Button
                onClick={this.send}
                block
                bsSize="large"
                type="submit"
                >
                Inscription
                </Button>
            </div>
        )
    }
}