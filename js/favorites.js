

class Favorites {
  constructor(root) {
    this.root = document.querySelector(root);
  }
}

export class FavoriteViews extends Favorites {
  constructor(root) {
    super(root) 

    console.log(this.root);
    this.tbody = this.root.querySelector('table tbody')
  }

  updateTableVisibility() {
    this.empty = this.root.querySelector(".empty")
    if (this.tbody.children.length === 0) {
      this.tbody.classList.add("hide")
      this.empty.classList.remove("hide")
    } else {
      this.tbody.classList.remove("hide")
      this.empty.classList.add("hide")
    }
  }

  update() {
    this.entries.forEach((user) => {
      const row = this.createRow()
    })
  }

  createRow() {
    const tr = document.createElement("tr");

    tr.innerHTML = `
        <td class="user">
          <img src="https://github.com/viniciuspra.png" alt="">
          <a href="https://github.com/viniciuspra" target="_blank">
            <p>Vinicius Pra</p>
            <span>viniciuspra</span>
          </a>
        </td>
        <td class="repositories">
          16
        </td>
        <td class="followers">
          9
        </td>
        <td>
          <button class="remove">Remover</button>
        </td>
        `
    return tr
  }

}