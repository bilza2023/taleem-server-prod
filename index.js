
import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 9000;

app.listen(PORT, "127.0.0.1", () => {

	console.log(`🚀 Taleem API running on http://127.0.0.1:${PORT}`);

});