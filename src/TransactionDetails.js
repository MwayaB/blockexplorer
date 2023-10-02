// TransactionDetails.js
import React, { useEffect, useState } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import { Alchemy, Network } from 'alchemy-sdk';
import './App.css';

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

function TransactionDetails() {
  const { txHash } = useParams();
  const [transactionData, setTransactionData] = useState(null);
  const history = useHistory();

  useEffect(() => {
    async function fetchTransactionDetails() {
      const transaction = await alchemy.core.getTransaction(txHash);
      setTransactionData(transaction);
    }

    fetchTransactionDetails();
  }, [txHash]);

  if (!transactionData) {
    return <div>Loading...</div>;
  }

  const convertValueToString = (value) => {
    if (value === null || value === undefined) {
      return 'N/A'; // Handle null or undefined values
    }

    if (typeof value === 'object' && '_hex' in value && '_isBigNumber' in value) {
      return value.toString();
    } else if (typeof value === 'object') {
      return JSON.stringify(value);
    } else {
      return String(value);
    }
  };

  // Function to check if the value is a hex object
  const isHexObject = (value) => value && typeof value === 'object' && 'type' in value && 'hex' in value;

  // Truncate data field to fit the page
  const truncateData = (data) => {
    const maxLength = 100; // Set the maximum length you want to display
    return data.length > maxLength ? data.substring(0, maxLength) + '...' : data;
  };
  
  const goBack = () => {
    history.goBack();
  };

  return (
    <div>
      {/* Button to redirect back to the homepage */}
      <button className="homeButton" onClick={() => history.push('/')}>
        Go to Homepage
      </button>
      <button className="backButton" onClick={goBack}>
        Go Back
      </button>

      <h2>Transaction Details</h2>
      <p>Transaction Hash: {transactionData.hash}</p>

      {/* Display all transaction data */}
      <table className="transactionDataTable">
        <tbody>
          {Object.entries(transactionData)
            .filter(([key]) => key !== 'wait') // Exclude 'wait' field
            .map(([key, value]) => (
              <tr key={key}>
                <td>{key}:</td>
                <td>
                  {key === 'from' || key === 'to' ? (
                    <Link to={`/accountdetails/${value}`}>{value}</Link>
                  ) : key === 'data' ? (
                    truncateData(convertValueToString(value))
                  ) : (
                    convertValueToString(value)
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionDetails;
