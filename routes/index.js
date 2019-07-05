const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('hallowww brasil!');
});

module.exports = router;