const _currentPage = location.pathname;
const menuItems = document.querySelectorAll("header .links a");

for (item of menuItems){
    if (_currentPage.includes(item.getAttribute("class"))){
        item.classList.add("active");
    }
}