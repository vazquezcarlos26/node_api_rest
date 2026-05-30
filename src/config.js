//Prueba de conexión a SQL Server con mssql
// console.log("=== DIAGNÓSTICO DE VARIABLES ===");
// console.log("Usuario de la BD:", process.env.DB_USER);
// console.log("Contraseña de la BD:", process.env.DB_PASSWORD);
// console.log("Servidor de la BD:", process.env.DB_SERVER);
// console.log("Nombre de la BD:", process.env.DB_NAME);
// console.log("Puerto de la BD:", process.env.DB_PORT);
// console.log("================================");

// Centralizamos y, de paso, podemos poner valores por defecto por si se nos olvida algo
export const config = {
    db: {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        server: process.env.DB_SERVER || 'localhost',
        database: process.env.DB_NAME,
    }
};