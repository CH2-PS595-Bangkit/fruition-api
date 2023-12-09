// src/index.js atau aplikasi utama Anda
const express = require('express');
const app = express();
const routes = require('./routes/index.routes');

// Middleware, konfigurasi lainnya, dan penggunaan routes
app.use(express.json());
app.use(routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
