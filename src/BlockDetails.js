// BlockDetails.js
import React, { useEffect, useState } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import { Alchemy, Network } from 'alchemy-sdk';
import './App.css';

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

function BlockDetails() {
  const { blockHash } = useParams();
  const [blockData, setBlockData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const history = useHistory();

  useEffect(() => {
    async function fetchBlockDetails() {
      const block = await alchemy.core.getBlockWithTransactions(blockHash);
      setBlockData(block);
      setTransactions(block.transactions || []);
    }

    fetchBlockDetails();
  }, [blockHash]);

  if (!blockData) {
    return <div>Loading...</div>;
  }

  const convertValueToString = (value) => {
    if (typeof value === 'object' && '_hex' in value && '_isBigNumber' in value) {
      return value.toString();
    } else if (typeof value === 'object') {
      return JSON.stringify(value);
    } else {
      return String(value);
    }
  };

  const redirectToHomepage = () => {
    history.push('/');
  };

  return (
    <div>
      <button className="homeButton" onClick={redirectToHomepage}>
        Go to Homepage
      </button>

      <h2>Block Details</h2>
      <p>Block Hash: {blockData.hash}</p>

      <table className="blockDataTable">
        <tbody>
          {Object.entries(blockData)
            .filter(([key]) => key !== 'transactions')
            .map(([key, value]) => (
              <tr key={key}>
                <td>{key}:</td>
                <td>{convertValueToString(value)}</td>
              </tr>
            ))}
        </tbody>
      </table>

      <h2>Transactions:</h2>
      <table className="transactionsTable">
        <thead>
          <tr>
            <th>From</th>
            <th>To</th>
            <th>Transaction Hash</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <tr key={index}>
              <td>{transaction.from}</td>
              <td>{transaction.to}</td>
              <td>
                {/* Link to redirect to TransactionDetails component */}
                <Link to={`/transactiondetails/${transaction.hash}`}>{transaction.hash}</Link>
              </td>
              <td>{transaction.value.toString()} Wei</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BlockDetails;
