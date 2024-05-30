import { app } from "./app.js";
import ConnectToDB from "./database/conn_db.js";

// Connect the data-base
ConnectToDB();

// PORT
const PORT = process.env.PORT || 8081;

// Server listening

app.listen(PORT, () => {
  console.log(`Server is listening on PORT: ${PORT}`);
});
