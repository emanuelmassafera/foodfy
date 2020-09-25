const ingredients = document.querySelector(".ingredients");
ingredients.querySelector(".button").addEventListener("click", function () {
    if (ingredients.querySelector(".list").classList.contains("hide")) {
        ingredients.querySelector(".list").classList.remove("hide");
        ingredients.querySelector(".button").innerHTML = "ESCONDER";
    } else {
        ingredients.querySelector(".list").classList.add("hide");
        ingredients.querySelector(".button").innerHTML = "MOSTRAR";
    }
});

const preparation = document.querySelector(".preparation");
preparation.querySelector(".button").addEventListener("click", function () {
    if (preparation.querySelector(".list").classList.contains("hide")) {
        preparation.querySelector(".list").classList.remove("hide");
        preparation.querySelector(".button").innerHTML = "ESCONDER";
    } else {
        preparation.querySelector(".list").classList.add("hide");
        preparation.querySelector(".button").innerHTML = "MOSTRAR";
    }
});

const additionalInformation = document.querySelector(".additional-information");
additionalInformation.querySelector(".button").addEventListener("click", function () {
    if (additionalInformation.querySelector(".information").classList.contains("hide")) {
        additionalInformation.querySelector(".information").classList.remove("hide");
        additionalInformation.querySelector(".button").innerHTML = "ESCONDER";
    } else {
        additionalInformation.querySelector(".information").classList.add("hide");
        additionalInformation.querySelector(".button").innerHTML = "MOSTRAR";
    }
});