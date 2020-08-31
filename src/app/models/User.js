const db = require("../../config/db");
const { hash } = require("bcryptjs");
const crypto = require("crypto");
const mailer = require("../../lib/mailer");

module.exports = {
    all() {
        const query = `SELECT * FROM users;`

        return db.query(query);
    },

    isAdmin(id) {
        const query = `SELECT is_admin FROM users WHERE id = $1`;

        return db.query(query, [id])
    },

    async findOne(filters) {
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
                passwordHash,
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


}