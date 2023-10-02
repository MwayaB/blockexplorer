import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Utils, Alchemy, Network } from 'alchemy-sdk';
import './App.css';

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

function AccountDetails() {
  const { address: originalAddress } = useParams();
  const [address, setAddress] = useState(originalAddress);
  const [balance, setBalance] = useState(null);
  const history = useHistory();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchAccountDetails() {
      // Fetch account details using the address parameter
      const accountBalance = await alchemy.core.getBalance(address);

      // Convert Wei to Ether
      const balanceInEther = accountBalance && typeof accountBalance === 'object' && '_hex' in accountBalance && '_isBigNumber' in accountBalance
        ? Utils.formatEther(accountBalance)
        : String(accountBalance);

      setBalance(balanceInEther);
    }

    fetchAccountDetails();
  }, [address]);

  const goBack = () => {
    history.goBack();
  };

  const clearSearch = () => {
    setSearchTerm('');
    // Reset the address to the original one
    setAddress(originalAddress);
  };

  const handleSearch = async () => {
    // Perform the search logic and obtain the new address from the search term
    // For simplicity, we assume the search term is the new address
    const newAddress = searchTerm;

    // Update the address state to trigger a re-fetch of account details
    setAddress(newAddress);
  };

  if (!balance) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <button className="backButton" onClick={goBack}>
        Go Back
      </button>
      <button className="homeButton" onClick={() => history.push('/')}>
        Go to Homepage
      </button>
      <h2>Account Details - {address}</h2>
      <div>
        {/* Search bar */}
        <input
          type="text"
          placeholder="Search by address"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {/* Search button */}
        <button onClick={handleSearch}>Search</button>
        {/* Clear button */}
        <button onClick={clearSearch}>Clear Search</button>
      </div>
      <p>Balance: {balance} Ether</p>
      {/* Display other account details as needed */}
    </div>
  );
}

export default AccountDetails;
