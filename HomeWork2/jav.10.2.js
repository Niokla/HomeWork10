const screensize = document.querySelector("#screensize");

const btn = document.querySelector(".j-btn-test");



btn.addEventListener("click", () => {
    screensize.textContent = alert(`Размер экрана: ${window.screen.width}x${window.screen.height}`);

});