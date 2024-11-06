// app.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get('/test', (req, res) => {
  res.send('Test route is working!');
});

const electionRoutes = require('./routes/election');
app.use('/election', electionRoutes);

	
	