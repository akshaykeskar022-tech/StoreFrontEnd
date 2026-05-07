import {Box, Button, TextField, Typography} from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import api from "../services/api";


function SignUp()
{
   const [adminCode, setAdminCode]=useState ("");
    const [name, setName]=useState ("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate=useNavigate();
    const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = async () =>{
        try{
             const response = await api.post("/admin/signUp", {
                adminCode:adminCode,
                name: name,
                email: email,
                password: password
            });
            console.log(response.data);
             
            alert(name +" Sign up Successful");
            navigate("/");
        }
        catch(error)
        {
            alert(name +" Sign up Failed");
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

            <Typography variant="h6" gutterBottom>Sign up in Store</Typography>
            
            <TextField label="Admin Verification Code" variant="standard" fullWidth margin="normal" onChange={(e)=>setAdminCode(e.target.value)}/>
            <TextField label="Name" variant="standard" fullWidth margin="normal" onChange={(e)=>setName(e.target.value)}/>
            <TextField label="Email" type="email" variant="standard" fullWidth margin="normal" onChange={(e)=>setEmail(e.target.value)}/>
           
            <TextField label="Password" type={showPassword?"text":"password"}
                   variant="standard" fullWidth margin="normal" onChange={(e)=>setPassword(e.target.value)}
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
            <Button variant="contained" color="primary" fullWidth sx={{mt:2, borderRadius:2}} onClick={handleSignUp}>Sign Up</Button>
            {/* <Link sx={{mt:3, cursor:"pointer"}} gutterBottom  onClick={()=>navigate("/")} >Existing user? click here for Login</Link> */}
                
            <Typography sx={{ mt: 2, color: "gray"  }} margin="normal">OR</Typography>

            
            <Typography sx={{ mt: 3 }} variant="body2"> 
                Existing user?{" "}
                <Link to="/">Login here</Link>
            </Typography>

        </Box>
    );
}

export default SignUp;