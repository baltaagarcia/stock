import express from 'express';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(cors()); // Permite todas las solicitudes CORS

const port = process.env.PORT || 3000;

// Middleware para manejar JSON
app.use(express.json());

// Crear la conexión a la base de datos
const conexionDB = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Verificar la conexión
console.log('Conectado a la base de datos MySQL');

// Mostrar todos los productos (GET)
app.get('/', async (req, res) => {
    try {
        const [resultados] = await conexionDB.query('SELECT * FROM productos');
        res.status(200).json(resultados); // Enviar los resultados como JSON
    } catch (error) {
        console.error('Error en la consulta:', error);
        res.status(500).send('Error en la consulta: ' + error.message);
    }
});

// Crear un producto (POST)
app.post('/productos', async (req, res) => {
    const { nombre, precio, cantidad, categoria } = req.body;
    const sql = 'INSERT INTO productos (nombre, precio, cantidad, categoria) VALUES (?, ?, ?, ?)';

    try {
        const [respuesta] = await conexionDB.query(sql, [nombre, precio, cantidad, categoria]);
        res.status(201).send('Producto creado con éxito, ID: ' + respuesta.insertId);
    } catch (error) {
        console.error('Error al crear el producto:', error);
        res.status(500).send('Error al crear el producto');
    }
});

// Actualizar un producto (PUT)
app.put('/productos/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, precio, cantidad, categoria } = req.body;
    const sql = 'UPDATE productos SET nombre = ?, precio = ?, cantidad = ?, categoria = ? WHERE id = ?';

    try {
        await conexionDB.query(sql, [nombre, precio, cantidad, categoria, id]);
        res.send('Producto actualizado con éxito');
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).send('Error al actualizar el producto');
    }
});

// Eliminar un producto (DELETE)
app.delete('/productos/:id', async (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM productos WHERE id = ?';

    try {
        await conexionDB.query(sql, [id]);
        res.send('Producto eliminado con éxito');
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        res.status(500).send('Error al eliminar el producto');
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
