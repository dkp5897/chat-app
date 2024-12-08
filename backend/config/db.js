const mongoose = require("mongoose");

const connectDataBase = () => {
  mongoose
    .connect(process.env.DB_DEV, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((res) => {
      console.log(`mongodb connnected with server: ${res.connection.host}`);
    });
};


module.exports = connectDataBase;
