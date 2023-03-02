import { GithubUser } from "./GithubUser.js";

export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root);
    this.load();
  }

  load() {
    // Carrega a lista de favoritos do LocalStorage ou cria um array vazio
    this.entries = JSON.parse(localStorage.getItem("@github-favorites:")) || [];
  }

  save() {
    // Salva a lista de favoritos no LocalStorage
    localStorage.setItem("@github-favorites:", JSON.stringify(this.entries));
  }

  async add(username) {
    try {
      // Verifica se o usuário já existe na lista de favoritos
      const userExists = this.entries.find((entry) => entry.login === username);
      if (userExists) {
        throw new Error(`User ${username} already exists`);
      }

      // Busca o usuário no Github
      const user = await GithubUser.search(username);

      // Verifica se o usuário foi encontrado
      if (user.login === undefined || user.name === null) {
        throw new Error(`User not found!`);
      }

      // Adiciona o usuário à lista de favoritos
      this.entries = [user, ...this.entries];
      this.update();
      this.save();
    } catch (err) {
      // Exibe uma mensagem de erro caso ocorra algum problema
      alert(err.message);
    }
  }

  delete(user) {
    // Remove um usuário da lista de favoritos
    this.entries = this.entries.filter((entry) => entry.login !== user.login);
    this.update();
    this.save();
  }
}

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root);
    
    this.tbody = this.root.querySelector("table tbody");

    // Atualiza a lista de favoritos e configura o formulário de busca
    this.update();
    this.onadd();
  }

  onadd() {
    // Obtém os elementos do formulário de busca
    const addButton = this.root.querySelector(".search button");
    const input = this.root.querySelector(".search input");

    // Configura a ação do botão e da tecla Enter
    const addFavorite = () => {
      const { value } = input;
      this.add(value);
      input.value = "";
      input.focus();
    };

    addButton.onclick = addFavorite;
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        addFavorite();
      }
    });
  }

  update() {
    this.removeAllTr()

    // Atualiza a tabela com os usuários favoritos
    this.entries.forEach((user) => {
      const row = this.createRow()

      // Preenche as informações do usuário na linha da tabela
      row.querySelector(".user img").src = `https://github.com/${user.login}.png`
      row.querySelector(".user img").alt = `Imagem de ${user.name}`
      row.querySelector(".user a").href = `https://github.com/${user.login}`
      row.querySelector(".user p").textContent = user.name
      row.querySelector(".user span").textContent = "/" + user.login
      row.querySelector(".repositories").textContent = user.public_repos
      row.querySelector(".followers").textContent = user.followers

      // Adiciona um listener de clique para remover o usuário favorito
      row.querySelector(".remove").onclick = () => {
        const isOk = confirm(
          "Tem certeza de que deseja remover esse usuário de seus favoritos?"
        )
        if (isOk) {
          this.delete(user)
        }
      }

      // Adiciona a linha na tabela
      this.tbody.append(row)
    })
      
    // Verifica se a lista de favoritos está vazia e mostra uma mensagem apropriada
    const emptyDiv = this.root.querySelector(".empty")
    if (this.entries.length === 0) {
      emptyDiv.style.display = "flex"
    } else {
      emptyDiv.style.display = "none"
    }
  }

  createRow() {
    // Cria uma nova linha na tabela
    const tr = document.createElement("tr")

    // Preenche a linha com o HTML necessário para mostrar as informações do usuário
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
    // Remove todas as linhas da tabela
    this.tbody.querySelectorAll("tr").forEach((tr) => {
      tr.remove()
    })
  }
}
