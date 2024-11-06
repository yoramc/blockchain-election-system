const express = require('express');
const router = express.Router();
const electionContract = require('../services/blockchainService');

router.get('/admin', async (req, res) => {
  try {
    const adminAddress = await electionContract.methods.admin().call();
    res.json({ admin: adminAddress });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
