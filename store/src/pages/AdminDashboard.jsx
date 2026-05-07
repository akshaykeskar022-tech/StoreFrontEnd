import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Button,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,TableContainer,
  CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions,Paper
} from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import TextField from "@mui/material/TextField";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';



function AdminDashboard() {
  const [tab, setTab] = useState("products");
  const { user,setUser } = useContext(AuthContext);
  const navigate = useNavigate();``

  // 🔹 Products state
  const [products, setProducts] = useState([]);
  const [productId, setProductId]=useState(null);

  //Order State
  const [orders, setOrders] = useState([]);

  //Customers state
  const [customers, setCustomers] = useState([]);

  const [loading, setLoading] = useState(false);


  const logout = () => {
    const confirmed = window.confirm("Do you want to logout?");
    if (!confirmed) return; // if user clicks Cancel, do nothing
    setUser(null);
    navigate("/");
  };

   const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);

  // 🔹 Fetch Products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/getAllProducts");
      setProducts(response.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      alert("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  //fetch orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/getAllOrders");
      setOrders(response.data); // should be List<OrderResponseDTO>

    } catch (error) {
      console.error("Error fetching orders:", error);
      alert("Failed to load orders");
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  };

  //fetch customers
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/getUsers");
      setCustomers(response.data); //List<CustomerResponseDTO>
    } catch (error) {
      console.error("Error fetching customers:", error);
      alert("Failed to load customers");
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  };

  // 🔹 Load products when tab changes
  useEffect(() => {
    if (tab === "products") {
      fetchProducts();
    }
    if (tab === "orders") {
      fetchOrders();
    }
    if (tab === "customers") {
      fetchCustomers();
    }
  }, [tab]);

  //State for create product dialog 
  const [openProductDialog, setOpenProductDialog] = useState(false);
  const [openProductUpdateDialog, setOpenProductUpdateDialog] = useState(false);

  const [productForm, setProductForm] = useState({
    productName: "",
    mrp: ""
  });
  
  //For Custome Dialog
  const [openCustomerDialog, setOpenCustomerDialog] = useState(false);
   const [customerForm, setCustomerForm] = useState({
    name: "",
    email: "",
    password: "",
    role: ""
  });

  const handleProductChange = (e) => {
  const { name, value } = e.target;

  //Update product form state
  setProductForm((prev) => ({
      ...prev,
       [name]: value
    }));
  };

  //update customer form state
  const handleCustomerChange = (e) => {
    const { name, value } = e.target;

    //Update customer form state
    setCustomerForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  //Handle create product API call
  const handleCreateProduct = async () => {
  try {
    const payload = {
      productName: productForm.productName,
      mrp: Number(productForm.mrp) // ensure number
    };

    const response = await api.post("admin/addProduct", payload);
    alert(response.data || "Product created successfully");

    // refresh product list
    fetchProducts();

    // reset form
    setProductForm({
      productName: "",
      mrp: ""
    });

    setOpenProductDialog(false);

  } catch (error) {
    console.error("Error creating product:", error);
    alert("Failed to create product");
  }
};

const handleUpdateProduct = async () => {
  try{
      const response=await api.put("/admin/updateProduct",{
        id:productId,
        productName:productForm.productName,
        mrp:Number(productForm.mrp)
      })
      alert("Product updated successfully");
      fetchProducts();
      setOpenProductUpdateDialog(false);
      setProductForm({
        productName: "",
        mrp: ""
      });
      setProductId(null);
  }
  catch(error)  {
    console.error("Error updating product:", error);
    alert("Failed to update product");
  }
}

const handleCreateCustomer = async () => {
  try {
    const payload = {
      name: customerForm.name,
      email: customerForm.email,
      password: customerForm.password,
      role: customerForm.role
    };
    const response = await api.post("/admin/createCustomer", payload);
    alert(response.data || "Customer created successfully");

    // refresh customer list
    fetchCustomers();
    // reset form
    setCustomerForm({
      name: "",
      email: "",
      password: "",
      role: ""
    });
    setOpenCustomerDialog(false);
    }
    catch (error) {
    console.error("Error creating customer:", error);
    alert("Failed to create customer");
    }
  } 

 const handleProductClose = () => {
    setOpenProductDialog(false);
    setProductForm({
      productName: "",
      mrp: ""
    });
  };


  const handleCustomerClose = () => {
    setOpenCustomerDialog(false);
    setCustomerForm({
      name: "",
      email: "",
      password: "",
      role: ""
    });
  };

  const removeProduct = async (product) => {
    try{
      const confirmed = window.confirm(`Do you want to remove ${product.productName} from products?`);
      if (!confirmed) return; // if user clicks Cancel, do nothing
      await api.delete(`/admin/removeProduct/${product.id}`);
      alert(`${product.productName} removed successfully`);
      fetchProducts(); // refresh list
    } 
    catch (error) {
      console.error("Error removing product:", error);
      alert("Failed to remove product");
    }
  }
  const removeCustomer = async (customer) => {
    try{
        const confirmed=window.confirm(`Do you want to remove ${customer.name} from customers?`);
        if(!confirmed) return; // if user clicks Cancel, do nothing
        await api.delete(`/admin/removeUser/${customer.id}`);
        alert(`${customer.name} removed successfully`);
        fetchCustomers(); // refresh list
    }
    catch(error)    {
        console.error("Error removing customer:", error);
        alert("Failed to remove customer");
  }
}
  const handleOpenProductUpdateDialog=(product)=>
  {  
     setProductId(product.id);
     setProductForm({
      productName: product.productName,
      mrp: product.mrp
    });
    setOpenProductUpdateDialog(true);
  }

  // 🔹 PRODUCTS UI METHOD
  const renderProducts = () => (
    <Box>
      <Typography variant="h6" mb={2}>
        Products List
      </Typography>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <CircularProgress />
        </Box>
      ) : products.length === 0 ? (
         <Box sx={{ textAlign: "center", mt: 3 }}>
           No products found
         </Box>
         ) : (
        <TableContainer
         component={Paper}
         sx={{
           maxHeight: 430,   // table height
        overflowY: "auto"}}>
        <Table stickyHeader>
          <TableHead >
            <TableRow>
              <TableCell><b>SR No</b></TableCell>
              <TableCell><b>Product Name</b></TableCell>
              <TableCell><b>Price (₹)</b></TableCell>
              <TableCell ><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {products.map((product, index) => (
              <TableRow key={product.id}
              hover
                  sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{product.productName}</TableCell>
                <TableCell>{product.mrp}</TableCell>
                <TableCell>
                    <Button 
                      size="small" color="primary" variant="outlined"
                      onClick={() => handleOpenProductUpdateDialog(product)}>
                      Update
                    </Button>

                     <Button
                      size="small"
                      onClick={() => removeProduct(product)}
                      >
                       <DeleteOutlineOutlinedIcon />
                      </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </TableContainer>
      )}

      {/* Bottom Center Button */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Button variant="contained" 
        onClick={() => setOpenProductDialog(true)}>
          Create Product
        </Button>
      </Box>
      
    {/* Dialog */}
    <Dialog
      open={openProductDialog}
      onClose={() => setOpenProductDialog(false)}
      fullWidth
    >
      <DialogTitle>Create Product</DialogTitle>

      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          mt: 1,
        }}
      >
        <TextField
          label="Product Name"
          variant="standard"
          name="productName"
          value={productForm.productName}
          onChange={handleProductChange}
          fullWidth
        />

        <TextField
          label="MRP"
          variant="standard"
          name="mrp"
          type="number"
          value={productForm.mrp}
          onChange={handleProductChange}
          fullWidth
        />
      </DialogContent>

      <DialogActions   sx={{mb: 2, mr:4}} >
        <Button onClick={handleProductClose}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleCreateProduct}
          disabled={!productForm.productName || !productForm.mrp}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>

   {/* Update Product Dialog */}
     <Dialog
     open={openProductUpdateDialog}
      onClose={() => setOpenProductUpdateDialog(false)}
      fullWidth>
      <DialogTitle>Update Product</DialogTitle>

        <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          mt: 1,
        }}>
          <TextField
            label="Product Name"
            variant="standard"
            name="productName"
            value={productForm.productName}
            onChange={handleProductChange}
            fullWidth
          />
          <TextField
            label="MRP"
            variant="standard"
            name="mrp"
            type="number"
            value={productForm.mrp}
            onChange={handleProductChange}
            fullWidth
          />
        </DialogContent>

        <DialogActions   sx={{mb: 2, mr:4}} >
        <Button onClick={()=>setOpenProductUpdateDialog(false)}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleUpdateProduct}
          disabled={!productForm.productName || !productForm.mrp}
        >
          Submit
        </Button>
      </DialogActions>

     </Dialog>
    </Box>
  );

  // 🔹 ORDERS UI METHOD
  const renderOrders = () => 
    (
     <Box>
      <Typography variant="h6" sx={{ mb: 4 }}>
        Order List
      </Typography>
       {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <CircularProgress />
        </Box>
      ) : orders.length === 0 ? (
         <Box sx={{ textAlign: "center", mt: 3 }}>
           No orders found
         </Box>
         ) : (
        orders.map((order) => (
          <Paper key={order.orderId} sx={{ p: 2, mb: 4, borderRadius: 2, boxShadow: 3 }}>
            {/* Order Info */}
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Customer Name: {order.userName}
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
    </Box>    
    
  );

  // 🔹 CUSTOMERS UI METHOD
  const renderCustomers = () => (
   <Box>
      <Typography variant="h6" mb={2}>
        Customer List
      </Typography>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <CircularProgress />
        </Box>
      ) : customers.length === 0 ? (
         <Box sx={{ textAlign: "center", mt: 3 }}>
           No customers found
         </Box>
         ) : (
        <TableContainer
         component={Paper}
         sx={{
           maxHeight: 430,   // table height
        overflowY: "auto"}}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell><b>SR No</b></TableCell>
              <TableCell><b>Name</b></TableCell>
              <TableCell><b>Email</b></TableCell>
              <TableCell><b>Role</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {customers.map((customer, index) => (
              <TableRow key={index}
              hover
                  sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.role}</TableCell>
                <TableCell>

                     <Button
                      size="small"
                      onClick={() => removeCustomer(customer)}
                      >
                       <DeleteOutlineOutlinedIcon />
                      </Button>
                   </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </TableContainer>
      )} 

       {/* Bottom Center Button */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Button variant="contained" 
        onClick={() => setOpenCustomerDialog(true)}>
          Add Customer
        </Button>
      </Box> 

      {/* Dialog */}
    <Dialog
      open={openCustomerDialog}
      onClose={() => setOpenCustomerDialog(false)}
      fullWidth
    >
      <DialogTitle>Add Customer</DialogTitle>

      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          mt: 1,
        }}
      >
        <TextField
          label="Name"
          variant="standard"
          name="name"
          value={customerForm.name}
          onChange={handleCustomerChange}
          fullWidth
        />

        <TextField
          label="Email"
          variant="standard"
          name="email"
          type="email"
          value={customerForm.email}
          onChange={handleCustomerChange}
          fullWidth
        />
        <TextField
          label="Password"
          variant="standard"
          name="password"
          type="password"
          value={customerForm.password}
          onChange={handleCustomerChange}
          fullWidth
        />
        <TextField
          label="Role"
          variant="standard"
          name="role"
          value={customerForm.role}
          onChange={handleCustomerChange}
          fullWidth
        />
      </DialogContent>

      <DialogActions   sx={{mb: 2, mr:4}} >
        <Button onClick={handleCustomerClose}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleCreateCustomer}
          disabled={!customerForm.name || !customerForm.email || !customerForm.password || !customerForm.role}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
     
    </Box> 
   );

  // 🔹 SWITCH METHOD
  const renderContent = () => {
    switch (tab) {
      case "products":
        return renderProducts();

      case "orders":
        return renderOrders();

      case "customers":
        return renderCustomers();

      default:
        return renderProducts();
    }
  };

  return (
    // <Box sx={{ p: 4, minHeight: "100vh", bgcolor: "#f6f6f6" }}>
      <Box sx={{ minHeight: "100vh", bgcolor: "#f6f6f6" }}>


      {/* 🔷 TOP MENU */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          // mb: 3,
              position: "sticky",
        top: 0,
        zIndex: 1000,

        bgcolor: "#f6f6f6",
        py: 2,
        }}
      >
        <Box 
          sx={{
            display:"flex",
            flexDirection:"column",
            alignItems:"left",
            ml:2
          }}
          >
          <Typography variant="h7">Welcome, {user?.name}</Typography>
          <Typography variant="h6">Admin Dashboard</Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 2,mr:2 }}>
          <Button
            variant={tab === "products" ? "contained" : "outlined"}
            onClick={() => setTab("products")}
          >
            Products
          </Button>

          <Button
            variant={tab === "customers" ? "contained" : "outlined"}
            onClick={() => setTab("customers")}
          >
            Customers
           </Button>

          <Button
            variant={tab === "orders" ? "contained" : "outlined"}
            onClick={() => setTab("orders")}
          >
            Orders
          </Button>

          <Button
            variant="outlined"
            color="error"
            onClick={logout}
          >
            Logout
          </Button>
        </Box>
      </Box>

      {/* 🔽 CONTENT */}
      <Box sx={{ bgcolor: "white", p: 3, borderRadius: 2, boxShadow: 2 }}>
        {renderContent()}
      </Box>
    </Box>
  );


}

export default AdminDashboard;