import { useEffect, useState } from "react";
import { Box, Container, Button } from "@mui/material";
import { ethers } from "ethers";
import abi from "./utils/WavePortal.json";
import { smartContractAddress } from "./address.js";
import "./App.css";

function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const contractAddress = smartContractAddress;
  const contractABI = abi.abi;

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask");
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      //Check if we're authorized to access the user's wallet
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        console.log("Soy accounts", accounts);
        const account = accounts[0];
        console.log("Found an authorized account: ", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        const waveTxn = await wavePortalContract.wave();
        console.log('Mining...', waveTxn.hash)

        await waveTxn.wait();
        console.log('Mined -- ', waveTxn.hash)

        count = await wavePortalContract.getTotalWaves()
        console.log('Retrieved total wave count...', count.toNumber())

      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <Container className="App">
      <h1>Hi! I'm laumansilla, welcome to my first smart-contract</h1>
      <Box>
        <Button variant="contained" disableElevation onClick={wave}>
          Send me a wave
        </Button>
      </Box>
      <Box sx={{ mt: 2 }}>
        {/* If there is no currentAccount render this button */}
        {!currentAccount && (
          <Button onClick={connectWallet}>Connect Wallet</Button>
        )}
      </Box>
    </Container>
  );
}

export default App;
