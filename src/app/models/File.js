const db = require("../../config/db");

module.exports = {
    async create({ filename, path, recipe_id }) {
        try {
            let query = `
                INSERT INTO files (
                    name,
                    path
                ) VALUES ($1, $2)
                RETURNING id
            `;
    
            let values = [
                filename,
                path
            ];
    
            const results = await db.query(query, values);
            const fileId = results.rows[0].id;
    
            query = `
                INSERT INTO recipes_files (
                    recipe_id,
                    file_id
                ) VALUES ($1, $2)
                RETURNING id
            `;
    
            values = [
                recipe_id,
                fileId
            ];
    
            return db.query(query, values);
        } catch (error) {
            console.error(error);
        }
    },

    async createChefFile ({ filename, path }) {
        try {
            let query = `
                INSERT INTO files (
                    name,
                    path
                ) VALUES ($1, $2)
                RETURNING id
            `;
    
            let values = [
                filename,
                path
            ];
    
            return db.query(query, values);
        } catch (error) {
            console.error(error);
        }
    },

    async delete(id) {
        try {
            let result = await db.query(`SELECT * FROM files WHERE id = $1`, [id]);
            const file = result.rows[0];

            result = await db.query(`SELECT * FROM recipes_files WHERE recipes_files.file_id = $1`, [id]);
            const recipes_files = result.rows[0];

            await db.query(`DELETE FROM recipes_files WHERE recipes_files.file_id = $1`, [id]);
    
            return db.query(`DELETE FROM files WHERE id = $1`, [id]);
        } catch (err) {
            console.error(err);
        }
    }
}