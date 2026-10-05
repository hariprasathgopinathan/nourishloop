require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');

const http = require('http');
const { initSocket } = require('./config/socket');

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  const server = http.createServer(app);

  // Initialize Socket.io
  initSocket(server);

  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
