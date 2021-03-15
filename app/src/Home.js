import React, { Component } from 'react';
import './App.css';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import { Button, Container } from 'reactstrap';
import { withCookies } from 'react-cookie';
import { ORIGIN_URI_KEY } from './Constants';

/**
 * There are some things you should be aware of in this component:
 * 
 * 1) withCookies() wraps the Home component at the bottom to give it access to 
 * cookies. Then you can use const { cookies } = props in the constructor, and 
 * fetch a cookie with cookies.get('XSRF-TOKEN').
 * 
 * 2) When using fetch(), you need to include {credentials: 'include'} to transfer 
 * cookies. You will get a 403 Forbidden if you do not include this option.
 * 
 * 3) The CSRF cookie from Spring Security has a different name than the header 
 * you need to send back. The cookie name is XSRF-TOKEN, while the header name is X-XSRF-TOKEN.
 * 
 */

class Home extends Component {
  state = {
    isLoading: true,
    isAuthenticated: false,
    user: undefined
  };

  constructor(props) {
    super(props);
    const { cookies } = props;
    this.state.csrfToken = cookies.get('XSRF-TOKEN');
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  async componentDidMount() {
    const response = await fetch('/api/user', { credentials: 'include' });
    const body = await response.text();
    if (body === '') {
      this.setState(({ isAuthenticated: false }));
    } else {
      this.setState({ isAuthenticated: true, user: JSON.parse(body) });
    }

    /** */

    const originUriValue = sessionStorage.getItem(ORIGIN_URI_KEY);
    sessionStorage.removeItem(ORIGIN_URI_KEY);
    console.log('value read from storage: ', originUriValue);
    if ( originUriValue ) { 
      this.props.history.push(originUriValue); 
    }

  }

  login() {
    let port = (window.location.port ? ':' + window.location.port : '');
    if (port === ':3000') {
      port = ':8080';
    }
    window.location.href = '//' + window.location.hostname + port + '/private';
  }

  logout() {
    fetch(
        '/api/logout', 
        {
          method: 'POST', 
          credentials: 'include',
          headers: {'X-XSRF-TOKEN': this.state.csrfToken}
        }
      )
      .then(res => res.json())
      .then(
        response => {
          window.location.href = 
            response.logoutUrl + "?id_token_hint=" + response.idToken + "&post_logout_redirect_uri=" + window.location.origin;
        }
      );
  }

  render() {
    const message = this.state.user ?
      <h2>Welcome, {this.state.user.name}!</h2> :
      <p>Please log in to manage your JUG Tour.</p>;

    const button = this.state.isAuthenticated ?
      <div>
        <Button color="link"><Link to="/groups">Manage JUG Tour</Link></Button>
        <br/>
        <Button color="link" onClick={this.logout}>Logout</Button>
      </div> :
      <Button color="primary" onClick={this.login}>Login</Button>;

    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          {message}
          {button}
        </Container>
      </div>
    );
  }
}

export default withCookies(Home);