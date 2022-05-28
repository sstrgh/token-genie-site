import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { Box } from '@mui/system';
import { shortenAddress, useEthers, useLookupAddress } from "@usedapp/core";
import Typography from '@mui/material/Typography';
import { Button} from "../components";
import { ReactChild, ReactFragment, ReactPortal, useEffect, useState } from "react";
import { ethers, providers, } from 'ethers';
import challenges from '../challenges.json';

function WalletButton(props: {challenges: any, setChallenges: any, prizes: any, setPrizes:any}) {
    const [rendered, setRendered] = useState("");
    const ens = useLookupAddress();
    const { account, activateBrowserWallet, deactivate, error } = useEthers();
    const [challengeList, setChallengeList] = useState(null);

    useEffect(() => {
      if (ens) {
        setRendered(ens);
      } else if (account) {
        setRendered(shortenAddress(account));
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const challengesContract  = new ethers.Contract("0xa6CCd393b602A01BE459BCCCAF61c718BeE0027F", challenges.abi, provider);
        const listOfChallenges = challengesContract.getChallenge(0);
        setChallengeList(listOfChallenges);
        console.log(challengeList)
      } else {
        setRendered("");
      }
    }, [account, ens, setRendered]);
  
    useEffect(() => {
      if (error) {
        console.error("Error while connecting wallet:", error.message);
      }
    }, [error]);

    if (rendered !== "") {
        return (
            <div>
              <Button onClick={() => {
                // Show challenges for this account
                props.setChallenges(true);
                props.setPrizes(false);
              }
              }>Challenges</Button>
              <Button onClick={() => {
                // Show prizes for that account
                props.setChallenges(false);
                props.setPrizes(true);
              }}> Prizes</Button>
              <Button
                  onClick={() => {
                  if (!account) {
                      activateBrowserWallet();
                  } else {
                      props.setChallenges(false);
                      props.setPrizes(false);
                      deactivate();
                  }
                  }}>
                  {rendered}
              </Button>
            </div>
          );
    } else {
        return (
            <div>
              <Button
                  onClick={() => {
                  if (!account) {
                      activateBrowserWallet();
                  } else {
                      deactivate();
                      props.setChallenges(true);
                      props.setPrizes(true);
                  }
                  }}
              >
                  Connect Wallet
              </Button>
            </div>  
          );
    }
  }

export default function TKAppBar({challenges, setChallenges, prizes, setPrizes}: any) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ bgcolor: '#eca8d7' }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <img  src="logo.png" alt="logo"/>
          <Typography variant="h4" component="div" sx={{ color: 'secondary.main', fontWeight: 'bold', m:2, flexGrow: 1 }}>
            Token Genie
          </Typography>          
          <WalletButton challenges={challenges} setChallenges={setChallenges} prizes={prizes} setPrizes={setPrizes}/>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
