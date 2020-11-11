const faker = require("faker");
const { hash } = require("bcryptjs");

const User = require("./src/app/models/User");
const Chef = require("./src/app/models/Chef");
const File = require("./src/app/models/File");
const Recipe = require("./src/app/models/Recipe");

let usersIds = [];
let chefsIds = [];
let recipesIds = [];

async function createUsers() {
    const users = [];
    const password = await hash("1234", 8);
    const passwordAdmin = await hash("admin", 8);

    users.push({
        name: faker.name.findName(),
        email: "admin@admin.com",
        password: passwordAdmin, 
        isAdmin: true,
    });

    while(users.length < 5) {
        users.push({
            name: faker.name.findName(),
            email: faker.internet.email(),
            password, 
            isAdmin: faker.random.boolean(),
        });
    }

    const usersPromise = users.map(user => User.create(user));

    usersIds = await Promise.all(usersPromise);
}

async function createChefs() {
    let chefs = [];
    let files = [];

    while(chefs.length < 5) {

        files.push({
            filename: faker.image.image(),
            path: `public/images/placeholder.png`,
        });
        
        const filesPromises = files.map(file => File.createChefFile(file));
        let results = await filesPromises[0];
        const fileId = results.rows[0].id;

        chefs.push({
            name: faker.name.findName(),
            fileId: fileId,
        });
    }

    const chefsPromise = chefs.map(chef => Chef.create(chef));

    chefsIds = await Promise.all(chefsPromise);
}

async function createRecipes() {
    let recipes = [];
    let files = [];

    while(recipes.length < 50) {
        recipes.push({
            chef: chefsIds[Math.floor(Math.random() * 5)],
            title: faker.name.title(),
            ingredients: faker.lorem.paragraph(Math.ceil(Math.random() * 5)).split(". ").map(ingredient => ingredient.replace(".", "")),
            preparation: faker.lorem.paragraph(Math.ceil(Math.random() * 5)).split(". ").map(ingredient => ingredient.replace(".", "")),
            information: faker.lorem.paragraph(Math.ceil(Math.random() * 10)),
            userId: usersIds[Math.floor(Math.random() * 5)],
        });
    }

    const recipesPromise = recipes.map(recipe => Recipe.create(recipe));

    recipesIds = await Promise.all(recipesPromise);

    while(files.length < 5*50) {
        files.push({
            filename: faker.image.image(),
            path: `public/images/placeholder.png`,
            recipe_id: recipesIds[Math.floor(Math.random() * 50)],
        });
    }
    
    const filesPromises = files.map(file => File.create(file));
    await Promise.all(filesPromises);
}

async function init() {
    await createUsers();
    await createChefs();
    await createRecipes();
}

init();