import { Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { Item } from "../components/Item";
import { Button } from "../components";
import TextField from "@mui/material/TextField";
import { ethers } from "ethers";
import challenges from "../challenges.json";
import { useEffect, useState } from "react";
import { useEthers } from "@usedapp/core";

export const Challenges = () => {
  const { account } = useEthers();
  const [challengeData, setChallengeData] = useState<any[]>([]);
  const [participatingChallengeData, setParticipatingChallengeData] = useState<
    any[]
  >([]);

  const contractAddress = "0xE0fbFD3110bB285eF6F38982EEF15E825Ad3d629";
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const contract = new ethers.Contract(contractAddress, challenges.abi, signer);

  useEffect(() => {
    async function getMyChallenges(account: any) {
      const myChallenges = await contract.getMyChallenges(account);
      let length = myChallenges.length;
      for (let i = 0; i < length; i++) {
        let id = ethers.BigNumber.from(myChallenges[i]).toNumber();

        // Clears List and recreates it
        if (challengeData.length !== 0) {
          setChallengeData([]);
        }

        const challenge = contract.getChallenge(id, account);
        challenge.then(function(response: any) {
          let id = response[0];
          let description = response[2];
          let stars = ethers.BigNumber.from(response[3]).toNumber();
          addChallenge(id, stars, description);
        });
      }
    }

    function addChallenge(id: any, stars: any, description: any) {
      let obj = {
        id: id,
        stars: stars,
        description: description,
      };
      setChallengeData((challengeData) => [...challengeData, obj]);
    }

    getMyChallenges(account);
  }, []);

  useEffect(() => {
    function addParticipatingChallenge(id: any, stars: any, description: any) {
      let obj = {
        id: id,
        stars: stars,
        description: description,
      };
      setParticipatingChallengeData((participatingChallengeData) => [
        ...participatingChallengeData,
        obj,
      ]);
    }

    async function getMyParticipatingChallenges(account: any) {
      const participatingChallengeData = await contract.getParticipatingChallenges(
        account
      );
      // Clears List and recreates it
      if (participatingChallengeData.length !== 0) {
        setParticipatingChallengeData([]);
      }
      let length = participatingChallengeData.length;
      for (let i = 0; i < length; i++) {
        let id = ethers.BigNumber.from(
          participatingChallengeData[i]
        ).toNumber();
        const challenge = contract.getChallenge(id, account);
        challenge.then(function(response: any) {
          let id = response[0];
          let description = response[2];
          let stars = ethers.BigNumber.from(response[3]).toNumber();
          addParticipatingChallenge(id, stars, description);
        });
      }
    }
    getMyParticipatingChallenges(account);
  }, []);

  const setHandler = (event: any) => {
    event.preventDefault();
    contract
      .createChallenge(event.target.stars.value, event.target.description.value)
      .catch((error: any) => {
        console.error(error);
      });
  };

  const setAddParticipantsHandler = (event: any) => {
    event.preventDefault();
    contract
      .approveUser(
        event.target.participantAddress.value,
        event.target.challengeId.value
      )
      .catch((error: any) => {
        console.error(error);
      });
  };

  const [challengCompleteError, setChallengCompleteError] = useState(null);
  const setChallengComplete = (event: any) => {
    event.preventDefault();
    contract
      .challengeComplete(event.target.challengeId.value)
      .catch((error: any) => {
        setChallengCompleteError(error.reason);
      });
  };

  const [approveChallengeError, setApproveChallengeError] = useState(null);
  const approveChallenge = (event: any) => {
    event.preventDefault();
    contract
      .approveChallengeComplete(
        event.target.participantAddress.value,
        event.target.challengeId.value
      )
      .catch((error: any) => {
        setApproveChallengeError(error.reason);
      });
  };

  return (
    <Grid container>
      <Grid container spacing={2} margin={1}>
        <Grid item xs={6}>
          <Typography variant="h3" component="h2" color={"hotpink"}>
            Challenges You Have Created
          </Typography>
          {challengeData.map((item: any) => {
            let id = ethers.BigNumber.from(item["id"]).toNumber();
            let description = item["description"];
            let stars = item["stars"];
            return (
              <Item key={id}>
                <h2> Challenge {id}</h2> <p> {description}</p>{" "}
                <p>Stars to Earn: {stars}</p>
              </Item>
            );
          })}
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h3" component="h2" color={"hotpink"}>
            Participating Challenges
          </Typography>{" "}
          {participatingChallengeData.map((item: any) => {
            let id = ethers.BigNumber.from(item["id"]).toNumber();
            let description = item["description"];
            let stars = item["stars"];
            return (
              <Item key={id}>
                <h2> Challenge {id}</h2> <p> {description}</p>{" "}
                <p>Stars to Earn: {stars}</p>
              </Item>
            );
          })}
        </Grid>
      </Grid>
      <Grid
        container
        spacing={2}
        margin={2}
        padding={1}
        sx={{ border: 3, borderColor: "primary.main" }}
      >
        <Grid item xs={12}>
          <Typography variant="h3" component="h2" color={"hotpink"}>
            Control Panel
          </Typography>
        </Grid>
        <Grid mb={2} item>
          <Typography variant="h5" component="h2" color={"hotpink"}>
            Create New Challenge
          </Typography>
          <form onSubmit={setHandler}>
            <Stack mt={1} spacing={2}>
              <TextField
                inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                style={{ width: "400px", margin: "5px" }}
                sx={{
                  fieldset: {
                    borderColor: "hotpink",
                  },
                  bgcolor: "white",
                }}
                name="stars"
                label="Stars To Be Awarded (Numbers Only)"
                variant="filled"
              />
              <TextField
                style={{ width: "400px", margin: "5px" }}
                name="description"
                type="text"
                label="Challenge Description"
                variant="filled"
                multiline
                rows={10}
                sx={{
                  fieldset: {
                    borderColor: "hotpink",
                  },
                  bgcolor: "white",
                }}
              />
              <Button
                style={{ width: "400px", margin: "5px" }}
                type={"submit"}
                variant="contained"
                color="primary"
              >
                Submit
              </Button>
            </Stack>
          </form>
        </Grid>
        <Grid item>
          <Typography variant="h5" component="h2" color={"hotpink"}>
            Add Approved Participants
          </Typography>
          <form onSubmit={setAddParticipantsHandler}>
            <Stack mt={1} spacing={2}>
              <TextField
                style={{ width: "400px", margin: "5px" }}
                sx={{
                  fieldset: {
                    borderColor: "hotpink",
                  },
                  bgcolor: "white",
                }}
                name="participantAddress"
                label="Participant Wallet Address"
                variant="filled"
              />
              <TextField
                inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                style={{ width: "400px", margin: "5px" }}
                sx={{
                  fieldset: {
                    borderColor: "hotpink",
                  },
                  bgcolor: "white",
                }}
                name="challengeId"
                label="Challenge ID"
                variant="filled"
              />
              <Button
                style={{ width: "400px", margin: "5px" }}
                type={"submit"}
                variant="contained"
                color="primary"
              >
                Add Approved Participant
              </Button>
            </Stack>
          </form>
        </Grid>
        <Grid item>
          <Typography variant="h5" component="h2" color={"hotpink"}>
            Complete Challenge
          </Typography>
          <form onSubmit={setChallengComplete}>
            <Stack mt={1} spacing={2}>
              <TextField
                inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                style={{ width: "400px", margin: "5px" }}
                sx={{
                  fieldset: {
                    borderColor: "hotpink",
                  },
                  bgcolor: "white",
                }}
                name="challengeId"
                label="Challenge ID"
                variant="filled"
                error={challengCompleteError ? true : false}
                helperText={challengCompleteError}
              />
              <Button
                style={{ width: "400px", margin: "5px" }}
                type={"submit"}
                variant="contained"
                color="primary"
              >
                Complete Challenge
              </Button>
            </Stack>
          </form>
        </Grid>
        <Grid item>
          <Typography variant="h5" component="h2" color={"hotpink"}>
            Approve Challenge
          </Typography>
          <form onSubmit={approveChallenge}>
            <Stack mt={1} spacing={2}>
              <TextField
                style={{ width: "400px", margin: "5px" }}
                sx={{
                  fieldset: {
                    borderColor: "hotpink",
                  },
                  bgcolor: "white",
                }}
                name="participantAddress"
                label="Participant Wallet Address"
                variant="filled"
              />
              <TextField
                inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                style={{ width: "400px", margin: "5px" }}
                sx={{
                  fieldset: {
                    borderColor: "hotpink",
                  },
                  bgcolor: "white",
                }}
                name="challengeId"
                label="Challenge ID"
                variant="filled"
                error={approveChallengeError ? true : false}
                helperText={approveChallengeError}
              />
              <Button
                style={{ width: "400px", margin: "5px" }}
                type={"submit"}
                variant="contained"
                color="primary"
              >
                Approve Challenge
              </Button>
            </Stack>
          </form>
        </Grid>
      </Grid>
    </Grid>
  );
};
