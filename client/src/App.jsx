import { useEffect, useState } from "react";
import { Box, Container, Button, Card, CardContent, Typography, TextField} from "@mui/material";
import { ethers } from "ethers";
import abi from "./utils/WavePortal.json";
import { smartContractAddress } from "./address.js";
import "./App.css";
import './styles/card.css';
import './styles/search.css'

function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [allWaves, setAllWaves] = useState([])
  const [countWave, setCountWave] = useState(0)
  
  const contractAddress = smartContractAddress;
  const contractABI = abi.abi;
  // console.log('COUNTWAVE', countWave)


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
        await getAllWaves()
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

        const waveTxn = await wavePortalContract.wave('This is a message');
        console.log('Mining...', waveTxn.hash)

        await waveTxn.wait();
        console.log('Mined -- ', waveTxn.hash)

        count = await wavePortalContract.getTotalWaves()
        setCountWave(count.toNumber())
        
        console.log('Retrieved total wave count...', count.toNumber())

      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer) 

        //call the getAllWaves method 
        const waves = await wavePortalContract.getAllWaves();

        // we only need address, timestamp, and message in our UI so let's
        // pick those out

        let wavesCleaned = []
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp *1000),
            message: wave.message
          })
        })

        setAllWaves(wavesCleaned)
      } else {
        console.log("Ethereum object doesn't exist!!")
      }
    } catch (error) {
      console.log(error)
    }
  }


  useEffect(() => {
    checkIfWalletIsConnected();
  }, [countWave]);



  return (
    <Container className="App">
      <Box 
        className='wallet-nav'
      >
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Ethereum_logo_2014.svg/256px-Ethereum_logo_2014.svg.png"
          alt="Ethereum-logo"
          className='img-nav'
        />
        <Box className='wallet-contain-button'>
          {/* If there is no currentAccount render this button */}
          {!currentAccount? 
            <>              
              <h3 
                className='wallet-nav-title'
              >Hey you still haven't connected your wallet!</h3>
              <Button 
                variant="contained"
                onClick={connectWallet}
                sx={{ml: 2, mr:2}}
              >Connect Wallet
              </Button>
            </> :
            <>
              <h3 className='wallet-nav-title'>Yes now! Very well, you are now connected.</h3>
            </>
          }
        </Box>
      </Box>
      <Box 
        className='contain-body'
        
        >
        <h1
          className='body-title'
        >Hi! Welcome to my first smart-contract</h1>
        <Button 
          variant="contained" 
          disableElevation 
          onClick={wave}
          sx={{mb: 2}}
          >
          Send me a wave
        </Button>
      </Box>
      <Box className='contain-search' >
        <Box>
          <h3 className='count-wave'>Retrieved total wave count: {countWave}</h3>
        </Box>
        <Box>
          <TextField label='Insert you Address' variant='outlined' className='search'/>
        </Box>
      </Box>
      <Box className='containCard'>
        {allWaves.map((wave, index) => {
          return (
            <Card key={index} sx={{width:600}} className='card'>
              <CardContent>
                <Typography sx={{ fontSize: 20 }} className='card-title'>New message!</Typography>
                <Typography color="text.secondary" className='card-subtitle'>Address: {wave.address}</Typography>
                <Typography color="text.secondary" className='card-subtitle'>Time: {wave.timestamp.toString()}</Typography>
                <Typography className='card-subtitle'>Message: {wave.message}</Typography>
              </CardContent>
            </Card>
          )
        })}
      </Box>
    </Container>
  );
}

export default App;
