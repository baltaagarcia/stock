import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

// Cargar variables de entorno desde el archivo .env
dotenv.config();
console.log(process.env.DB_DATABASE);

// Función para conectar a la base de datos
async function conectarBaseDeDatos() {
  try {
    // Crear conexión a la base de datos
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    console.log('Conexión a MySQL exitosa');

    // Realizar una consulta de ejemplo
    const [rows] = await connection.execute('SELECT * FROM productos');
    console.log(rows);

    // Cerrar la conexión
    await connection.end();
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
  }
}

conectarBaseDeDatos();
