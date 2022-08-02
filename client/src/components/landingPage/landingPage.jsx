import React from 'react';
import { Box, Button } from '@mui/material';

const LandingPage = () => {

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
          window.localStorage.setItem("account", JSON.stringify(accounts[0]))
        //   setCurrentAccount(accounts[0]);
        } catch (error) {
          console.log(error);
        }
    };

    return (

        <Box>
            <Box className='wallet-contain-button'>
                {/* If there is no currentAccount render this button */} 
                <h3 className='wallet-nav-title'>Hey you still haven't connected your wallet!</h3>
                <Box>
                <Button 
                    variant="contained"
                    onClick={connectWallet}
                    sx={{ml: 2, mr:2, width: 250}}
                >Connect Wallet
                </Button>
                </Box>        
            </Box>
        </Box>

    )


}


export default LandingPage;