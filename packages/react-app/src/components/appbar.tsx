import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { Box } from '@mui/system';
import { shortenAddress, useEthers, useLookupAddress } from "@usedapp/core";
import Typography from '@mui/material/Typography';
import { useEffect, useState } from "react";
import { Button} from "../components";

function WalletButton() {
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
              <Button>Challenges</Button>
              <Button>Prizes</Button>
              <Button
                  onClick={() => {
                  if (!account) {
                      activateBrowserWallet();
                  } else {
                      deactivate();
                  }
                  }}
              >
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
                  }
                  }}
              >
                  Connect Wallet
              </Button>
            </div>  
          );
    }
  }

export default function TKAppBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ bgcolor: '#eca8d7' }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <img  src="logo.png" alt="logo"/>
          <Typography variant="h4" component="div" sx={{ color: 'secondary.main', fontWeight: 'bold', m:2, flexGrow: 1 }}>
            Token Genie
          </Typography>          
          <WalletButton />
        </Toolbar>
      </AppBar>
    </Box>
  );
}
