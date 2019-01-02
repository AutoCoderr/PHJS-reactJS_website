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
            {(JSON.parse(localStorage.getItem('session')).perm == 'admin' | JSON.parse(localStorage.getItem('session')).perm == 'superadmin') ? (<OtherFiches />) : " "}
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
            'http://127.0.0.1:8000/user/changepasswd.phjs',
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

class OtherFiches extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            errors: [],
            success: false,
            comptes: {},
            getFicheStarted: false,
            otherUserRef: React.createRef()
        }
        this.getFiches.bind(this);
        this.banUnban.bind(this);
    }
    getFiches = () => {
        if (this.state.getFicheStarted == true) {
            return;
        }
        this.setState({getFicheStarted: true});
        $.post(
            'http://127.0.0.1:8000/admin/getfiches.phjs',
            {
                token: JSON.parse(localStorage.getItem("session")).token
            },
    
            (data) => {
                if (data.rep == "success") {
                    this.setState({success: true, errors: [], comptes: data.comptes});
                } else if (data.rep == "failed") {
                    this.setState({success: false, errors: data.errors});
                }
            },
            'json'
        );
    }
    banUnban = (id) => {
        id = id.id;
        var toSet;
        if (this.state.comptes[id].banned == 1) {
            toSet = 0;
        } else {
            toSet = 1;
        }
        $.post(
            'http://127.0.0.1:8000/admin/banUnban.phjs',
            {
                toSet: toSet,
                id: id,
                token: JSON.parse(localStorage.getItem("session")).token
            },
    
            (data) => {
                if (data.rep == "success") {
                    var comptesB = this.state.comptes;
                    comptesB[id].banned = toSet;
                    comptesB[id].errors = [];
                    this.setState({comptes : comptesB});
                } else if (data.rep == "failed") {
                    var comptesB = this.state.comptes;
                    comptesB[id].errors = data.errors;
                    this.setState({comptes : comptesB});
                }
            },
            'json'
        );

    }
    scrollTo = (ref) => {
        window.scrollTo({
            top:ref.current.offsetTop, 
            behavior: "smooth"   // Optional, adds animation
        })
    }
    render() {
        return(
            <div className="OtherFiches">
                {this.getFiches()}
                <input type='button' value="&darr;" onClick={() => this.scrollTo(this.state.otherUserRef)}/>
                <h3 ref={this.state.otherUserRef}>Les autres utilisateurs :</h3><br/>
                {this.state.success == true && 
                    <center>
                      <table>
                        <tbody>
                            {Object.keys(this.state.comptes).map((id, index) => (
                             <tr key={id}>
                              <td>
                                {this.state.comptes[id].errors = []}
                                <table>
                                  <tr>
                                    <td>
                                      Prénom et nom :
                                    </td>
                                    <td>
                                      {this.state.comptes[id].prenom} {this.state.comptes[id].nom}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      Permissions :
                                    </td>
                                    <td>
                                      '{this.state.comptes[id].perm}'
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      Metier :
                                    </td>
                                    <td>
                                      {this.state.comptes[id].metier}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      Age :
                                    </td>
                                    <td>
                                      {this.state.comptes[id].age} ans
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      Création du compte
                                    </td>
                                    <td>
                                      {this.state.comptes[id].datetime}
                                    </td>
                                  </tr>
                                </table>
                                {this.state.comptes[id].errors.map(error => (<font color='red' size='3'>{error}</font>))}
                                {JSON.parse(localStorage.getItem('session')).perm == 'superadmin' &&
                                (<Button
                                onClick={() => this.banUnban({id})}
                                block
                                bsSize="large"
                                type="submit"
                                >
                                {this.state.comptes[id].banned == 0 ? "Bannir" : "De-bannir"}
                                </Button>)}
                                <br/><br/>
                              </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </center>
                }
                {this.state.errors.map(error => (<font color='red' size='3'>{error}</font>))}
                {JSON.parse(localStorage.getItem('session')).perm == 'superadmin' && (<FormuAdmin />)}
            </div>
        )
    }
}

class FormuAdmin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            errors: [],
            success: false,
            prenom : "",
            nom : "",
            metier: "",
            age: "",
            password: "",
            cpassword: "",
            adminFormuRef: React.createRef()
        };
    }
    createAdmin = () => {
        if(this.state.password !== this.state.cpassword){
            this.setState({success: false, errors: ["Vous n'avez pas rentré deux fois le même mot de passe"]});
            return;
        }
        $.post(
            'http://127.0.0.1:8000/admin/signupAdmin.phjs',
            {
                prenom: this.state.prenom,
                nom: this.state.nom,
                metier: this.state.metier,
                age: this.state.age,
                password: this.state.password,
                token: JSON.parse(localStorage.getItem("session")).token
            },
    
            (data) => {
                if (data.rep == "success") {
                    this.setState({success: true, errors: []});
                    this.setState({
                        prenom : "",
                        nom : "",
                        metier: "",
                        age: "",
                        password: "",
                        cpassword: ""
                    });
                } else if (data.rep == "failed") {
                    this.setState({success: false, errors: data.errors});
                }
            },
            'json'
        );
    }
    scrollTo = (ref) => {
        window.scrollTo({
            top:ref.current.offsetTop, 
            behavior: "smooth"   // Optional, adds animation
        })
    }
    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }
    render() {
        return(
            <div className="SignupAdmin">
                <input type='button' value="&darr;" onClick={() => this.scrollTo(this.state.adminFormuRef)}/>
                <h3 ref={this.state.adminFormuRef}>Ajouter un admin</h3>
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
                {this.state.success == true && <font color='green' size='4'>Ajout réussi!!</font>}
                {this.state.errors.map((error) => (<div><font size='3' color='red'> - {error}</font><br/></div>))}
                <Button
                onClick={this.createAdmin}
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