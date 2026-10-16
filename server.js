import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcryptjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;
const saltRounds = 10;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "dist")));

const db = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: String(process.env.DB_PASSWORD ?? ""),
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
});

db.connect()
  .then(() => console.log("Connected to PostgreSQL database"))
  .catch((err) => console.error("Database connection error:", err.message));

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.post("/register", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  try {
    const checkResult = await db.query("SELECT * FROM operations WHERE email = $1", [
      email,
    ]);

    if (checkResult.rows.length > 0) {
      res.send("Email already exists. Try logging in.");
    } else {
  
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.error("Error hashing password:", err);
        } else {
          console.log("Hashed Password:", hash);
          await db.query(
            "INSERT INTO operations (email, password) VALUES ($1, $2)",
            [email, hash]
          );
          res.redirect("/"); // Redirects the browser to the home page
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
});


app.post("/login", async (req, res) => {
  const email = req.body.username;
  const loginPassword = req.body.password;
  
  try {
    const result = await db.query("SELECT * FROM operations WHERE email = $1", [
      email,
    ]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const storedHashedPassword = user.password;

      bcrypt.compare(loginPassword, storedHashedPassword, (err, result) => {
        if (err) {
          console.error("Error comparing passwords:", err);
        } else {
          if (result) {
            
            res.redirect("/submit")
          } else {
            res.send("Incorrect Password");
          }
        }
      });
    } else {
      res.send("User not found");
    }
  } catch (err) {
    console.log(err);
  }
});

app.post('/calculate', async (req, res) => {
    try {
        const { expression, email } = req.body;
        console.log("Received expression:", expression, "for email:", email);
        
        const sanitizedInput = expression.replace(/[^0-9+\-*/.]/g, "");
        const result = new Function(`return ${sanitizedInput}`)();
        const combinedData = `${sanitizedInput} = ${result}`;

        const userQuery = await db.query("SELECT data FROM operations WHERE email = $1", [email]);
        
        let existingData = "";
        if (userQuery.rows.length > 0) {
            existingData = userQuery.rows[0].data || ""; 
        }

        const updatedData = existingData ? `${existingData}\n${combinedData}` : combinedData;
       
        console.log(updatedData);
        const updateResult = await db.query(`
        INSERT INTO operations (email, data) 
        VALUES ($1, $2) 
        ON CONFLICT (email) 
        DO UPDATE SET data = EXCLUDED.data`, [email, updatedData]);


        console.log("Rows updated:", updateResult.rowCount);
        res.json({ result: result.toString() });

    } catch (error) {
        console.error("Backend calculation error:", error); 
        res.status(400).json({ error: "Invalid calculation" });
    }
});

app.get('/history', async (req, res) => {
    try {
        const { email } = req.query;
        const userQuery = await db.query("SELECT data FROM operations WHERE email = $1", [email]);

        if (userQuery.rows.length > 0) {
            res.json({ data: userQuery.rows[0].data || "" });
        } else {
            res.json({ data: "" });
        }
    } catch (error) {
        console.error("Error fetching history:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get("/*splat", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
    console.log(`Express server running at http://localhost:${PORT}`);
});
