import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { Box } from '@mui/system';
import { Stack } from '@mui/material';
import { shortenAddress, useEthers, useLookupAddress } from "@usedapp/core";
import Typography from '@mui/material/Typography';
import { useEffect, useState } from "react";
import { Button} from "../components";
import Grid from "@mui/material/Grid";

function WalletButton(props: {challenges: any, setChallenges: any, prizes: any, setPrizes:any}) {
    const [rendered, setRendered] = useState("");
    const ens = useLookupAddress();
    const { account, activateBrowserWallet, deactivate, error } = useEthers();
  
    useEffect(() => {
      if (ens) {
        setRendered(ens);
      } else if (account) {
        setRendered(shortenAddress(account));
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
    <Grid xs={12}> 
      <AppBar position="static" sx={{ bgcolor: '#eca8d7' }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <img  src="logo.png" alt="logo"/>
          <Typography variant="h4" component="div" sx={{ color: 'secondary.main', fontWeight: 'bold', m:2, flexGrow: 1 }}>
            Token Genie
          </Typography>          
          <WalletButton challenges={challenges} setChallenges={setChallenges} prizes={prizes} setPrizes={setPrizes}/>
        </Toolbar>
      </AppBar>
    </Grid>
  );
}
