import { useContext, useEffect, useState } from "react";
import {Box,Typography,Button,CircularProgress,Table,TableBody,TableCell,
       TableContainer,TableHead,TableRow,Paper,Stack,
       Dialog, DialogTitle, DialogContent, DialogActions} from "@mui/material";

import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';


function CartPage() {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cartId, setCartId] = useState(null);

  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/getCart/${user?.id}`);
      setCart(response.data);
      setCartId(response.data.id);
    } catch (error) {
      console.error("Error fetching cart:", error);
      alert("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => 
    {
      if(!user?.id) 
      {
        navigate("/");
        return;
      }
    fetchCart();
  }, []);

  const handlePlaceOrder = async () => {
    try {
       const confirmed = window.confirm(`Do you want to place the order?`);
        if (!confirmed) return; // if user clicks Cancel, do nothing
      await api.post("/placeOrder", {
        userId: user?.id,
        cartId: cartId
      });

      alert("Order placed successfully!");
      setCart(null);
      setCartId(null);
      navigate("/user/order");

    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order");
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);

  const removeItem =async(item)=>
  {
    try{
        const confirmed = window.confirm(`Do you want to remove ${item?.productName} from the cart?`);
        if (!confirmed) return; // if user clicks Cancel, do nothing
        await api.post(`/cart/removeItem/${item?.id}`);
        fetchCart(); // Refresh cart after removal
        alert("Item removed from cart");
    }
    catch(error)
    {
        console.error("Error removing item:", error);
        alert("Failed to remove item");
    }
  }

  //dialog state
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);

  //handle open dialog
  const handelOpenUpdateDialog=(item)=>
  {
    setSelectedItem(item);
    setQuantity(item?.quantity || 1);
    setUpdateDialogOpen(true);
  }
  
  //handle close dialog
  const handleCloseUpdateDialog=()=>
  {
    setSelectedItem(null);
    setUpdateDialogOpen(false);
  }

  //API for update cart item quantity
  const handleUpdateQuantity=async()=>
  {
    try{
        await api.post("/cart/updateQuantity",{
            id:selectedItem?.id,
            quantity:quantity
        })
        alert(`Quantity ${quantity} updated successfully for ${selectedItem?.productName}!`);
        fetchCart();
        handleCloseUpdateDialog();
    }
    catch(error)
    {
      console.error("Error updating quantity:", error);
    alert("Failed to update quantity");
    }
  };


  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, minHeight: "100vh", bgcolor: "#f4f6f8" }}>

      {/* Header Card */}
      <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          🛒 My Cart
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Review your items before placing the order
        </Typography>
      </Paper>

      {/* Table */}
      {cart?.items?.length > 0 ? (
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 3,
            boxShadow: 3
          }}
        >
          <Table>

            {/* Header */}
            <TableHead sx={{ backgroundColor: "#1976d2" }}>
              <TableRow>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Product Name
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Price
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Quantity
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Subtotal
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            {/* Body */}
            <TableBody>
              {cart.items.map((item, index) => (
                <TableRow
                  key={index}
                  hover
                  sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}
                >
                  <TableCell>{item.productName}</TableCell>
                  <TableCell>{formatCurrency(item.mrp)}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{formatCurrency(item.subtotal)}</TableCell>
                  <TableCell>
                    <Button
                      color="primary"
                      variant="outlined"
                      size="small"
                      onClick={() => handelOpenUpdateDialog(item)}
                      sx={{ mr: 1 }}
                    >
                      Update
                    </Button>

                     <Button
                    //   color="error"
                    //   variant="text"
                      size="small"
                      onClick={() => removeItem(item)}
                      >
                       <DeleteOutlineOutlinedIcon />
                      </Button>
                   </TableCell>
                </TableRow>
              ))}
            </TableBody>

          </Table>
        </TableContainer>
      ) : (
        <Paper sx={{ p: 3, textAlign: "center" }}>
          <Typography>No items in cart</Typography>
        </Paper>
      )}

      {/* Total Box */}
      {cart && (
        <Paper
          elevation={3}
          sx={{
            mt: 3,
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderRadius: 2
          }}
        >
          <Typography variant="h6">
            Total Amount
          </Typography>

          <Typography variant="h6" color="success.main">
            {formatCurrency(cart.totalAmount)}
          </Typography>
        </Paper>
      )}

      {/* Buttons */}
      <Stack
        direction="row"
        spacing={2}
        // justifyContent="flex-end"
        sx={{ mt: 3 }}
      >
        <Button
          variant="outlined"
          onClick={() => navigate("/user/home")}
        >
          Back to Products
        </Button>

        <Button
          variant="contained"
          color="success"
          disabled={!cart?.items?.length}
          onClick={handlePlaceOrder}
        >
          Place Order
        </Button>
      </Stack>

    {/* Design Quantity Dialog */}
      <Dialog open={updateDialogOpen} onClose={handleCloseUpdateDialog}>
        <DialogTitle>Update Quantity</DialogTitle>
        <DialogContent>
          <Typography>
           Product: {selectedItem?.productName}
          </Typography>
          <Typography>
            Price: {formatCurrency(selectedItem?.mrp)}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
            <Button
              variant="outlined"
              size="small"
              disabled={quantity === 1}
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            >
              -
            </Button>
            <Typography>{quantity}</Typography>
            <Button variant="outlined" size="small"
              onClick={() => setQuantity((q) => q + 1)}>
              +
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpdateDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdateQuantity}>
            Update
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}

export default CartPage;