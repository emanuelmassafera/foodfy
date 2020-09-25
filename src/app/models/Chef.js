const db = require("../../config/db");
const { date } = require("../../lib/utils");

module.exports = {
    all() {
        const query = `SELECT chefs.*, count(recipes) AS total_recipes  
        FROM chefs LEFT JOIN recipes ON (chefs.id = recipes.chef_id) 
        GROUP BY chefs.id`;

        return db.query(query);
    },

    create(data, file_id) {
        const query = `
            INSERT INTO chefs (
                name,
                created_at,
                file_id
            ) VALUES ($1, $2, $3) 
            RETURNING id
        `;

        const values = [
            data.name,
            date(Date.now()).iso,
            file_id
        ];

        return db.query(query, values);
    },

    find(id) {
        return db.query(`SELECT chefs.*, count(recipes) AS total_recipes  
        FROM chefs LEFT JOIN recipes ON (chefs.id = recipes.chef_id) 
        WHERE chefs.id=$1  
        GROUP BY chefs.id`, [id]);
    },

    findRecipes(id) {
        return db.query(`SELECT recipes.* FROM recipes 
        WHERE recipes.chef_id=$1 ORDER BY recipes.created_at DESC`, [id]);
    },

    update(data, file_id) {
        const query = `
            UPDATE chefs SET 
                name=($1),
                file_id=($2)
            WHERE id=($3)
        `;

        const values = [
            data.name,
            file_id,
            data.id
        ];

        return db.query(query, values);
    },

    async delete(id) {

        await db.query(`DELETE FROM recipes_files WHERE recipes_files.recipe_id = $1`, [id]);

        return db.query(`DELETE FROM chefs WHERE id=$1`, [id]);
    },

    files(id) {
        return db.query(`
        SELECT files.* FROM files LEFT JOIN chefs ON (files.id = chefs.file_id) WHERE chefs.id = $1
        `, [id]);
    }
}