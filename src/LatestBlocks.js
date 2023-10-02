import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Alchemy, Network } from 'alchemy-sdk';
import './App.css';

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

function LatestBlocks() {
  const [latestBlocks, setLatestBlocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLatestBlocks() {
      try {
        const latestBlockNumber = await alchemy.core.getBlockNumber();

        const startBlockNumber = Math.max(1, latestBlockNumber - 100);
        const endBlockNumber = latestBlockNumber;
        const blocks = [];

        for (let i = startBlockNumber; i <= endBlockNumber; i++) {
          const block = await alchemy.core.getBlock(i);
          blocks.push(block);
        }

        setLatestBlocks(blocks.reverse());
      } catch (error) {
        console.error('Error fetching latest blocks:', error);
      } finally {
        setLoading(false); // Set loading to false, whether successful or not
      }
    }

    fetchLatestBlocks();
  }, []);

  return (
    <div>
      <h2>Latest 100 Blocks</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="latestBlocksTable">
          <thead>
            <tr>
              <th>Block Number</th>
              <th>Hash</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {latestBlocks.map((block) => (
              <tr key={block.number}>
                <td>{block.number}</td>
                <td>
                  <Link to={`/blockdetails/${block.hash}`}>{block.hash}</Link>
                </td>
                <td>{block.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default LatestBlocks;
