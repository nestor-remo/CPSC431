
// SETUP STATEMENTS (DO NOT MODIFY)
import { error } from 'console';
import express from 'express';
import fs from 'fs/promises';
import { parse } from 'path';
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.static('public'));
// END SETUP STATEMENTS

// STUDENT CODE AREA (Add your Custom Functions Here)

// Convert this function to async/await format
async function getCollection(req, res) {
    // Implement Code to get all pets in a collection
    try {
        const collection = req.params.collection;
        const data = await fs.readFile('data.json');
        const result = JSON.parse(data);
        console.log(result);
        if (result[collection]) {
            res.status(200).json(result[collection]);
        } else {
            res.status(404).json({ error: 'Collection not found' });
        }
    } catch (error) {
        res.status(404).json( { error: error.message });
        console.log('Unable to get collection')
        console.log('Error:', error.message);
    }
}

async function getItem(req, res) {
  // Implement Code to get 1 pet with an Id
  try {
    const id = parseInt(req.params.id);
    const collection = req.params.collection;
    const data = await fs.readFile('data.json');
    const result = JSON.parse(data);
    if (result[collection]) {
      const item = result[collection][id];
      if (item) {
        res.status(200).json(item);
      } else {
        res.status(404).json({ error: 'Item not found' });
      }
    } else {
      res.status(404).json({ error: 'Collection not found' });
    }
  } catch (error) {
    res.status(404).json( { error: error.message });
    console.log('Unable to get pet ID');
    console.log('Error:', error.message);
  }
}

async function postItem(req, res) {
  // Implement Code to add 1 pet with new data
  try {
    const { name, type, age, breed } = req.body;
    if (!name || !type || !age || !breed) {
      return res.status(404).json({ error: 'Missing required fields' });
    }

    const data = JSON.parse(await fs.readFile('data.json'));
    
    const newId = data.pets.length ? data.pets[data.pets.length - 1].id + 1 : 1;

    const newItem = {
        id: newId,
        name,
        type,
        age,
        breed
    }

    data.pets.push(newItem);
    await fs.writeFile('data.json', JSON.stringify(data));
    res.status(200).json({ message: 'Item added successfully', item: newItem });

  } catch (error) {
    res.status(404).json( { error: error.message });
    console.log('Unable to add new pet');
    console.log('Error:', error.message);
  }
}

async function putItem(req, res) {
  // Implement Code to update 1 pet with an Id and new data
  try {
    const id = parseInt(req.params.id);
    const { name, type, age, breed } = req.body;

    if (!name || !type || !age || !breed) {
      return res.status(404).json({ error: 'Missing required fields' });
    }

    const data = JSON.parse(await fs.readFile('data.json'));

    const itemIndex = data.pets.findIndex(item => item.id === id);

    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const updatedItem = {
      id,
      name,
      type,
      age,
      breed
    };

    data.pets[itemIndex] = updatedItem;
    await fs.writeFile('data.json', JSON.stringify(data));
    
    res.status(200).json({ message: 'Item updated successfully', item: updatedItem });
  } catch (error) {
    res.status(404).json( { error: error.message });
    console.log('Unable to update pet');
    console.log('Error:', error.message);
  }
}

async function deleteItem(req, res) {
  // Implement Code to delete 1 pet with an Id
  try {
    const id = parseInt(req.params.id);
    const collection = req.params.collection;

    const data = JSON.parse(await fs.readFile('data.json'));
    const itemIndex = data[collection].findIndex(item => item.id === id);
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found' });
    }
    data[collection].splice(itemIndex, 1);
    await fs.writeFile('data.json', JSON.stringify(data));
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(404).json( { error: error.message });
    console.log('Unable to delete pet');
    console.log('Error:', error.message);
  }
}

// This function is just for illustration purposes
// You can delete it if you want
async function demoFunction(req, res) {
  // Exract the ":collection" and ":id" parameters from the URL
  const collection = req.params.collection;
  const id = req.params.id;
  // Create a message string
  let message = `Collection Requested: ${collection}, ID Requested: ${id}`;
  // Create a JSON object
  let JsonOutput = {
    "collection": collection,
    "id": id,
    "message": message
  };
  // Output a 200 status code and the JSON object
  res.status(200).json(JsonOutput);
}

app.get('/api/demo/:collection/:id', demoFunction);

// END STUDENT CODE AREA

// API ROUTES (DO NOT MODIFY)
app.get('/api/getItem/:collection/:id', getItem);
app.get('/api/getCollection/:collection', getCollection);
app.post('/api/postItem/:collection', postItem);
app.put('/api/putItem/:collection/:id', putItem);
app.delete('/api/deleteItem/:collection/:id', deleteItem);
//END API ROUTES

// FINAL SETUP (DO NOT MODIFY)
app.get('/', (req, res) => {
  res.redirect('/test.html');
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});