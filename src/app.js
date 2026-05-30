import express from 'express';
import globalRouter from './routes/index.js';

//Configuración de la aplicación Express
const app = express();
//Obtener el cuerpo de las solicitudes en formato JSON
app.use(express.json());
//Rutas para productos
app.use(globalRouter);

//Una sola linea para todas las rutas de productos y usuarios, ya que el router se encarga de redirigir a cada una de las rutas específicas dependiendo del endpoint solicitado
app.use('/api/v1', globalRouter);

//Ruta de prueba para verificar que el servidor está funcionando
export default app;