const modalOverlay = document.querySelector(".modal-overlay");
const modal = document.querySelector(".modal");
const cards = document.querySelectorAll(".card");
const closeModal = document.querySelector(".close-modal");

for (let card of cards) {
    card.addEventListener("click", function(){
        let img = card.getElementsByClassName("card-image-id");
        let title = card.getElementsByClassName("card-title-id");
        let info = card.getElementsByClassName("card-info-id");

        let modalTitle = modal.getElementsByClassName("title-modal");
        modalTitle[0].innerHTML = title[0].innerHTML;

        let modalInfo = modal.getElementsByClassName("info-modal");
        modalInfo[0].innerHTML = info[0].innerHTML;

        let modalImage = modal.getElementsByClassName("image-modal");
        modalImage[0].src = img[0].src;

        modalOverlay.classList.add("active");
    });
}

closeModal.addEventListener("click", function(){
    modalOverlay.classList.remove("active");
});