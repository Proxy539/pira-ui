import './App.css';
import { useState } from 'react';
import ProjectList from './components/ProjectList';
import ProjectBoard from './components/ProjectBoard';

function App() {
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <div className="App">
      {selectedProject ? (
        <ProjectBoard
          project={selectedProject}
          onBack={() => setSelectedProject(null)}
        />
      ) : (
        <ProjectList onSelectProject={setSelectedProject} />
      )}
    </div>
  );
}

export default App;
