const express = require('express');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware para manejar JSON
app.use(express.json());

// Crear la conexión a la base de datos
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Verificar la conexión
db.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
});

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('API funcionando');
});


// Crear un producto (POST)
app.post('/productos', (req, res) => {
    const { nombre, precio, cantidad, categoria } = req.body;
    const sql = 'INSERT INTO productos (nombre, precio, cantidad, categoria) VALUES (?, ?, ?, ?)';

   /* db.query(sql, [nombre, precio, cantidad, categoria], (err, res) => {
        if (err) {
            return res.status(500).send('Error al crear el producto');
        }
        res.status(201).send('Producto creado con éxito');
    });*/
    const  respuesta= db.query(sql, [nombre, precio, cantidad, categoria])
    res.status(201).send('Producto creado con éxito'+respuesta);
});

// Obtener todos los productos (GET)
const sql = 'SELECT * FROM productos';

/* db.query(sql, (err, res) => {
   if (err) {
     return res.status(500).send('Error al obtener los productos');
   }
   res.json(results);
 });*/


// Actualizar un producto (PUT)
app.put('/productos/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, precio, cantidad, categoria } = req.body;
    const sql = 'UPDATE productos SET nombre = ?, precio = ?, cantidad = ?, categoria = ? WHERE id = ?';

    db.query(sql, [nombre, precio, cantidad, categoria, id], (err, res) => {
        if (err) {
            return res.status(500).send('Error al actualizar el producto');
        }
        res.send('Producto actualizado con éxito');
    });
});

// Eliminar un producto (DELETE)
app.delete('/productos/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM productos WHERE id = ?';

    db.query(sql, [id], (err, res) => {
        if (err) {
            return res.status(500).send('Error al eliminar el producto');
        }
        res.send('Producto eliminado con éxito');
    });
});
// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});







