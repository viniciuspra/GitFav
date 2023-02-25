const tableBody = document.querySelector("tbody")
const emptyDiv = document.querySelector(".empty")

function updateTableVisibility() {
  if (tableBody.children.length === 0) {
    tableBody.classList.add("hide")
    emptyDiv.classList.remove("hide")
  } else {
    tableBody.classList.remove("hide")
    emptyDiv.classList.add("hide")
  }
}