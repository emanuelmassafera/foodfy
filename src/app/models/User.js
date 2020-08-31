const db = require("../../config/db");
const { hash } = require("bcryptjs");
const crypto = require("crypto");
const mailer = require("../../lib/mailer");
const fs = require("fs");

module.exports = {

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