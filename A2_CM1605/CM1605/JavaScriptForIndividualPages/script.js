const form = document.querySelector("form"),
    nextBtn = form.querySelector(".nextBtn"),
    backBtn = form.querySelector(".backBtn"),
    firstForm = form.querySelector(".first"),
    secondForm = form.querySelector(".second");

nextBtn.addEventListener("click", () => {
    console.log("Next button clicked");
    firstForm.style.transform = "translateX(-100%)";
    secondForm.style.transform = "translateX(0)";
});

backBtn.addEventListener("click", () => {
    console.log("Back button clicked");
    firstForm.style.transform = "translateX(0)";
    secondForm.style.transform = "translateX(100%)";
});
