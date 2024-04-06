import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [connectedNode, setConnectedNode] = useState({});
  const [channels, setChannels] = useState([]);
  const [onchainBalance, setOnchainBalance] = useState(0);
  const [lightningBalance, setLightningBalance] = useState(0);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Node Dashboard</h1>
        {connectedNode?.pubkey && <p>Connected to: {connectedNode.alias}</p>}
      </header>
      
        <div className="balances">
          <div className="balance">
            <h3>Onchain balance</h3>
            <p>900 sats</p>
          </div>
          <div className="balance">
            <h3>Lightning balance</h3>
            <p>100 sats</p>
          </div>
        </div>
    </div>
  );
}

export default App;
