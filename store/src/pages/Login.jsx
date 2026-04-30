import {Box, Button, Typography} from "@mui/material";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import api from "../services/api";

function Login(){

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate =useNavigate();
    const [showPassword, setShowPassword] = useState(false);


    const handleLogin = async() =>
        {
        try{
         const response=await api.post("/login", {email:email, password:password});
         alert(console.log)
        }
        catch(error)
        {
           alert("Login failed");
           console.error(error); 
        }
    }

    const handleToggle =()=>
    {
        setShowPassword((prev)=>!prev);
    }



    return(
        <Box
        sx={{
            display:"flex",
            flexDirection:"column",
            alignItems:"center",
            width:"300px",
            margin:"auto",
            p: 4,
            borderRadius: 4,
            boxShadow: 10,
            bgcolor: "white"
        }}>

            <Typography variant="h6" gutterBottom sx={{mb:2}}>Login in Store</Typography>

            <TextField 
            label="Email" 
            variant="outlined" 
            fullWidth 
            margin="normal" 
            sx={{
                "& .MuiOutlinedInput-root": {
                 borderRadius: 3,
               }}}
            onChange={(e)=>setEmail(e.target.value)}
            />

            <TextField 
            label="Password" 
            type={showPassword ? "text" : "password"}
            variant="outlined" 
            fullWidth 
            margin="normal" 
            sx={{
                "& .MuiOutlinedInput-root": {
                 borderRadius: 3,
               }}}
            onChange={(e)=>setPassword(e.target.value)}

            slotProps=
            {{
              input: {
               endAdornment: (
                 <InputAdornment position="end">
                   <IconButton onClick={handleToggle} edge="end" disabled={!password}>
                   {showPassword ? <VisibilityOff /> : <Visibility />}
                   </IconButton>
                 </InputAdornment>
                ),
              },
            }}
            />

            <Button variant="contained" color="primary" fullWidth sx={{mt:2, borderRadius:2}} onClick={handleLogin}>Login</Button>

             <Typography sx={{ mt: 2, color: "gray"  }} fullWidth margin="normal">OR</Typography>

            {/* <Typography sx={{mt:3, cursor:"pointer"}} gutterBottom  onClick={()=>navigate("/signup")} >New user?click here for Sign Up</Typography> */}
            
            <Typography sx={{ mt: 3 }} variant="body2"> 
                New user?{" "}
                <Link to="/signup">Sign up here</Link>
            </Typography>
        </Box>

    );
}

export default Login;