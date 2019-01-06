import React from 'react';
import { Button } from "react-bootstrap";
import $ from 'jquery';

export class Demands extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            demands: [],
            errors: []
        }
        this.getDemands.bind(this);
        this.getDemands();
    }
    getDemands = () => {
		$.post(
			'http://'+window.location.hostname+':8000/troc/getDemandTroc.phjs',
			{
				token: JSON.parse(localStorage.getItem("session")).token
			},
	
			(data) => {
				if (data.rep == "success") {
					this.setState({demands: data.demands, errors: []});
				} else if (data.rep == "failed") {
                    this.setState({errors: data.errors});
				}
			},
			'json'
		);
    }

    render() {
        return(
            <div className="demandes">
                <h1>Demandes de troc : </h1>
                {this.state.errors.map((error) => (
                    <font color='red' size='3'>{error}</font>
                ))}
                {this.state.demands.length == 0 && (<font color='orange' size='3'>Aucune demande de troc</font>)}
                {this.state.demands.map((demand) => (
                    <ChaqueDemande demand={demand} />
                ))}
            </div>
        )
    }
}

class ChaqueDemande extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            demand: props.demand,
            successSuppr: false,
            errorsSuppr: [],
            successAccept: false,
            errorsAccept: [],
            supprDemandStarted: false
        }
    }

    supprDemand() {
        if (this.state.supprDemandStarted == true) {
            return;
        }
        this.setState({supprDemandStarted: true});
        var id = this.state.demand.id;
        $.post(
            'http://'+window.location.hostname+':8000/troc/supprDemandTroc.phjs',
            {
                idDemand: id,
                token: JSON.parse(localStorage.getItem("session")).token
            },
    
            (data) => {
                if (data.rep == "success") {
                    this.setState({successSuppr: true, errorsSuppr: []});
                    setTimeout(() => { window.location.href = "/demands"; }, 250);
                } else if (data.rep == "failed") {
                    this.setState({successSuppr: false, errorsSuppr: data.errors});
                }
            },
            'json'
        );
    }

    acceptDemand() {
        var id = this.state.demand.id;
        $.post(
            'http://'+window.location.hostname+':8000/troc/acceptDemandTroc.phjs',
            {
                idDemand: id,
                token: JSON.parse(localStorage.getItem("session")).token
            },
    
            (data) => {
                if (data.rep == "success") {
                    this.setState({successAccept: true, errorsAccept: []});
                    setTimeout(() => { window.location.href = "/demands"; }, 250);
                } else if (data.rep == "failed") {
                    this.setState({successAccept: false, errorsAccept: data.errors});
                }
            },
            'json'
        );
    }

    render() {
        return (
            <div>
                <stong>{this.state.demand.prenomSrc} {this.state.demand.nomSrc} souhaite échanger son {this.state.demand.jouetSrc} avec votre {this.state.demand.jouetDst}</stong>
                <br/>
                {this.state.successAccept === true && (<div><font color='green' size='3'>Troc accepté</font></div>)}
                {this.state.errorsAccept.map((error) => (<font color='red' size='3'>{error}</font>))}
                <Button 
                onClick={() => this.acceptDemand()} 
                block 
                bsSize="xs"
                type="submit"
                >
                Accepter
                </Button>
                <br/>
                {this.state.successSuppr === true && (<div><font color='green' size='3'>Suppression réussi!</font></div>)}
                {this.state.errorsSuppr.map((error) => (<font color='red' size='3'>{error}</font>))}
                <Button 
                onClick={() => this.supprDemand()} 
                block 
                bsSize="xs"
                type="submit"
                >
                Supprimer
                </Button>
                <br/>
            </div>
        )
    }

}