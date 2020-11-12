const Recipe = require("../models/Recipe");
const Chef = require("../models/Chef");

module.exports = {
    async home(req, res) {
        let { filter } = req.query;

        let results = await Recipe.findBy(filter);
        let recipes = results.rows;

        for (let index = 0; index < recipes.length; index++) {
            results = await Recipe.files(recipes[index].id);
            const files = results.rows.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            }));

            if (files[0]) {
                recipes[index].image = files[0].src;
            } else {
                recipes[index].image = "//placehold.it/500x360";
            }
        }


        return res.render("public-access/home/home", { recipes, filter });

    },

    about(req, res) {
        return res.render("public-access/about/about");
    },

    async recipes(req, res) {
        let { filter, page, limit } = req.query;

        page = page || 1;
        limit = limit || 3;
        let offset = limit * (page - 1);

        const params = {
            filter,
            page,
            limit,
            offset,
            async callback(recipes) {

                for (let index = 0; index < recipes.length; index++) {
                    results = await Recipe.files(recipes[index].id);
                    const files = results.rows.map(file => ({
                        ...file,
                        src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
                    }));

                    if (files[0]) {
                        recipes[index].image = files[0].src;
                    } else {
                        recipes[index].image = "//placehold.it/500x360";
                    }
                }

                if (recipes[0]) {
                    const pagination = {
                        total: Math.ceil(recipes[0].total / limit),
                        page
                    };

                    return res.render("public-access/recipe/list", { recipes, pagination, filter });
                } else {
                    return res.render("public-access/recipe/list", { recipes, filter });
                }

            }
        };

        Recipe.paginate(params);
    },

    async specificRecipe(req, res) {
        let results = await Recipe.find(req.params.id);
        let recipe = results.rows[0];

        if (!recipe) return res.render("not-found/not-found");


        results = await Recipe.files(recipe.id);
        const files = results.rows.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }));

        if (files[0]) {
            recipe.image = files[0].src;
        } else {
            recipe.image = "//placehold.it/500x360";
        }


        return res.render("public-access/recipe/specific", { recipe });
    },

    async chefs(req, res) {
        let results = await Chef.all();
        let chefs = results.rows;

        for (let index = 0; index < chefs.length; index++) {
            results = await Chef.files(chefs[index].id);
            const files = results.rows.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            }));

            if (files[0]) {
                chefs[index].image = files[0].src;
            } else {
                chefs[index].image = "//placehold.it/500x360";
            }
        }

        return res.render("public-access/chef/chef", { chefs });
    }
}