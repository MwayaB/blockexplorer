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
  const [tokenBalances, setTokenBalances] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const history = useHistory();

  useEffect(() => {
    async function fetchAccountDetails() {
      // Fetch account details using the address parameter
      const accountBalance = await alchemy.core.getBalance(address);
      const balanceInEther = accountBalance && typeof accountBalance === 'object' && '_hex' in accountBalance && '_isBigNumber' in accountBalance
        ? Utils.formatEther(accountBalance)
        : String(accountBalance);

      setBalance(balanceInEther);

      // Fetch token balances using the address parameter
      const tokens = (await alchemy.core.getTokenBalances(address)).tokenBalances;
      setTokenBalances(tokens);
    }

    fetchAccountDetails();
  }, [address]);

  const goBack = () => {
    history.goBack();
  };

  const handleSearch = async () => {
    // Perform the search logic and obtain the new address from the search term
    // For simplicity, we assume the search term is the new address
    const newAddress = searchTerm;

    // Update the address state only if the search term is not empty
    if (newAddress.trim() !== '') {
      setAddress(newAddress);
    }
  };

  if (!balance || !tokenBalances) {
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
      <h2>Account Details</h2>
      <p>Balance: {balance} Ether</p>

      {/* Search bar */}
      <div>
        <input
          type="text"
          placeholder="Search by Contract Address"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <h3>Token Balances:</h3>
      <table className="tokenBalancesTable">
        <thead>
          <tr>
            <th>Contract Address</th>
            <th>Token Balance (Ether)</th>
          </tr>
        </thead>
        <tbody>
          {tokenBalances.map((token, index) => (
            <tr key={index}>
              <td>{token.contractAddress}</td>
              <td>{Utils.formatUnits(token.tokenBalance, token.decimals)} Ether</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Display other account details as needed */}
    </div>
  );
}

export default AccountDetails;
