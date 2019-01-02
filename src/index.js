import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import PropTypes from 'prop-types';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom';

/*App.propTypes = {
	prenom: PropTypes.string.isRequired,
	age: PropTypes.number.isRequired,
	adj: PropTypes.string.isRequired,
	verbe: PropTypes.string.isRequired,
	admin: PropTypes.oneOf([true,false]).isRequired,
}*/

//ReactDOM.render(<App prenom="Julien BOUVET" age="18" adj='CONNARD' verbe='manger' admin={false} tab={[1,2,3,4]}/>, document.getElementById('root'));
ReactDOM.render(<BrowserRouter><App /></BrowserRouter>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
