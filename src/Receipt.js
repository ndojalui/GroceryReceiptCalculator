import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#424242", // dark-gray
    },
    secondary: {
      main: "#bdbdbd", // light-gray
    },
    background: {
      default: "#000000", // black
    },
  },
  typography: {
    fontFamily: "Roboto",
  },
});

function Receipt() {
  const [total, setTotal] = useState(0);
  const [roommates, setRoommates] = useState([]);
  const [newRoommate, setNewRoommate] = useState({});
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    claimedBy: [],
    removedBy: [],
  });

  const handleRoommateChange = (event) => {
    setNewRoommate({ ...newRoommate, [event.target.name]: event.target.value });
  };

  const handleAddRoommate = () => {
    setRoommates([...roommates, newRoommate]);
    setNewRoommate({ name: "" });
  };

  const handleChange = (event) => {
    setNewItem({ ...newItem, [event.target.name]: event.target.value });
  };

  const handleAdd = () => {
    setItems([...items, newItem]);
    setNewItem({ name: "", cost: "", claimedBy: [], removedBy: [] });
  };

  const handleDelete = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleClaim = (roommateIndex, itemIndex) => {
    const newItems = [...items];
    const claimedBy = newItems[itemIndex].claimedBy;
    if (!claimedBy.includes(roommateIndex)) {
      claimedBy.push(roommateIndex);
      setItems(newItems);
    } else {
      const index = claimedBy.indexOf(roommateIndex);
      claimedBy.splice(index, 1);
      setItems(newItems);
    }
  };
  const handleRemoval = (roommateIndex, itemIndex) => {
    const newItems = [...items];
    const removedBy = newItems[itemIndex].removedBy;
    if (!removedBy.includes(roommateIndex)) {
      removedBy.push(roommateIndex);
      setItems(newItems);
    } else {
      const index = removedBy.indexOf(roommateIndex);
      removedBy.splice(index, 1);
      setItems(newItems);
    }
  };

  useEffect(() => {
    const newRoommates = roommates.map((roommate) => ({
      ...roommate,
      costToPay: 0,
    }));

    let remainingTotalCost = Number(total);

    items.forEach((item) => {
      remainingTotalCost -= Number(item.cost);

      item.claimedBy.forEach((index) => {
        const claimedRoommate = newRoommates[index];
        claimedRoommate.costToPay += Number(item.cost) / item.claimedBy.length;
      });

      const notRemovedCount =
        roommates.length -
        item.removedBy.length -
        (item.claimedBy.length === 0 ? 0 : 1);

      roommates.forEach((_, index) => {
        if (!item.removedBy.includes(index) && item.claimedBy.length === 0) {
          newRoommates[index].costToPay += Number(item.cost) / notRemovedCount;
        }
      });
    });

    newRoommates.forEach((roommate) => {
      roommate.costToPay += remainingTotalCost / roommates.length;
    });

    setRoommates(newRoommates);
  }, [items, roommates, total]);

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          color="textPrimary"
          align="center"
          sx={{ textTransform: "uppercase", marginBottom: 2 }}
        >
          Grocery Bill Calculator
        </Typography>

        {/* Total cost form */}
        <Grid container spacing={2} alignItems="center" marginBottom={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              required
              type="number"
              name="total"
              label="Total Cost"
              value={total}
              onChange={(event) => setTotal(event.target.value)}
            />
          </Grid>
        </Grid>

        {/* Receipt table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Roommate</TableCell>
                <TableCell align="right">Total Cost</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {roommates.map((roommate, index) => (
                <TableRow key={index}>
                  <TableCell component="th" scope="row">
                    {roommate.name}
                  </TableCell>
                  <TableCell align="right">
                    {roommate.costToPay ? roommate.costToPay.toFixed(2) : 0}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell component="th" scope="row">
                  Total
                </TableCell>
                <TableCell align="right">{Number(total).toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        {/* Add roommate form */}
        <Grid container spacing={2} alignItems="center" marginBottom={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              required
              name="name"
              label="Roommate Name"
              value={roommates.name}
              onChange={handleRoommateChange}
            />
          </Grid>
          <Grid item xs={6} sm={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddRoommate}
            >
              Add Roommate
            </Button>
          </Grid>
        </Grid>
        {/* Add item form */}
        <Grid container spacing={2} alignItems="center" marginBottom={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              required
              name="name"
              label="Item Name"
              value={newItem.name}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={6} sm={3}>
            <TextField
              fullWidth
              required
              type="number"
              name="cost"
              label="Cost"
              value={newItem.cost}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6} sm={2}>
            <Button variant="contained" color="primary" onClick={handleAdd}>
              Add Item
            </Button>
          </Grid>
        </Grid>
        {/* Item list */}
        <Grid container spacing={2}>
          {items.map((item, index) => (
            <Grid item xs={12} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {item.name}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Cost: ${item.cost}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Claimed by:{" "}
                    {item.claimedBy.length > 0
                      ? item.claimedBy
                          .map((index) => roommates[index].name)
                          .join(", ")
                      : "none"}
                  </Typography>
                  <Typography variant="body1">
                    Removed by:{" "}
                    {item.removedBy.length > 0
                      ? item.removedBy
                          .map((index) => roommates[index].name)
                          .join(", ")
                      : "none"}
                  </Typography>
                  <Grid container spacing={2} marginTop={2}>
                    {roommates.map((roommate, roommateIndex) => (
                      <Grid item key={index}>
                        <Typography variant="body1">{roommate.name}</Typography>
                        <Button
                          variant="outlined"
                          color="primary"
                          disabled={item.removed}
                          onClick={() => handleClaim(roommateIndex, index)}
                        >
                          Claim
                        </Button>
                        <Button
                          variant="outlined"
                          color="primary"
                          disabled={item.removed}
                          onClick={() => handleRemoval(roommateIndex, index)}
                        >
                          Remove
                        </Button>
                      </Grid>
                    ))}
                    <Grid item>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => handleDelete(index)}
                      >
                        Remove Item
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Summary */}
        <Grid container spacing={2} marginTop={2}>
          <Grid item xs={12}>
            <Typography variant="h5">Summary</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1" gutterBottom>
              Total Cost: ${total}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1" gutterBottom>
              Total Items: {items.length}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Total Claimed Items:{" "}
              {items.filter((item) => item.claimedBy.length > 0).length}
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default Receipt;
