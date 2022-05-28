import { Stack } from '@mui/material';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { Item } from '../components/Item';
import { Button} from "../components";



export const Prizes = () => {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
            <Grid item xs={8}>
                <h1>Prizes You Have Created</h1> 
                <Item>My Prize 1</Item>
                <Item>My Prize 2</Item>
                <Item>My Prize 3</Item>
            </Grid>
            <Grid item sx={{mt: 5}} xs={4}>           
                <Button>Create a new prize</Button>
            </Grid>
            <Grid item xs={8}>
                <h1>Prizes You Can Claim</h1> 
                <Item>Participated Prizes 1</Item>
                <Item>Participated Prizes 2</Item>
                <Item>Participated Prizes 3</Item>
            </Grid>
            </Grid>
        </Box>
    )
  }