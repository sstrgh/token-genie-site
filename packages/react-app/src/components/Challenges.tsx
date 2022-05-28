import { Stack, TextareaAutosize } from "@mui/material";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { Item } from "../components/Item";
import { Button } from "../components";
import TextField from "@mui/material/TextField";
import { ethers } from "ethers";
import challenges from "../challenges.json";
import React, { useState } from "react";

export const Challenges = () => {
  const contractAddress = "0xE0fbFD3110bB285eF6F38982EEF15E825Ad3d629";
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, challenges.abi, signer);

  const [challengeData, setChallengeData] = useState({
    stars: "",
    description: "",
  });

  const setHandler = (event: any) => {
    event.preventDefault();
    contract.createChallenge(event.target.stars.value, event.target.description.value);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <h1>Challenges You Have Created</h1>
          <Item>My Challenge 1</Item>
          <Item>My Challenge 2</Item>
          <Item>My Challenge 3</Item>
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
