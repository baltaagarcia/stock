import express from 'express';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import cors from 'cors'
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

app.post('/productos', async (req, res) => {
    console.log("Cuerpo de la solicitud:", req.body);  // Verificar los datos que llegan

    const { nombre, precio, cantidad, categoria } = req.body;

    if (!nombre || !precio || !cantidad || !categoria) {
        console.log("Faltan campos en el producto", req.body);
        return res.status(400).json({ error: 'Faltan campos en el producto' });
    }

    const sql = 'INSERT INTO productos (nombre, precio, cantidad, categoria) VALUES (?, ?, ?, ?)';
    
    try {
        console.log("Ejecutando consulta SQL:", sql, [nombre, precio, cantidad, categoria]);  // Verificar la consulta

        const [respuesta] = await conexionDB.query(sql, [nombre, precio, cantidad, categoria]);
        console.log("Respuesta de la base de datos:", respuesta);  // Verificar la respuesta de la base de datos

        res.status(201).json({ msj: 'Producto creado con éxito, ID: ' + respuesta.insertId, id: respuesta.insertId });
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
