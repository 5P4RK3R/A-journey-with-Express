const express = require('express');
const app = express();
app.use(express.json()); // json Middleware
const PORT = 8000;
app.get('/', (req,res) => res.send('Express + TypeScript Server'));
app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});