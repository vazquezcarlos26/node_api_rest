import { getConnection } from '../database/connection.js';
import sql from 'mssql';

export const getProducts = async (req, res) => {
    try {
        // Coonexión a la base de datos y consulta para obtener todos los productos
        const pool = await getConnection();

        if (!pool){  
            return res.status(500).json({ 
                status: false, 
                message: "Error de conexión a la BD" 
            });
        }

        // Consulta SQL para obtener todos los productos
        const result = await pool
            .request()
            .query('SELECT id, name, price, quantity, description FROM products');
        // console.log(result);

        return res.status(200).json({
            status: true,
            message: "Productos obtenidos con éxito",
            data: result.recordset
        });

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Error al obtener los productos", 
            error: error.message 
        });
    }
};

export const getProductById = async (req, res) => {
    try {
        const pool = await getConnection();

        if(!pool) {
            return res.status(500).json({ 
                status: false, 
                message: "Error de conexión a la BD" 
            });
        }

        const result = await pool
            .request()
            .input("id", sql.Int, req.params.id)
            .query("SELECT * FROM products WHERE id = @id");
        // console.log(result);
        
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ 
                status: false,
                message: "Producto no encontrado" 
            });
        }

        return res.status(200).json({ 
            status: true,
            message: "Producto obtenido con éxito",
            data: result.recordset[0]
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Error al obtener el producto", 
            error: error.message 
        });
    }
};

export const createProduct = async (req, res) => {

    // Extraemos los datos del cuerpo de la solicitud
    const { name, price, quantity, description } = req.body;

    try {
        const pool = await getConnection();
        
        // Validamos que la conexión hacia la base de datos sea exitosa
        if(!pool) {
            return res.status(500).json({ 
                status: false, 
                message: "Error de conexión a la BD" 
            });
        }

        const result = await pool
            .request()
            .input("name", sql.VarChar, name)
            .input("price", sql.Decimal(18, 2), price)
            .input("quantity", sql.Int, quantity)
            .input("description", sql.Text, description)
            .query(
                "INSERT INTO products (name, price, quantity, description) VALUES (@name, @price, @quantity, @description); SELECT SCOPE_IDENTITY() AS id;"
            );
        // console.log(result);
        
        return res.status(201).json({
            status: true,
            message: "Producto creado con éxito",
            data: {
                id: result.recordset[0].id,
                name,
                price,
                quantity,
                description
            }
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Error al crear el producto", 
            error: error.message 
        });
    }
};

export const updateProduct = async (req, res) => {
    // Extraemos los datos del cuerpo de la solicitud
    // const { name, price, quantity, description } = req.body;

    const { id } = req.params;
    const fieldsToUpdate = req.body; //Guardamos los campos que se desean actualizar en un objeto

    // Si nos mandan un body vacío {}, los retomamos de una vez
    if (Object.keys(fieldsToUpdate).length === 0) {
        return res.status(400).json({ 
            status: false, 
            message: "No se enviaron campos para actualizar" 
        });
    }

    try {
        const pool = await getConnection();

        //Validar que el producto exista antes de intentar actualizarlo
        if (!pool) { 
                return res.status(500).json({ 
                status: false, 
                message: "Error de conexión a la BD" 
            });
        }

        // 1. Iniciamos la petición de mssql e inyectamos el ID que siempre va fijo
        const request = pool.request().input("id", sql.Int, id);
        
        // 2. Aquí se van a guardar los pedazos de la query: ["name = @name", "price = @price"]
        const queryParts = [];

        // 3. Revisamos campo por campo con ifs si viene definido (!== undefined)
        if (fieldsToUpdate.name !== undefined) {
            request.input("name", sql.VarChar, fieldsToUpdate.name);
            queryParts.push("name = @name");
        }
        if (fieldsToUpdate.price !== undefined) {
            request.input("price", sql.Decimal(18, 2), fieldsToUpdate.price);
            queryParts.push("price = @price");
        }
        if (fieldsToUpdate.quantity !== undefined) {
            request.input("quantity", sql.Int, fieldsToUpdate.quantity);
            queryParts.push("quantity = @quantity");
        }
        if (fieldsToUpdate.description !== undefined) {
            request.input("description", sql.Text, fieldsToUpdate.description);
            queryParts.push("description = @description");
        }

        // 4. Juntamos las partes con comas para armar el UPDATE final
        // Ejemplo si solo mandan precio quedará: "UPDATE products SET price = @price WHERE id = @id"
        const queryString = `UPDATE products SET ${queryParts.join(', ')} WHERE id = @id`;

        // 5. Ejecutamos la consulta armada a mano
        const result = await request.query(queryString);

        // console.log(result);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ 
                status: false,
                message: "Producto no encontrado" 
            });
        }

        // Respondemos con estatus 200 (el 201 déjalo mejor para cuando CREAS cosas en el POST)
        return res.status(200).json({
            status: true,
            message: "Producto actualizado con éxito",
            data: fieldsToUpdate // Le devolvemos al cliente solo lo que mandó a actualizar
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Error al actualizar el producto", 
            error: error.message 
        });
    }
};

export const deleteProduct =  async (req, res) => {  
    try {
        const pool = await getConnection();

        //Validamos que la conexion hacia la base de datos sea exitosa.
        if(!pool) {
            return res.status(500).json({ 
                status: false, 
                message: "Error de conexión a la BD" 
            });
        }

        const result = await pool
            .request()
            .input("id", sql.Int, req.params.id)
            .query("DELETE FROM products WHERE id = @id");
        
        // console.log(result);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ 
                status: false,
                message: "Producto no encontrado" 
            });
        }

        return res.status(200).json({
            status: true,
            message: "Producto eliminado correctamente"
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Error al eliminar el producto",
            error: error.message
        });
    }  
};