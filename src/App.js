import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useParams, useNavigate } from 'react-router-dom';
import ProjectList from './components/ProjectList';
import ProjectBoard from './components/ProjectBoard';
import { fetchProjectById } from './api/projects';

function HomeRoute() {
  const navigate = useNavigate();
  return <ProjectList onSelectProject={p => navigate(`/projects/${p.id}`)} />;
}

function BoardRoute() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setProject(null);
    setError(null);
    fetchProjectById(projectId)
      .then(setProject)
      .catch(() => setError(true));
  }, [projectId]);

  if (error) return <div style={{ padding: 40, color: '#f87171' }}>Project not found.</div>;
  if (!project) return null;

  return (
    <ProjectBoard
      project={project}
      onBack={() => navigate('/')}
      onProjectUpdate={updated => setProject(updated)}
    />
  );
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeRoute />} />
          <Route path="/projects/:projectId" element={<BoardRoute />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
