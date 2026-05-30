import { getConnection } from '../database/connection.js';
import sql from 'mssql';

export const getProducts = async (req, res) => {
    try {
        // Coonexión a la base de datos y consulta para obtener todos los productos
        const pool = await getConnection();

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
        const result = await pool
            .request()
            .input("id", sql.Int, req.params.id)
            .query("SELECT * FROM products WHERE id = @id");
        // console.log(result);
        
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "Producto no encontrado" });
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
    const { name, price, quantity, description } = req.body;

    try {
        const pool = await getConnection();
        const result = await pool
            .request()
            .input("id", sql.Int, req.params.id)
            .input("name", sql.VarChar, name)
            .input("price", sql.Decimal(18, 2), price)
            .input("quantity", sql.Int, quantity)
            .input("description", sql.Text, description)
            .query(
                "UPDATE products SET name = @name, price = @price, quantity = @quantity, description = @description WHERE id = @id"
            );

        // console.log(result);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        return res.status(201).json({
            status: true,
            message: "Producto actualizado con éxito",
            data: {
                id: req.params.id,
                name,
                price,            
                quantity,
                description,
            }
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
        const result = await pool
            .request()
            .input("id", sql.Int, req.params.id)
            .query("DELETE FROM products WHERE id = @id");
        
        // console.log(result);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "Producto no encontrado" });
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