const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepoId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).send('Invalid Repository ID.');
  }
  next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = { id : uuid(), title, url, techs, likes: 0 };

  repositories.push(repository);
  return response.json(repository);
});

app.put("/repositories/:id", validateRepoId, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  
  const index = repositories.findIndex(repo => repo.id === id);

  const { likes } = repositories[index];
  const repo = { id, title, url, techs, likes };
  repositories[index] = repo;

  return response.json(repo);
});

app.delete("/repositories/:id", validateRepoId, (request, response) => {
  const { id } = request.params;
  const index = repositories.findIndex(repo => repo.id === id);

  repositories.splice(index, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", validateRepoId, (request, response) => {
  const { id } = request.params;

  repositories.find(repo => {
    if (repo.id === id) {
      repo.likes += 1;
      return response.json(repo);
    }
  });
});

module.exports = app;
