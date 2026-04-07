import { useEffect, useState }  from "react";
import './ProjectList.css';
import { fetchProjects } from "../api/projects";
import ProjectCard from './ProjectCard';

function ProjectList() {
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
    })
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="project-list">
      {projects.map(project => (
        <ProjectCard key={project.id} project={project}/>
      ))}
    </div>
  );
}

export default ProjectList;
