require("dotenv").config();

const bcrypt = require("bcryptjs");

const pool = require("./config/db");

const users = [
    {
        name: "John Doe",
        email: "john@example.com",
        password: "Password@123"
    },
    {
        name: "Sarah Smith",
        email: "sarah@example.com",
        password: "Password@123"
    },
    {
        name: "David Wilson",
        email: "david@example.com",
        password: "Password@123"
    },
    {
        name: "Nithin Ravi",
        email: "nithin@example.com",
        password: "Password@123"
    },
];

async function seedUsers() {
    try {
        for (const user of users) {
            const passwordHash = await bcrypt.hash(user.password, 12);

            await pool.execute(
                `
                INSERT INTO users (name, email, password_hash)
                VALUES (?, ?, ?)
                ON DUPLICATE KEY UPDATE
                    name = VALUES(name)
                `,
                [
                    user.name,
                    user.email,
                    passwordHash
                ]
            );
        }

        console.log("Users seeded successfully");

    } catch (error) {
        console.error("User seeding failed:", error);
        process.exitCode = 1;
    } finally {
        await pool.end();
    }
}

seedUsers();