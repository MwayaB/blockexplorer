// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import BlockDetails from './BlockDetails';
import LatestBlocks from './LatestBlocks';
import TransactionDetails from './TransactionDetails';
import AccountDetails from './AccountDetails'; // Import the AccountDetails component

function App() {
  return (
    <Router>
      <div className="App">
        <h1>Ethereum Block Explorer</h1>

        <Switch>
          <Route path="/blockdetails/:blockHash">
            <BlockDetails />
          </Route>
          <Route path="/transactiondetails/:txHash">
            <TransactionDetails />
          </Route>
          <Route path="/accountdetails/:address"> {/* Add a route for AccountDetails */}
            <AccountDetails />
          </Route>
          <Route path="/">
            <LatestBlocks />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
