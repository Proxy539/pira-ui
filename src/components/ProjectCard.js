import './ProjectCard.css';

function ProjectCard({ project, onClick }) {
  return (
    <div className="project-card" onClick={onClick}>
      <div className="project-card-avatar">
        {project.title.charAt(0).toUpperCase()}
      </div>
      <div className="project-card-body">
        <h3>{project.title}</h3>
        <p>{project.description}</p>
      </div>
      <span className="project-card-arrow">›</span>
    </div>
  );
}

export default ProjectCard;
