# Node SQL REST API

## 📋 Descripción del Proyecto

**Node SQL REST API** es una aplicación backend construida con **Node.js** y **Express.js** que proporciona una API RESTful completa para la gestión de usuarios y productos. La aplicación se conecta a una base de datos **SQL Server** y utiliza prácticas modernas de desarrollo como validación de datos, manejo de errores y arquitectura modular.

## 🎯 Características Principales

- ✅ **API RESTful completa** con operaciones CRUD (Create, Read, Update, Delete)
- ✅ **Gestión de Usuarios** - Crear, obtener, actualizar y eliminar usuarios
- ✅ **Gestión de Productos** - Crear, obtener, actualizar y eliminar productos
- ✅ **Base de datos SQL Server** - Integración con SQL Server mediante el driver MSSQL
- ✅ **Validación de datos** - Validación de entrada con express-validator
- ✅ **Manejo de errores** - Manejo robusto de excepciones
- ✅ **Logging HTTP** - Registro de solicitudes HTTP con Morgan
- ✅ **CORS habilitado** - Soporte para solicitudes desde diferentes orígenes
- ✅ **Variables de entorno** - Configuración segura mediante .env
- ✅ **ES Modules** - Usando sintaxis moderna de importación

---

## 🛠️ Tecnologías Utilizadas

| Tecnología | Versión | Propósito |
|------------|---------|----------|
| **Node.js** | 18+ | Runtime de JavaScript |
| **Express.js** | 5.2.1 | Framework web |
| **MSSQL** | 12.5.4 | Driver para SQL Server |
| **express-validator** | 7.3.2 | Validación de datos |
| **CORS** | 2.8.6 | Control de acceso entre orígenes |
| **Morgan** | 1.10.1 | Logging HTTP |
| **dotenv** | 17.4.2 | Gestión de variables de entorno |
| **pnpm** | 11.2.2+ | Gestor de paquetes |

---

## 📁 Estructura del Proyecto

```
node-sql-restapi/
├── src/
│   ├── index.js                    # Punto de entrada de la aplicación
│   ├── app.js                      # Configuración de Express
│   ├── config.js                   # Configuración centralizada
│   ├── database/
│   │   └── connection.js           # Conexión a SQL Server
│   ├── controllers/
│   │   ├── users.controllers.js    # Lógica de negocio para usuarios
│   │   └── products.controllers.js # Lógica de negocio para productos
│   ├── routes/
│   │   ├── index.js                # Router principal
│   │   ├── users.routes.js         # Rutas de usuarios
│   │   └── products.routes.js      # Rutas de productos
│   └── validators/
│       └── users.js                # Validadores para usuarios
├── .env                            # Variables de entorno
├── .gitignore                      # Archivos ignorados por Git
├── package.json                    # Dependencias del proyecto
├── pnpm-lock.yaml                  # Lock file de pnpm
└── README.md                       # Documentación
```

---

## 🚀 Instalación y Configuración

### Requisitos Previos

- **Node.js** 18 o superior
- **pnpm** 11.2.2 o superior
- **SQL Server** 2019 o superior
- Base de datos creada en SQL Server

### 1. Clonar el Repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd node-sql-restapi
```

### 2. Instalar Dependencias

```bash
pnpm install
```

**Notas importantes:**
- Reemplaza `tu_contraseña_aqui` con tu contraseña de SQL Server
- Asegúrate de que SQL Server está corriendo en localhost:1433
- Si usas una configuración diferente, ajusta los valores según corresponda

## 🔒 Seguridad

### Buenas Prácticas Implementadas

1. **Variables de Entorno** - Las credenciales sensibles se almacenan en `.env`
2. **Consultas Parametrizadas** - Se usan parámetros SQL para prevenir inyecciones SQL
3. **Validación de Entrada** - express-validator valida los datos antes de procesarlos
4. **CORS** - Control de acceso entre orígenes configurable
5. **Tipos de Datos SQL** - Se especifican explícitamente los tipos de datos en las consultas

### Checklist de Seguridad

- [ ] Cambiar contraseña de SQL Server en producción
- [ ] Configurar CORS adecuadamente para orígenes permitidos
- [ ] Usar HTTPS en producción
- [ ] Implementar autenticación y autorización (JWT, OAuth, etc.)
- [ ] Validar todas las entradas de usuario
- [ ] Implementar rate limiting
- [ ] Usar variables de entorno para todas las configuraciones sensibles

---

## 📝 Validación de Datos

### Validadores de Usuarios

El archivo `src/validators/users.js` contiene las reglas de validación para la creación de usuarios:

```javascript
import { body, validationResult } from 'express-validator';

export const validateCreateUser = [
    body('name').notEmpty().withMessage('El nombre es requerido'),
    body('surnames').notEmpty().withMessage('Los apellidos son requeridos'),
    body('email').isEmail().withMessage('El email debe ser válido'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];
```

---

## 🐛 Manejo de Errores

La API implementa un manejo consistente de errores:

### Códigos de Estado HTTP

| Código | Significado |
|--------|------------|
| **200** | OK - Solicitud exitosa |
| **201** | Created - Recurso creado exitosamente |
| **400** | Bad Request - Solicitud inválida |
| **404** | Not Found - Recurso no encontrado |
| **500** | Internal Server Error - Error en el servidor |

### Respuestas de Error Típicas

```json
{
  "status": false,
  "message": "Descripción del error"
}
```


## 📊 Diagrama de Arquitectura

```
┌─────────────────────────────────────┐
│         Cliente HTTP                │
└────────────────┬────────────────────┘
                 │
         ┌───────▼────────┐
         │   Express.js   │
         │      App       │
         └───────┬────────┘
                 │
        ┌────────┼────────┐
        │        │        │
    ┌───▼──┐ ┌──▼────┐ ┌─▼────┐
    │Router│ │Router │ │Router│
    │ /api │ │/users │ │/prod │
    └───┬──┘ └──┬────┘ └─┬────┘
        │       │        │
        └───────┼────────┘
                │
        ┌───────▼────────────┐
        │   Controllers      │
        │ + Validators       │
        └───────┬────────────┘
                │
        ┌───────▼────────────┐
        │  SQL Server        │
        │  Connection Pool   │
        └───────┬────────────┘
                │
        ┌───────▼────────────┐
        │   SQL Server DB    │
        │  (users, products) │
        └────────────────────┘
```

## 📚 Archivos Clave

### `src/index.js`
Punto de entrada de la aplicación. Inicia el servidor Express en el puerto especificado.

### `src/app.js`
Configuración central de Express con middleware:
- JSON parser
- Router principal
- Manejo de solicitudes

### `src/config.js`
Centraliza la configuración desde variables de entorno para fácil acceso en toda la aplicación.

### `src/database/connection.js`
Gestiona la conexión a SQL Server usando el driver MSSQL con pooling de conexiones.

### `src/controllers/*.js`
Contiene la lógica de negocio para cada recurso (usuarios, productos).

### `src/routes/*.js`
Define los endpoints y mapea las solicitudes HTTP a los controladores correspondientes.

---

## 🔄 Flujo de una Solicitud

1. **Cliente** envía una solicitud HTTP (ej: GET /api/v1/users)
2. **Express Router** intercepta y dirige a la ruta correspondiente
3. **Middleware de Validación** valida los datos (si aplica)
4. **Controller** ejecuta la lógica de negocio
5. **Database Connection** establece conexión a SQL Server
6. **SQL Query** se ejecuta contra la base de datos
7. **Respuesta** se formatea en JSON y se envía al cliente

---

## 🛠️ Desarrollo y Contribuciones

### Agregar una Nueva Ruta

1. Crear controlador en `src/controllers/nuevaRuta.controllers.js`
2. Crear router en `src/routes/nuevaRuta.routes.js`
3. Importar en `src/routes/index.js`
4. Agregar validadores si es necesario


## 🎓 Conceptos Utilizados

### Express Middlewares
- `express.json()` - Parsea solicitudes JSON
- `cors()` - Habilita CORS
- `morgan()` - Logging HTTP

### SQL Server Concepts
- **Connection Pooling** - Reutilización de conexiones
- **Parametrized Queries** - Prevención de SQL injection
- **SCOPE_IDENTITY()** - Obtener ID del registro insertado
- **rowsAffected** - Número de filas modificadas

### ES6+ Features
- `import/export` - Módulos ES
- `async/await` - Programación asincrónica
- Template literals - Strings interpolados
- Destructuring - Desestructuración de objetos

---

## 📞 Soporte y Troubleshooting

### Problema: Error de conexión a SQL Server

**Solución:**
- Verificar que SQL Server está corriendo
- Comprobar credenciales en `.env`
- Verificar permisos del usuario en la base de datos
- Revisar logs de SQL Server


### Problema: Tablas no existen

**Solución:**
- Ejecutar los scripts SQL proporcionados
- Verificar que la base de datos está creada
- Comprobar permisos del usuario

---

## 📄 Licencia

Este proyecto está bajo licencia ISC.

---

## 👨‍💻 Autor

Proyecto desarrollado como aplicación REST API con Node.js y SQL Server.

---

## 📅 Última actualización

Enero 2025

---

**¡Gracias por usar Node SQL REST API!** 🚀
