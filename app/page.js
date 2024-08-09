'use client'
import { useState, useEffect } from "react";
import Image from "next/image";
import { firestore } from "../firebase";
import {
  AppBar,
  Toolbar,
  Box,
  Modal,
  Stack,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
} from "@mui/material";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  setDoc,
  query,
} from "firebase/firestore";

export default function Home() {
  // State variables
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredInventory, setFilteredInventory] = useState([]);

  // Update inventory when the page loads
  useEffect(() => {
    updateInventory();
  }, []);

  // Update inventory
  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
    setFilteredInventory(inventoryList); // Update filtered list as well
  };

  // Add item to inventory
  const addItem = async (item) => {
    if (!item) return;
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    // If item exists, increment quantity
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    }
    // Item does not exist, add item to inventory
    else {
      await setDoc(docRef, { quantity: 1 });
    }

    await updateInventory();
  };

  // Remove item from inventory
  const removeItem = async (item) => {
    const docRef = doc(firestore, "inventory", item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }

    await updateInventory();
  };

  // Handle open and close of modal
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = inventory.filter((item) =>
      item.name.toLowerCase().includes(query)
    );
    setFilteredInventory(filtered);
  };

  return (
    <Box 
      width="100vw" 
      height="100vh" 
      display="flex" 
      flexDirection="column"
      alignItems="center" 
      justifyContent="center" 
      gap={2}
    >
      <Modal open={open} onClose={handleClose}>
  <Box 
    sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 400,
      bgcolor: 'background.paper', // Use a background color from your theme
      boxShadow: 24,
      p: 4,
    }}
  >
    <Stack spacing={2}>
      <TextField label="Item Name" value={itemName} onChange={(e) => setItemName(e.target.value)} />
      <Button variant="outlined" onClick={() => {
        addItem(itemName);
        setItemName('');
        handleClose(); 
      }}>
        Add Item
      </Button>
    </Stack>
  </Box>
</Modal>


      <TextField 
        label="Search inventory items"
        value={searchQuery}
        onChange={handleSearchChange}
      />

      <Button variant="contained" onClick={handleOpen}>
        Add New Item
      </Button>

      
      <Grid
        container spacing={2}
        justifyContent="center"
        sx={{width: 800}} // set fixed width for the grif container
      > 
          {filteredInventory.map(({ name, quantity }) => (
            <Grid item xs={12} sm={6} md={4} key={name}> 
              <Card> 
                <CardContent>
                  <Typography variant="h5" component="div">
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">  

                    Quantity: {quantity}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={()  => addItem(name)}>Add</Button>
                  <Button size="small" onClick={() => removeItem(name)}>Remove</Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
    </Box>
  );
}