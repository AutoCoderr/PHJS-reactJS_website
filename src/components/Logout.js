import React from 'react';
import { Button } from "react-bootstrap";
import $ from 'jquery';

export class Logout extends React.Component {
    constructor(props){
        super(props);
        this.disconnect.bind(this);
    }
    disconnect = event => {
		$.post(
			'http://127.0.0.1:8000/user/logout.phjs',
			{
				token: JSON.parse(localStorage.getItem("session")).token
			},
	
			(data) => {
				if (data.rep == "success") {
                    this.setState({errors: []});
					localStorage.removeItem("session");
					window.location = "/login";
				} else if (data.rep == "failed") {
					this.setState({errors: data.errors});
				}
			},
			'json'
		);
    }
    render() {
        return(
            <div className="Dashboard">
                <Button
                onClick={this.disconnect}
                block
                bsSize="large"
                type="submit"
                >
                De-connexion
                </Button>
            </div>
        )
    }
}