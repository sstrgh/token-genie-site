import { Stack } from '@mui/material';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { Item } from '../components/Item';
import { Button} from "../components";

export const Challenges = () => {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
            <Grid item xs={8}>
                <h1>Challenges You Have Created</h1> 
                <Item>My Challenge 1</Item>
                <Item>My Challenge 2</Item>
                <Item>My Challenge 3</Item>
            </Grid>
            <Grid item sx={{mt: 5}} xs={4}>
                <Button >Create a new challenge</Button>
            </Grid>
            <Grid item xs={8}>
                <h1>Challenges You Can Complete</h1> 
                <Item>Participated Challenge 1</Item>
                <Item>Participated Challenge 2</Item>
                <Item>Participated Challenge 3</Item>
            </Grid>
            </Grid>
        </Box>
    )
  }