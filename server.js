import express from "express";
import mysql from "mysql";
import cors from "cors";
import multer from "multer";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "crud",
});

app.get("/", (req, res) => {
  const sql = "SELECT * FROM users";
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/create", (req, res) => {
  const sql = "INSERT INTO users (`name`, `phone`, `email`) VALUES (?)";
  const values = [req.body.name, req.body.phone, req.body.email];
  db.query(sql, [values], (err, data) => {
    if (err) return res.json(err);
    return res.json("created");
  });
});

app.put("/update/:id", (req, res) => {
  const sql =
    "UPDATE users set `name` = ?, `phone` = ?, `email` = ? WHERE id = ?";
  const id = req.params.id;
  const values = [req.body.name, req.body.phone, req.body.email];
  db.query(sql, [...values, id], (err, data) => {
    if (err) return res.json(err);
    return res.json("updated");
  });
});

app.delete("/delete/:id", (req, res) => {
  const sql = "DELETE FROM users WHERE id = ?";
  const id = req.params.id;
  db.query(sql, [id], (err, data) => {
    if (err) return res.json(err);
    return res.json("deleted");
  });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
});

app.post("/upload", upload.single("image"), (req, res) => {
  // console.log(req.file);
  const image = req.file.filename;
  const sql = "UPDATE users SET image = ?";
  db.query(sql, [image], (err, resultat) => {
    if (err) return res.json({ Message: "Error" });
    return res.json({ Status: "Success" });
  });
});

app.listen(8001, () => {
  console.log("Listining...");
});
