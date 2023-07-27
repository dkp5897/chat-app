const mongoose = require("mongoose");

const connectDataBase = () => {
  const db_url =
    "mongodb+srv://dkp050897:Dkp%405897@cluster0.c2kszz6.mongodb.net/?retryWrites=true&w=majority";
  // "mongodb+srv://dkp050897:Dkp%405897@cluster0.c2kszz6.mongodb.net/?retryWrites=true&w=majority";

  mongoose
    .connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((res) => {
      console.log(`mongodb connnected with server: ${res.connection.host}`);
    });
};


module.exports = connectDataBase;
