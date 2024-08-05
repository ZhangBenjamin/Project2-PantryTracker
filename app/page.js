'use client'
import { useState, useEffect, useCallback, useMemo } from "react";
import { firestore } from "@/firebase";
import { collection, deleteDoc, getDocs, doc, getDoc, setDoc, query } from "firebase/firestore";
import { Box, Button, Modal, Stack, TextField, Typography } from "@mui/material";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import SearchBar from './SearchBar'; // Import the new SearchBar component

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [amounts, setAmounts] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
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

  const addItem = async (item, amount) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + amount });
    } else {
      await setDoc(docRef, { quantity: amount });
    }

    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleAmountChange = useCallback((name, value) => {
    setAmounts((prev) => ({ ...prev, [name]: value }));
  }, []);

  const filteredInventory = useMemo(() => {
    return inventory.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [inventory, searchQuery]);

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      bgcolor="f0f0f0"
      alignItems="center"
      gap="2"
      spacing={2}
    >
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            Pantry Items
          </Typography>

          <Stack display="flex" flexDirection="row" gap={3} spacing={3}>
            <Button variant="contained" gap={5} spacing={2} onClick={handleOpen}>
              Add
            </Button>
          </Stack>

          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </Toolbar>
      </AppBar>
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid black"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: "translate(-50%, -50%)",
          }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="flex" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName, 1);
                setItemName('');
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Box bgcolor="white">
        <Stack width="1200px" height="600px" spacing={2} overflow="auto">
          {filteredInventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              minHeight="150px"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              padding={5}
            >
              <Typography variant="h6" color="#333" textAlign="center">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant="h6" color="#333" textAlign="center">
                Quantity: {quantity}
              </Typography>
              <Stack variant="h6" direction="row" spacing={2}>
                <TextField
                  id="outlined-number"
                  label="Amount"
                  type="number"
                  value={amounts[name] || ''}
                  onChange={(e) => handleAmountChange(name, parseInt(e.target.value))}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{ min: 0 }}
                />
                <Button variant="contained" onClick={() => addItem(name, amounts[name] || 0)}>
                  Update
                </Button>
                <Button variant="contained" onClick={() => removeItem(name)}>
                  Remove
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
