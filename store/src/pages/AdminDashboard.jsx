import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Box } from "@mui/material";

function AdminDashboard()
{
  const {user} =useContext(AuthContext)
  return(
   <Box>
     Welcome to Admin Dashboard {user?.name}
   </Box>
   )
}

export default AdminDashboard;