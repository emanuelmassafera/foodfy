const cards = document.querySelectorAll(".card");

for (let card of cards) {
    card.addEventListener("click", function(){
        let id = card.getAttribute("id");
        window.location.href = `/recipes/:${id}`; 
    });
}