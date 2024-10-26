import express, { response } from "express";
import pkg from "pg"; 
import cors from "cors" ;

const { Pool } = pkg; 

const app = express();
const port = 8800;


const pool = new Pool({
    user: 'postgres',      
    host: 'localhost',         
    database: 'test',           
    password: '12345',   
    port: 5432,                  
});

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.json("hello this is the backend");
});

app.get("/books", (req, res) => {
    const q = "SELECT * FROM books";
    pool.query(q, (err, data) => {
        if (err) return res.json(err); 
        return res.json(data.rows); 
    });
});
app.post("/books", (req, res) => {
    const q = 'INSERT INTO books (title, description, cover, price) VALUES ($1, $2, $3, $4)';

    const values = [
        req.body.title,
        req.body.description,
        req.body.cover,
        req.body.price,
    ];

    pool.query(q, values, (err, data) => {
        if (err) {
            console.log(err); // Показване на грешката в конзолата
            return res.json(err);
        }
        return res.json("Book has been created successfully!");
    });
});

app.delete("/books/:id", (req, res) => {
    const bookId = [req.params.id];
    const q = 'DELETE FROM books WHERE id = $1';
   

    pool.query(q, bookId, (err, data) => {
        if (err) {
            console.log(err);
            return res.json(err);
        }
        return res.json("Book has been deleted successfully!");
    });
});

app.put("/books/:id", (req, res) => {
    const bookId = req.params.id;
    const q = 'UPDATE books SET title = $1, description = $2, cover = $3, price = $4 WHERE id = $5';

    const values = [
        req.body.title,
        req.body.description,
        req.body.cover,
        req.body.price,
        bookId  // Добавяме bookId като последен параметър
    ];

    pool.query(q, values, (err, data) => {
        if (err) {
            console.log(err);
            return res.json(err);
        }
        return res.json("Book has been updated successfully!");
    });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});