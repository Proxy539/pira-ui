import { useEffect, useState } from 'react';
import './ProjectList.css';
import { fetchProjects } from '../api/projects';
import ProjectCard from './ProjectCard';

function ProjectList({ onSelectProject }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProjects()
      .then(data => {
        setProjects(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="list-status">Loading...</p>;
  if (error) return <p className="list-status list-error">Error: {error}</p>;

  return (
    <div className="project-list-page">
      <div className="project-list-header">
        <h1>Projects</h1>
        <span className="header-badge">{projects.length} total</span>
      </div>
      <div className="project-list">
        {projects.map(project => (
          <ProjectCard
            key={project.id}
            project={project}
            onClick={() => onSelectProject(project)}
          />
        ))}
        {projects.length === 0 && (
          <p className="list-status">No projects found.</p>
        )}
      </div>
    </div>
  );
}

export default ProjectList;
