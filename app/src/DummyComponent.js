import React, { Component } from 'react';
import { ORIGIN_URI_KEY } from './Constants';
// import { Link, withRouter } from 'react-router-dom';

class DummyComponent extends Component {

    constructor(props) {
        super(props);
        console.log('window.location: ', window.location.pathname);
        localStorage.removeItem(ORIGIN_URI_KEY);
        localStorage.setItem(ORIGIN_URI_KEY, window.location.pathname);
    }
        
    async componentDidMount() {
        const response = await fetch('/api/user', { credentials: 'include' });
        const body = await response.text();
        if (body === '') {
            this.login();
        } else {
            console.log('authenticated!');
        }
    }

    login() {
        let port = (window.location.port ? ':' + window.location.port : '');
        if (port === ':3000') {
          port = ':8080';
        }
        window.location.href = '//' + window.location.hostname + port + '/private';
      }
    
    render() {
        return (
            <div>aeiouy</div>
        );
  }
}

export default DummyComponent;