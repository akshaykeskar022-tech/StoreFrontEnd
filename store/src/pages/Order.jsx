import { useContext, useEffect, useState } from "react";
import { Box,Typography,Button,CircularProgress,Table,TableBody,TableCell,TableContainer,
        TableHead,TableRow,Paper,Stack} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

function OrderHistoryPage() {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/getOrderHistory/${user?.id}`);
      setOrders(response.data); // should be List<OrderResponseDTO>

    } catch (error) {
      console.error("Error fetching orders:", error);
      alert("Failed to load orders");
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  };

  useEffect(() => {
    if (!user?.id) {
      navigate("/");
      return;
    }
    fetchOrders();
  }, []);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, minHeight: "100vh", bgcolor: "#f4f6f8" }}>
       <Box
        sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 3
        }} >
         <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
          📜 Order History
         </Typography>

         <Button variant="outlined" sx={{ mb: 3 }} onClick={() => navigate("/user/home")}>
          Back to Products
         </Button>
        </Box>

      {orders.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: "center" }}>
          <Typography>No orders found.</Typography>
        </Paper>
      ) : (
        orders.map((order) => (
          <Paper key={order.orderId} sx={{ p: 2, mb: 4, borderRadius: 2, boxShadow: 3 }}>
            {/* Order Info */}
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Order ID: {order.orderId}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                {new Date(order.createdAt).toLocaleString()}
              </Typography>
            </Box>

            {/* Items Table */}
            <TableContainer component={Paper} sx={{ mb: 2, borderRadius: 2 }}>
              <Table>
                <TableHead sx={{ backgroundColor: "#1976d2" }}>
                  <TableRow>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Product Name</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Price</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Quantity</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Subtotal</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.orderItemResponseDTOList.map((item, index) => (
                    <TableRow key={index} hover sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}>
                      <TableCell>{item.productName}</TableCell>
                      <TableCell>{formatCurrency(item.mrp)}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{formatCurrency(item.subtotal)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Total */}
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Typography variant="h6" fontWeight="bold">
                Total: {formatCurrency(order.totalAmount)}
              </Typography>
            </Box>
          </Paper>
        ))
      )}

      {/* Back to Products */}
      <Stack direction="row" justifyContent="flex-end">
        <Button variant="outlined" onClick={() => navigate("/user/home")}>
          Back to Products
        </Button>
      </Stack>
    </Box>
  );
}

export default OrderHistoryPage;