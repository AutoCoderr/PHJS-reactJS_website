import React from 'react';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import $ from 'jquery';

export class Fiche extends React.Component {
    constructor(props) {
        super(props);
    }
    ifIsNotLogged() {
        window.alert("Vous n'êtes pas connecté");
        window.location = document.referrer;
    }
    render() {
        var isAuth = 0;
        if (localStorage.getItem("session") != null) {
            isAuth = 1;
        }
        return(
            <div className="FicheIndex">
                {isAuth == 0 ? this.ifIsNotLogged() : (<OwnFiche />)}
            </div>
        )
    }
}

class OwnFiche extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
        <div className="OwnFiche">
            Vos informations : 
            <br/><br/>
            <center><table><tbody>
                <tr>
                    <td>
                        Prénom et nom : 
                    </td>
                    <td>
                        {JSON.parse(localStorage.getItem("session")).prenom} {JSON.parse(localStorage.getItem("session")).nom}
                    </td>
                </tr>
                <tr>
                    <td>
                        Permissions : 
                    </td>
                    <td>
                        '{JSON.parse(localStorage.getItem("session")).perm}'
                    </td>
                </tr>
                <tr>
                    <td>
                        Metier : 
                    </td>
                    <td>
                        {JSON.parse(localStorage.getItem("session")).metier}
                    </td>
                </tr>
                <tr>
                    <td>
                        Age : 
                    </td>
                    <td>
                        {JSON.parse(localStorage.getItem("session")).age} ans
                    </td>
                </tr>
                <tr>
                    <td>
                        Creation du compte : 
                    </td>
                    <td>
                        {JSON.parse(localStorage.getItem("session")).datetime}
                    </td>
                </tr>
            </tbody></table></center>
            <br/>
            <ChangePasswd />
            <br/>
            <br/>
        </div>
        )
    }
}

class ChangePasswd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            errors: [],
            success: false,
            passwdA: "",
            passwdB: ""
        }
        this.changePasswd.bind(this);
    }
    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }
    changePasswd = () => {
        if (this.state.passwdA != this.state.passwdB) {
            this.setState({success: false, errors: ["Vous n'avez rentré deux fois le même mot de passe"]});
            return;
        }
        $.post(
            'http://'+window.location.hostname+':8000/user/changepasswd.phjs',
            {
                passwd: this.state.passwdA,
                token: JSON.parse(localStorage.getItem("session")).token
            },
    
            (data) => {
                if (data.rep == "success") {
                    this.setState({success: true, errors: []});
                    this.setState({
                        passwdA: "",
                        passwdB: ""
                    });
                } else if (data.rep == "failed") {
                    this.setState({success: false, errors: data.errors});
                }
            },
            'json'
        );

    }
    render() {
        return (
        <div className='changePasswd'>
        <FormGroup controlId="passwdA" bsSize="large">
            <ControlLabel>Password</ControlLabel>
            <FormControl value={this.state.passwdA} onChange={this.handleChange} type="password"/>
        </FormGroup>
        <FormGroup controlId="passwdB" bsSize="large">
            <ControlLabel>Confirm Password</ControlLabel>
            <FormControl value={this.state.passwdB} onChange={this.handleChange} type="password"/>
        </FormGroup>
        {this.state.success == true && <font color='green' size='4'>Modification réussi!!</font>}
        {this.state.errors.map((error) => (<div><font size='3' color='red'> - {error}</font><br/></div>))}
        <Button
        onClick={this.changePasswd}
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