import { GithubUser } from "./GithubUser.js"

export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem("@github-favorites:")) || []
  }

  save() {
    localStorage.setItem("@github-favorites:", JSON.stringify(this.entries))
  }

  async add(username) {
    try {
      const userExists = this.entries.find((entry) => entry.login === username)
      if (userExists) {
        throw new Error(`User ${username} already exists`)
        return
      }

      const user = await GithubUser.search(username)

      if (user.login === undefined || user.name === null) {
        throw new Error(`User not found!`)
      }

      this.entries = [user, ...this.entries]
      this.update()
      this.save()
    } catch (err) {
      alert(err.message)
    }
  }

  delete(user) {
    this.entries = this.entries.filter((entry) => entry.login !== user.login)
    this.update()
    this.save()
  }
}

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root)

    this.tbody = this.root.querySelector("table tbody")
    this.update()
    this.onadd()
  }

  onadd() {
    const addButton = this.root.querySelector(".search button")
    const input = this.root.querySelector(".search input")

    const addFavorite = () => {
      const { value } = input
      this.add(value)
      input.value = ""
      input.focus()
    }

    addButton.onclick = addFavorite
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        addFavorite()
      }
    })
  }

  update() {
    this.removeAllTr()
    this.entries.forEach((user) => {
      const row = this.createRow()

      row.querySelector(
        ".user img"
      ).src = `https://github.com/${user.login}.png`
      row.querySelector(".user img").alt = `Imagem de ${user.name}`
      row.querySelector(".user a").href = `https://github.com/${user.login}`
      row.querySelector(".user p").textContent = user.name
      row.querySelector(".user span").textContent = "/" + user.login
      row.querySelector(".repositories").textContent = user.public_repos
      row.querySelector(".followers").textContent = user.followers

      row.querySelector(".remove").onclick = () => {
        const isOk = confirm(
          "Tem certeza de que deseja remover esse usuário de seus favoritos?"
        )
        if (isOk) {
          this.delete(user)
        }
      }

      this.tbody.append(row)
    })
    
    const emptyDiv = this.root.querySelector(".empty")
    if (this.entries.length === 0) {
      emptyDiv.style.display = "flex"
    } else {
      emptyDiv.style.display = "none"
    }
  }

  createRow() {
    const tr = document.createElement("tr")

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

  removeAllTr() {
    this.tbody.querySelectorAll("tr").forEach((tr) => {
      tr.remove()
    })
  }
}
