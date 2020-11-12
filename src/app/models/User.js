const db = require("../../config/db");
const { hash } = require("bcryptjs");
const crypto = require("crypto");
const mailer = require("../../lib/mailer");
const Recipe = require("./Recipe");
const fs = require('fs');

module.exports = {
    all() {
        try {
            const query = `SELECT * FROM users;`
    
            return db.query(query);
        } catch (error) {
            console.error(error);
        }
    },

    isAdmin(id) {
        try {
            const query = `SELECT is_admin FROM users WHERE id = $1`;
    
            return db.query(query, [id]);
            
        } catch (error) {
            console.error(error);
        }
    },

    async find(id) {
        try {
            return db.query(`SELECT * FROM users WHERE id=$1`, [id]);
        } catch (error) {
            console.error(error);
        }
    },

    async findOne(filters) {
        try {
            let query = "SELECT * FROM users";
    
            Object.keys(filters).map(key => {
                query = `${query} 
                ${key}
                `;
    
                Object.keys(filters[key]).map(field => {
                    query = `${query} ${field} = '${filters[key][field]}'`;
                });
            });
    
            const results = await db.query(query);
            return results.rows[0];
        } catch (error) {
            console.error(error);
        }
    },

    async create(data) {
        try {
            const query = `
                INSERT INTO users (
                    name,
                    email,
                    password,
                    is_admin
                ) VALUES ($1, $2, $3, $4)
                RETURNING id
            `;

            const token = crypto.randomBytes(8).toString("hex");

            // Hash of password
            const passwordHash = await hash(token, 8);

            let isAdmin = false;

            if (data.isAdmin) {
                isAdmin = true;
            }

            const values = [
                data.name,
                data.email,
                data.password || passwordHash,
                isAdmin
            ];

            const results = await db.query(query, values);

            await mailer.sendMail({
                to: data.email,
                from: 'no-reply@foody.com.br',
                subject: 'Seu acesso ao Foodfy',
                html: `<h2>Seu acesso ao Foodfy foi liberado!</h2>
                <p>Utilize a senha ${token} para entrar em sua conta.</p>
                `,
            });

            return results.rows[0].id;

        } catch (err) {
            console.error(err);
        }

    },

    async delete(id) {
        try {
            let results = await await db.query(`SELECT recipes.* FROM recipes WHERE recipes.user_id=$1`, [id]);
            const recipes = results.rows;
    
            const allFilesPromise = recipes.map(recipe =>
                Recipe.files(recipe.id)
            );
    
            let promiseResults = await Promise.all(allFilesPromise);
    
            for (let index = 0; index < recipes.length; index++) {
                await db.query(`DELETE FROM recipes_files WHERE recipes_files.recipe_id = $1`, [recipes[index].id]);
            }
    
            await db.query(`DELETE FROM users WHERE id=$1`, [id]);
    
            promiseResults.map(results => {
                results.rows.map(file => {
                    try {
                        fs.unlinkSync(file.path);
                    } catch (error) {
                        console.error(error);
                    }
                });
            });
        } catch (error) {
            console.error(error);
        }

    },

    async update(data) {
        try {
            let query = `
                UPDATE users SET 
                    name=($1),
                    email=($2),
                    password=($3),
                    is_admin=($4)
                WHERE id=($5)
            `;
    
            let isAdmin;
            if(data.isAdmin) {
                isAdmin = data.isAdmin;
            } else {
                isAdmin = data.is_adminHidden;
            }
    
            let passwordHash;
            if(data.password) {
                passwordHash = await hash(data.password, 8);;
            } else {
                passwordHash = data.passwordHidden;
            }
    
            let values = [
                data.name,
                data.email,
                passwordHash,
                isAdmin,
                data.id
            ];
            
            return db.query(query, values);
            
        } catch (error) {
            console.error(error);
        }
    },

    async updateFields(id, fields) {
        try {
            let query = "UPDATE users SET";
    
            Object.keys(fields).map((key, index, array) => {
                if((index + 1) < array.length) {
                    query = `${query} 
                        ${key} = '${fields[key]}',
                    `;
                } else {
                    query = `${query}
                        ${key} = '${fields[key]}'  
                        WHERE id = ${id}
                    `;
                }
            });
    
            await db.query(query);
            return;
        } catch (error) {
            console.error(error);
        }
    },
}