connect2Server();

const form = document.querySelector("form");
const buscarBtn = document.querySelector("#buscar");
const authorsFieldset = document.querySelector("#autores");
const authorTemplate = document.querySelector("#templateAutor");
const commitContainer = document.querySelector("#commits");
const commitTemplate = document.querySelector("#commit");
const nCommits = document.querySelector("#nCommits");

const imagesPerAuthor = {
  "WEBER JULIETA": "icons/butterfly.png",
  "CALVERT DE BOHUN MAYTE": "icons/penguin.png",
  micabod: "icons/deer.png",
  urielschlo: "icons/fox.png",
  JZylber: "icons/owl.png",
};

Object.keys(imagesPerAuthor).forEach((author) => {
  const authorNode = authorTemplate.content.cloneNode(true);
  authorNode.querySelector("input").id = author;
  authorNode.querySelector("label").textContent = author;
  authorsFieldset.appendChild(authorNode);
});

function mostrarCommit(commit) {
  const commitNode = commitTemplate.content.cloneNode(true);
  // Autor
  const commitAuthor = commitNode.querySelector(".commitAuthor");
  commitAuthor.querySelector("img").src =
    imagesPerAuthor[commit.authorName] || "icons/chameleon.png";
  commitAuthor.querySelector("span").textContent = commit.authorName;
  // Mensaje
  const commitMessage = commitNode.querySelector(".commitMsg");
  commitMessage.textContent = commit.message;
  // Hash
  const commitHash = commitNode.querySelector(".hash");
  commitHash.textContent = "Hash: " + commit.hash;
  // Fecha y hora
  const commitDate = commitNode.querySelector(".commitDate");
  commitDate.textContent = new Date(commit.date).toLocaleDateString("es-AR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
  return commitNode;
}

function buscarCommits() {
  // Limpiar contenedor de commits
  commitContainer.innerHTML = "";
  const autores = Array.from(
    authorsFieldset.querySelectorAll("input[type='checkbox']")
  )
    .filter((input) => input.checked)
    .map((input) => input.id);
  const hash = document.querySelector("#hash").value.trim();
  const fechaInicio = document.querySelector("#fechaInicio").value;
  const fechaFin = document.querySelector("#fechaFin").value;
  postData(
    "buscarCommits",
    {
      autores: autores,
      hash: hash,
      fechaInicio: fechaInicio,
      fechaFin: fechaFin,
    },
    (commits) => {
      // Actualizar el número de commits encontrados
      nCommits.textContent = commits.length;
      // Mostrar los commits
      commits.forEach((commit) => {
        const commitNode = mostrarCommit(commit);
        commitContainer.appendChild(commitNode);
      });
    }
  );
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  buscarCommits();
  e.target.reset();
});
buscarBtn.addEventListener("click", () => {
  const event = new Event("submit", { bubbles: true });
  form.dispatchEvent(event);
});
document.addEventListener("DOMContentLoaded", buscarCommits);
