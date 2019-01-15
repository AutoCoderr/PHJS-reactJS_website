import React from 'react';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import $ from 'jquery';

export class Messages extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            MPs: [],
            MSs: [],
            displayMPs: true,
            displayMSs: false,
            toShowIndex: undefined,
            currentType: undefined,
            errors: []
        }
        if (localStorage.getItem("session") == null) {
            window.alert("Vous n'êtes pas connecté");
            window.location.href = "/";
        } else {
            this.getMessages.bind(this);
            this.getMessages();
        }
    }
    getMessages = () => {
		$.post(
			'http://'+window.location.hostname+':8000/messages/getMessages.phjs',
			{
				token: JSON.parse(localStorage.getItem("session")).token
			},
	
			(data) => {
				if (data.rep == "success") {
                    console.log(data.messages);
                    console.log(data.messages.MSs.length);
					this.setState({MPs: data.messages.MPs, MSs: data.messages.MSs, errors: []});
                    console.log(this.state.MSs);
                    console.log(this.state.MSs.length);
				} else if (data.rep == "failed") {
                    this.setState({errors: data.errors});
				}
			},
			'json'
		);
    }

    showMessage = (i,type) => {
        if (type == "MP" & typeof(this.state.MPs[i]) == "undefined") {
            window.alert("Ce message n'existe pas");
            return;
        } else if (type == "MS" & typeof(this.state.MSs[i]) == "undefined") {
            window.alert("Ce message n'existe pas");
            return;
        }
        this.setState({toShowIndex: i, currentType: type, displayMPs: false, displayMSs: false});
    }

    render() {
        return(
            <div className="demandes">
                {this.state.errors.map((error) => (
                    <font color='red' size='3'>{error}</font>
                ))}
                <input
                    type='button'
                    onClick={() => this.setState({displayMPs: true, displayMSs: false})} 
                    value='Boite de reception'  
                />
                <input
                    type='button'
                    onClick={() => this.setState({displayMPs: false, displayMSs: true})} 
                    value="Boite d'envoie"  
                />
                {this.state.displayMPs === true && (
                    <div>
                    <h1>Messages privés : </h1>
                    {this.state.MPs.length > 0 ? (
                        <div>
                        {Object.keys(this.state.MPs).map((i, index) => (
                            <ChaqueMessage show={this.showMessage} message={this.state.MPs[i]} type="MP" index={i}/>
                        ))}
                        </div>
                    ) : (<font color="orange" size="4">Aucun message privé</font>)}
                    </div>
                )}
                {this.state.displayMSs === true && (
                    <div>
                    <h1>Messages envoyés : </h1>
                    {this.state.MSs.length > 0 ? (
                        <div>
                        {Object.keys(this.state.MSs).map((i, index) => (
                            <div>
                            <ChaqueMessage show={this.showMessage} message={this.state.MSs[i]} type="MS" index={i}/>
                            <br/>
                            </div>
                        ))}
                        </div>
                    ) : (<font color="orange" size="4">Aucun message envoyé</font>)}
                    </div>
                )}
                {typeof(this.state.currentType) !== "undefined" && (
                    <div>
                        {this.state.currentType === "MP" ? (
                            <Button 
                                onClick={() => {this.setState({displayMPs: true, toShowIndex: undefined, currentType: undefined})}} 
                                block 
                                bsSize="xs"
                                type="submit"
                            >
                                Retour
                            </Button>
                        ) : (
                            <Button 
                                onClick={() => {this.setState({displayMSs: true, toShowIndex: undefined, currentType: undefined})}} 
                                block 
                                bsSize="xs"
                                type="submit"
                            >
                                Retour
                            </Button>
                        )}
                        {typeof(this.state.toShowIndex) !== "undefined" && (
                            <div>
                            {this.state.currentType === "MP" ? (
                                <div>
                                FROM {this.state.MPs[this.state.toShowIndex].prenom} {this.state.MPs[this.state.toShowIndex].prenom}
                                <br/>
                                Objet : {this.state.MPs[this.state.toShowIndex].objet}
                                <br/>
                                contenu : {this.state.MPs[this.state.toShowIndex].content}
                                </div>
                            ) : (
                                <div>
                                TO {this.state.MSs[this.state.toShowIndex].prenom} {this.state.MSs[this.state.toShowIndex].prenom}
                                <br/>
                                Objet : {this.state.MSs[this.state.toShowIndex].objet}
                                <br/>
                                contenu : {this.state.MSs[this.state.toShowIndex].content}
                                </div>
                            )}
                            </div>
                        )}
                    </div>
                )}
                <SendMessage />
            </div>
        )
    }
}
// 

class SendMessage extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            messageDst: {value: ""},
            messageObjet: "",
            messageContent: "",
            errorsCompte: [],
            errorsSend: [],
            successSend: false,
            comptes: []
        }
        this.sendMessage.bind(this);
        this.listComptes.bind(this);
        this.listComptes();
    }

    countObject = (obj) => {
        var len = 0;
        for (var key in obj) {
            len += 1;
        }
        return len;
    }

    listComptes = () => {
        $.post(
             'http://'+window.location.hostname+':8000/user/getComptes.phjs',
             {
                  token: JSON.parse(localStorage.getItem("session")).token
             },
      
             (data) => {
                 if (data.rep == "success") {
                     this.setState({errorsCompte: []});
                     this.setState({comptes: data.comptes});
                 } else if (data.rep == "failed") {
                     this.setState({errorsCompte: data.errors});
                 }
             },
             'json'
         );
    }

    sendMessage = () => {
        $.post(
             'http://'+window.location.hostname+':8000/messages/sendMessage.phjs',
             {
                  dst: this.state.messageDst.value,
                  objet: this.state.messageObjet,
                  content: this.state.messageContent,
                  token: JSON.parse(localStorage.getItem("session")).token
             },
      
             (data) => {
                 if (data.rep == "success") {
                     this.setState({errorsSend: [], successSend: true});
                     setTimeout(() => {window.location.href = '/messages'},250);
                 } else if (data.rep == "failed") {
                     this.setState({errorsSend: data.errors, successSend: false});
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
        return (
            <div>
                <h2>Envoyer un MP</h2>
                {this.countObject(this.state.comptes) > 0 ? (
                    <FormGroup controlId="trocCompteDst">
                        <ControlLabel>Troquer avec : </ControlLabel>
                        <FormControl
                            inputRef={ el => this.state.messageDst = el}
                            componentClass="select" placeholder="select">
                            <option value="">Choisir</option>
                            {Object.keys(this.state.comptes).map((i, index) => (
                                <option key={this.state.comptes[i].id} value={this.state.comptes[i].id}>{this.state.comptes[i].prenom} {this.state.comptes[i].nom}</option>
                            ))}
                        </FormControl>
                    </FormGroup>
                    ) : (
                    <font color='orange' size='3'>Personne à qui envoyer un message</font>
                )}
                <FormGroup controlId="messageObjet" bsSize="large">
                    <ControlLabel>Objet</ControlLabel>
                    <FormControl autoFocus type="text" value={this.state.messageObjet} onChange={this.handleChange}/>
                </FormGroup>
                <FormGroup controlId="messageContent" bsSize="large">
                    <ControlLabel>Contenu</ControlLabel>
                    <FormControl autoFocus type="text" value={this.state.messageContent} onChange={this.handleChange}/>
                </FormGroup>
                <br/>
                {this.state.successSend === true && (<font color='green' size='3'>Envoie réussi</font>)}
                {this.state.errorsSend.map((error) => (<div><font color='red' size='3'>{error}</font><br/></div>))}
                <Button 
                    onClick={() => this.sendMessage()} 
                    block 
                    bsSize="xs"
                    type="submit"
                >
                Envoyer
                </Button>
            </div>
        )
    }
}
//
class ChaqueMessage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: props.message,
            type: props.type,
            index: props.index,
            supprMessageStarted: false,
            successSuppr: false,
            errorsSuppr: [],
        }
        this.show = props.show;
    }

    supprMessage() {
        if (this.state.supprMessageStarted == true) {
            return;
        }
        this.setState({supprMessageStarted: true});
        var id = this.state.message.id;
        $.post(
            'http://'+window.location.hostname+':8000/messages/supprMessage.phjs',
            {
                id: id,
                type: this.state.type,
                token: JSON.parse(localStorage.getItem("session")).token
            },
    
            (data) => {
                if (data.rep == "success") {
                    this.setState({successSuppr: true, errorsSuppr: []});
                    setTimeout(() => { window.location.href = "/messages"; }, 250);
                } else if (data.rep == "failed") {
                    this.setState({successSuppr: false, errorsSuppr: data.errors});
                }
            },
            'json'
        );
    }

    render() {
        return (
            <div>
                {this.state.type === "MP" ? "FROM" : "TO"} {this.state.message.prenom} {this.state.message.nom} ({this.state.message.datetime})
                <Button 
                    onClick={() => this.supprMessage()} 
                    block 
                    bsSize="xs"
                    type="submit"
                >
                Supprimer
                </Button>
                <Button 
                    onClick={() => this.show(this.state.index,this.state.type)} 
                    block 
                    bsSize="xs"
                    type="submit"
                >
                Afficher
                </Button>
            </div>
        )
    }

}