import app from "./app";
import { connectDB } from "./db.config";

const port = process.env.PORT || 3000;

app.listen(3000, () => {
    console.log(`Server running on port http://localhost:${port}`);
});

connectDB();
