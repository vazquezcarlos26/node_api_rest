import { getConnection } from '../database/connection.js';
import sql from 'mssql';

export const getProducts = async (req, res) => {

    // Coonexión a la base de datos y consulta para obtener todos los productos
    const pool = await getConnection();

    // Consulta SQL para obtener todos los productos
    const result = await pool.request().query('SELECT * FROM products');
    console.log(result);

    res.json(result.recordset);
};

export const getProductById = async (req, res) => {
    const pool = await getConnection();
    const result = await pool
        .request()
        .input("id", sql.Int, req.params.id)
        .query("SELECT * FROM products WHERE id = @id");

    if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json(result.recordset[0]);
};

export const createProduct = async (req, res) => {
   const pool = await getConnection();
   const result = await pool
    .request()
    .input("name", sql.VarChar, req.body.name)
    .input("price", sql.Decimal(18, 2), req.body.price)
    .input("quantity", sql.Int, req.body.quantity)
    .input("description", sql.Text, req.body.description)
    .query(
        "INSERT INTO products (name, price, quantity, description) VALUES (@name, @price, @quantity, @description); SELECT SCOPE_IDENTITY() AS id;"
    );

    console.log(result);
    
    res.json({
        id: result.recordset[0].id,
        name: req.body.name,
        price: req.body.price,
        quantity: req.body.quantity,
        description: req.body.description
    });
};

export const updateProduct = async (req, res) => {
    const pool = await getConnection();
    const result = await pool
        .request()
        .input("id", sql.Int, req.params.id)
        .input("name", sql.VarChar, req.body.name)
        .input("price", sql.Decimal(18, 2), req.body.price)
        .input("quantity", sql.Int, req.body.quantity)
        .input("description", sql.Text, req.body.description)
        .query(
            "UPDATE products SET name = @name, price = @price, quantity = @quantity, description = @description WHERE id = @id"
        );

    console.log(result);

    if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json({
        id: req.params.id,
        name: req.body.name,
        price: req.body.price,
        quantity: req.body.quantity,
        description: req.body.description
    });
};

export const deleteProduct =  async (req, res) => {    
    const pool = await getConnection();
    const result = await pool
        .request()
        .input("id", sql.Int, req.params.id)
        .query("DELETE FROM products WHERE id = @id");
    
    console.log(result);

    if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json({ message: "Producto eliminado correctamente" });
};