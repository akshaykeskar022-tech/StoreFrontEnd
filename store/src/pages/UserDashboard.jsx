
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import {Box, Typography, Button, Grid, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress} from "@mui/material";
import api from "../services/api";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Navigate, useNavigate } from "react-router-dom";
import Login from "./Login";
import Badge from "@mui/material/Badge";



function UserDashboard() {
   //Get user info from context
  const navigate=useNavigate();
  const { user, setUser } = useContext(AuthContext);  
  const [loading, setLoading] = useState(false);
   //Get products from backend
  const[products, setProducts]=useState([]);
  const [cartCount, setCartCount] = useState(0);

  //Fetch cart count
  const fetchCartCount=async()=>
  {
    try{
      const response=await api.get(`/getCart/${user?.id}`);
      setCartCount(response.data?.items?.length ||0);
    }
    catch(error)
    {
      console.error("Error fetching cart count:", error);
      alert("Failed to fetch cart count");
    }
  }

  const fetchProducts=async()=>
  {
    try
    {
      setLoading(true);
      const response=await api.get("/getAllProducts");
      const data= await response.data;
      setProducts(data);
    }
    catch(error)
    {
      console.error("Error fetching products:", error);
      alert("Failed to fetch products");
    }
    finally
    {
      setTimeout(() => setLoading(false), 1000);
      //setLoading(false); //stop loading always run after try or catch
    }
  };
     //Call API only once when page opens
     useEffect(() =>
    {  
      if(!user?.id)//if user is not logged in, redirect to login page
      {
        navigate("/");
        return; //redirect to login page
      }
       fetchProducts(); 
       fetchCartCount();
    },[]);



  //dialog state
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const handleAddClick = (product) => {
    setSelectedProduct(product);
    setQuantity(1); // default quantity
    setOpen(true); // open dialog
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProduct(null);
  };

  const handleConfirmAdd =async()=> {
    console.log("Add to cart:", selectedProduct, "Qty:", quantity);

    //Call backend post API here for add to cart
    try{
       const reponse= await api.post("/addToCart", {
        userId: user?.id,
        productId: selectedProduct.id,
        quantity: quantity
       });
        alert(
         `${selectedProduct.productName} with quantity ${quantity} added to cart successfully` );
         console.log("Add to cart response:", reponse.data);
         fetchCartCount(); //update cart count in badge
         handleClose();
      }
      catch(error)
      {
        console.error("Error adding to cart:", error);
        alert("Failed to add to cart");
      }
  };

  const loadingSpinner=()=>
  {
    return(
      <Box
       sx={{display:"flex", alignItems:"center", justifyContent:"center",minHeight: "200px"}}>
         <CircularProgress/>
      </Box>
    );
  };

  const logout=()=>
  {
    const confirmed = window.confirm("Do you want to logout?");
    if (!confirmed) return; // if user clicks Cancel, do nothing
    setUser(null);
    navigate("/");
  }


  return (

    // minheight cover entire page and grow if content is more
    <Box sx={{ p: 4, minHeight: "100vh", bgcolor: "#f6f6f6", boxShadow:5}}>

      {/* <Typography variant="h5" mb={3} align="center">
        Welcome {user?.name}
      </Typography> */}

   <Box
  sx={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    mb: 3
  }}
>
  <Typography variant="h5">
    Welcome {user?.name}
  </Typography>

  {/* Right side buttons */}
  <Box sx={{ display: "flex", gap: 2 }}>
    <Badge badgeContent={cartCount} color="error">
     <Button
      variant="contained"
      startIcon={<ShoppingCartIcon />}
      size="small"
      onClick={() => navigate("/user/cart")}
     >
      View Cart
     </Button>
    </Badge>
    <Button
      variant="outlined"
      size="small"
      onClick={() =>  navigate("/user/order")}
    >
      View Orders
    </Button>

    <Button
      variant="outlined"
      color="error"
      onClick={() => logout()}
    >
      Logout
    </Button>
  </Box>
</Box>

      {loading ? loadingSpinner() :

      <Grid container spacing={7} sx={{p:7, margin:"auto"}}>
        {products.map((product) => (
          <Grid key={product.id} xs={4}>
            <Box
              sx={{
                p: 2,
                borderRadius: 3,
                boxShadow: 3,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between", //Place items with equal space BETWEEN them, and push them to edges
                minHeight: 140,
                bgcolor:"white"
              }}
            >
              <Box>
                <Typography variant="h6">
                  {product.productName}
                </Typography>
                <Typography color="text.secondary">
                  ₹{product.mrp}
                </Typography>
              </Box>

              <Button
                variant="contained"
                sx={{ mt: 1, borderRadius: 2 }}
                size="small"
                onClick={() => handleAddClick(product)}
              >Add to Cart
              </Button>
            </Box>
          </Grid>
        ))}
      </Grid>
     }
      {/* DIALOG BOX Design*/}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add to Cart</DialogTitle>

        <DialogContent>
          {selectedProduct && (
            <Box>
              <Typography>
                Product: {selectedProduct.productName}
              </Typography>

              <Typography sx={{ mt: 1 }}>
                Price: ₹{selectedProduct.mrp}
              </Typography>

              {/* Quantity Controls */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  mt: 2
                }}
              >
                <Button
                  variant="outlined"
                  size="small"
                  disabled={quantity === 1}
                  onClick={() =>
                    setQuantity((q) => Math.max(1, q - 1)) //avoid going below 1
                  }
                >
                  -
                </Button>

                <Typography>{quantity}</Typography>

                <Button
                  variant="outlined"
                  size="small"
                  onClick={() =>
                    setQuantity((q) => q + 1)
                  }
                >
                  +
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleConfirmAdd}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default UserDashboard;