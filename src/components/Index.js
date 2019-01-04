import React from 'react';
import $ from 'jquery';

export class Index extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			comptes: [],
			errors: [],
			getJouetsStarted: false
		}
	}

	getJouets() {
		if (this.state.getJouetsStarted == true) {
			return;
		}
		this.setState({getJouetsStarted: true});
		 $.post(
            'http://'+window.location.hostname+':8000/jouets/getAllJouets.phjs',
            {
                
            },
    
            (data) => {
                if (data.rep == "success") {
                    this.setState({comptes: data.comptes, errors: []});
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
		<center className="lesJouets">
		{this.getJouets()}
		{this.state.errors.map((error) => (<div><font size='3' color='red'> - {error}</font><br/></div>))}
		<table><tr>
		{Object.keys(this.state.comptes).map((id, index) => (
			<td>
				<table>
					<tr>
						<td>
							{this.state.comptes[id].prenom} {this.state.comptes[id].nom}
						</td>
					</tr>
					{this.state.comptes[id].jouets.length == 0 && (<tr><td><font color='orange' size='3'>Il n'y a aucun jouet</font></td></tr>)}
					{this.state.comptes[id].jouets.map((jouet) => (
						<tr>
							{/* [{id: 1, nom: "Sniper", description: "nique t'a mere"}] */}
							<td>
								{jouet.nom}
								<br/>
								<img src={'http://'+window.location.hostname+':8000/imgs/jouets/'+jouet.id+'.jpg'} />
								<br/>
								{jouet.description}
							</td>
						</tr>
					))}
				</table>
			</td>
		))}
		</tr></table>
		</center>
        )
    }
}