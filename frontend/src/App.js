import React, { useState, useEffect } from "react";
import api from './services/api';

import "./styles.css";

function App() {
  const [repositories, setRepositories] = useState([]);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [techs, setTechs] = useState('');

  useEffect(() => {  // listar repositorios existentes
    api.get('/repositories')
    .then(response => setRepositories(response.data));
  }, []);
  
  async function handleAddRepository() {
    const techsToArray = techs.split(', ');

    const response = await api.post('/repositories', 
      {
        title,
        url,
        techs : techsToArray,
        likes: 0,
      });

    const repo = response.data;
    setRepositories([...repositories, repo]);

    setTitle('');
    setUrl('');
    setTechs('');
  }

  async function handleRemoveRepository(id) {
    await api.delete(`/repositories/${id}`);
    const newRepositories = repositories.filter(repo => repo.id !== id);
    setRepositories(newRepositories);
  }

  return (
    <div>
      <h1>Set Repositories</h1>
      <h3>Type a title, a url and repository techs, in this order:</h3>

      <div className='inputs'>
        <input type='text' value={title} onChange={e => setTitle(e.target.value)} />
        <input type='text' value={url} onChange={e => setUrl(e.target.value)} />
        <input type='text' value={techs} onChange={e => setTechs(e.target.value)} />
        <button onClick={handleAddRepository}> Adicionar </button>
      </div>

      <ul data-testid="repository-list">
        {repositories.map(repo => (
          
          <li key={repo.id}>
            title: {repo.title}
            <br/>
            url: {repo.url}
            <br/>
            techs: {repo.techs.join(' ,')}
            <br/>
            likes: {repo.likes}
            <br/>
            <button onClick={() => handleRemoveRepository(repo.id)}> Remover </button>
          </li>

        ))}
      </ul>
    </div>
  );
}

export default App;
