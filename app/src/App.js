import React, { Component } from 'react';
import './App.css';
import Home from './Home';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import GroupList from './GroupList';
import GroupEdit from './GroupEdit';
import SidewayComponent from './SidewayComponent';

class App extends Component {
  render() {
    return (
      <CookiesProvider>
        <Router>
          <Switch>
            <Route path='/' exact={true} component={(props) => <Home {...props} />} />
            <Route path='/groups' exact={true} component={(props) => <GroupList {...props} />} />
            <Route path='/groups/:id' component={(props) => <GroupEdit {...props} />} />
            <Route path='/sideway' component={(props) => <SidewayComponent {...props} />} />
          </Switch>
        </Router>
      </CookiesProvider>
    )
  }
}

export default App;