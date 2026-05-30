import { getConnection } from "../database/connection.js";
import sql from "mssql";


///Obtener todos los usuarios
export const getUsers = async (req, res) => {
    try {
        ///Agregamos la conexion a la base de datos
        const pool = await getConnection();

        //Verificamos que la conexión se haya establecido correctamente
        if (!pool) {
            return res.status(500).json({ 
                status: false, 
                message: "Error de conexión con la base de datos" 
            });
        }

        //Consulta query hacia la base de datos para obtener todos los usuarios
        // Solo obtenemos los campos necesarios para evitar exponer información sensible
        const result = await pool.request().query("SELECT id, name, surnames, email FROM users");

        // Respuaesta con formato JSON, incluyendo un mensaje de éxito y los datos obtenidos
        return res.json({
            status: true,
            message: "Usuarios obtenidos con éxito",
            data: result.recordset
        });
    } catch (error) {
        console.error("Error al obtener los usuarios", error);

        return res.status(500).json({ 
            status: false,
            message: "Error al obtener los usuarios" 
        });
    }

}

export const getUsersById = async (req, res) => {
    ///Agregamos la conexion a la base de datos
    const pool = await getConnection();

    //Consulta query hacia la base de datos para obtener un usuario en espoecifico
    const result = await pool
        .request()
        .input("id", sql.Int, req.params.id)
        .query("SELECT * FROM users WHERE id = @id");

    if(result.rowsAffected[0] === 0){
        return res.status(404).json({message: "Usuario no encontrado"});
    }

    console.log(result);

    res.json(result.recordset[0]);
}
 
export const createUser = async (req, res) => {

    ///Extraemos los datos del cuerpo de la solicitud
    const { name, surnames, email } = req.body;

    try {      
        ///Agregamos la conexion a la base de datos
        const pool = await getConnection();

        //Consulta query hacia la base de datos para obtener un usuario en espoecifico
        const result = await pool
            .request()
            .input("name", sql.VarChar, req.body.name)
            .input("surnames", sql.VarChar, req.body.surnames)
            .input("email", sql.VarChar, req.body.email)
            .query("INSERT INTO users (name, surnames, email) VALUES (@name, @surnames, @email); SELECT SCOPE_IDENTITY() AS id;");

        return res.status(201).json({
            status: true,
            message: "Usuario creado correctamente",
            data: {
                id: result.recordset[0].id,
                name,
                surnames,
                email
            },
        });
    } catch (error) {
        console.error("Error al crear el usuario", error);
        return res.status(500).json({ 
            status: false,
            message: "Error al crear el usuario" 
        });
    }

}

export const updateUser = async (req, res) => {
    ///Agregamos la conexion a la base de datos
    const pool = await getConnection();

    //Consulta query hacia la base de datos para obtener un usuario en espoecifico
    const result = await pool
        .request()
        .input("id", sql.Int, req.params.id)
        .input("name", sql.VarChar, req.body.name)
        .input("surnames", sql.VarChar, req.body.surnames)
        .input("email", sql.VarChar, req.body.email)
        .query("UPDATE users SET name = @name, surnames = @surnames, email = @email WHERE id = @id");

    console.log(result);

    if(result.rowsAffected[0] === 0){
        return res.status(404).json({message: "Usuario no encontrado"});
    }

    res.json({
        id: req.params.id,
        name: req.body.name,
        surnames: req.body.surnames,
        email: req.body.email
    });
}

export const deleteUser = async (req, res) => {
    ///Agregamos la conexion a la base de datos
    const pool = await getConnection();

    //Consulta query hacia la base de datos para obtener un usuario en espoecifico
    const result = await pool
        .request()
        .input("id", sql.Int, req.params.id)
        .query("DELETE FROM users WHERE id = @id");

    if(result.rowsAffected[0] === 0){
        return res.status(404).json({message: "Usuario no encontrado"});    
    };
    res.json({message: "Usuario eliminado correctamente"});
}
 