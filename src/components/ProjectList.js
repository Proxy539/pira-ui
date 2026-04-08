import { useEffect, useState } from 'react';
import './ProjectList.css';
import { fetchProjects, createProject } from '../api/projects';
import ProjectCard from './ProjectCard';

function ProjectList({ onSelectProject }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

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

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    createProject(formData)
      .then(newProject => {
        setProjects(prev => [...prev, newProject]);
        setFormData({ title: '', description: '' });
        setShowForm(false);
        setSubmitting(false);
      })
      .catch(err => {
        setFormError(err.message);
        setSubmitting(false);
      });
  }

  if (loading) return <p className="list-status">Loading...</p>;
  if (error) return <p className="list-status list-error">Error: {error}</p>;

  return (
    <div className="project-list-page">
      <div className="project-list-header">
        <h1>Projects</h1>
        <span className="header-badge">{projects.length} total</span>
        <button className="create-project-btn" onClick={() => setShowForm(v => !v)}>
          + Create Project
        </button>
      </div>

      {showForm && (
        <form className="create-project-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="proj-title">Title</label>
            <input
              id="proj-title"
              type="text"
              placeholder="Project title"
              value={formData.title}
              onChange={e => setFormData(d => ({ ...d, title: e.target.value }))}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="proj-desc">Description</label>
            <textarea
              id="proj-desc"
              placeholder="Project description"
              value={formData.description}
              onChange={e => setFormData(d => ({ ...d, description: e.target.value }))}
              rows={3}
            />
          </div>
          {formError && <p className="form-error">{formError}</p>}
          <div className="form-actions">
            <button type="submit" className="form-submit-btn" disabled={submitting}>
              {submitting ? 'Creating…' : 'Create'}
            </button>
            <button type="button" className="form-cancel-btn" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}

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
