const viewMoreElement = document.querySelector(".details");
const motivationElement = document.getElementById("motivation");
const mainElement = document.querySelector("main");
let show = 0;

function reset() {
  viewMoreElement.textContent = "View more details";
  motivationElement.style.display = "none";
  mainElement.style.height = '950px'
  show = 0;
}

function viewMore() {
  if (show == 0) {
    viewMoreElement.textContent = "Hide details";
    motivationElement.style.display = "block";
    mainElement.style.height = '1600px'
    show = 1;
  } else {
    reset()
  }
}

viewMoreElement.addEventListener("click", viewMore);