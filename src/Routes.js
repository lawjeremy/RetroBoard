import React from 'react';
import { Route } from 'react-router-dom';
import { Switch } from 'react-router';
import App from './App';

const NotFound = () => (
    <h1>404 Not Found</h1>
);


class Routes extends React.PureComponent{
    render(){
        return(
            <Switch>
                <Route path='/' exact component={App}></Route>
                <Route path='/board/:id' exact component={App}></Route>
                <Route path='*' component={NotFound}></Route>
            </Switch>
        );
    }
}

export default Routes;