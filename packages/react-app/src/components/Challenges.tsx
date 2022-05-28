import { Stack, TextareaAutosize } from "@mui/material";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { Item } from "../components/Item";
import { Button } from "../components";
import TextField from "@mui/material/TextField";
import { ethers } from "ethers";
import challenges from "../challenges.json";
import React, { useEffect, useState } from "react";
import { shortenAddress, useEthers, useLookupAddress } from "@usedapp/core";
import { StartSharp } from "@mui/icons-material";

export const Challenges = () => {
  const { account, activateBrowserWallet, deactivate, error } = useEthers();
  const [challengeData, setChallengeData] = useState<any[]>([]);
  const [readData, setReadData] = useState(false);

  const contractAddress = "0xE0fbFD3110bB285eF6F38982EEF15E825Ad3d629";
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, challenges.abi, signer);

  useEffect(() => {
    async function getMyChallenges(account: any) {
      const myChallenges = await contract.getMyChallenges(account);
      if (readData == false) {
      let length = myChallenges.length;
      for (let i = 0; i < length; i++) {
          let id = ethers.BigNumber.from(myChallenges[i]).toNumber();
          const challenge = contract.getChallenge(id, account);
          challenge.then(function(response: any){
              let id = response[0];
              let description = response[2];
              let stars = ethers.BigNumber.from(response[3]).toNumber(); 
              addChallenge(id, stars, description);
          })
          setReadData(true);
        }
      }
    }

  
    function addChallenge(id: any, stars: any, description: any) {
        let obj = {
            "id": id,
            "stars": stars,
            "description": description
        }
        setChallengeData(challengeData => [...challengeData, obj]);
    }
  
    getMyChallenges(account);
   },[])
   
  const setHandler = (event: any) => {
    event.preventDefault();
    contract.createChallenge(event.target.stars.value, event.target.description.value);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <h1>Challenges You Have Created</h1>
          {challengeData.map((item: any)=> {
            let id = ethers.BigNumber.from(item["id"]).toNumber();
            let description = item["description"];
            let stars = item["stars"]
            return (<Item> 
                <h2> Challenge {id}</h2> <p> {description}</p> <p>Stars to Earn: {stars}</p></Item>);
          })}
        </Grid>
        <Grid item sx={{ mt: 5 }} xs={4}>
          <div>
            <form onSubmit={setHandler}>
              <TextField
                style={{ width: "400px", margin: "5px" }}
                sx={{
                  "fieldset": {
                    borderColor: "hotpink",
                  },
                  bgcolor: "white",
                }}
                name="stars"
                label="Stars To Be Awarded"
                variant="outlined"
              />

              <br />
              <TextField
                style={{ width: "400px", margin: "5px" }}
                name="description"
                type="text"
                label="Challenge Description"
                variant="outlined"
                multiline
                rows={10}
                sx={{
                    "fieldset": {
                      borderColor: "hotpink",
                    },
                    bgcolor: "white",
                  }}
              />
              <br />
              <Button type={"submit"} variant="contained" color="primary">
                Submit
              </Button>
            </form>
          </div>
        </Grid>
        <Grid item xs={8}>
          <h1>Challenges You Can Complete</h1>
          <Item>Participated Challenge 1</Item>
          <Item>Participated Challenge 2</Item>
          <Item>Participated Challenge 3</Item>
        </Grid>
      </Grid>
    </Box>
  );
};
