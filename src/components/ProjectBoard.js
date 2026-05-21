import { useEffect, useState } from 'react';
import './ProjectBoard.css';
import { fetchTickets, createTicket } from '../api/tickets';
import { updateProject } from '../api/projects';
import TicketCard from './TicketCard';

const COLUMNS = [
  { id: 'todo',        label: 'TO DO' },
  { id: 'in_progress', label: 'IN PROGRESS' },
  { id: 'in_review',   label: 'IN REVIEW' },
  { id: 'done',        label: 'DONE' },
];

const STATUS_MAP = {
  todo: 'todo',
  'to do': 'todo',
  to_do: 'todo',
  in_progress: 'in_progress',
  inprogress: 'in_progress',
  'in progress': 'in_progress',
  in_review: 'in_review',
  inreview: 'in_review',
  'in review': 'in_review',
  done: 'done',
  closed: 'done',
  resolved: 'done',
};

function normalizeStatus(status) {
  return STATUS_MAP[status?.toLowerCase()] || 'todo';
}

function ProjectBoard({ project, onBack, onProjectUpdate }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newType, setNewType] = useState('task');
  const [newPriority, setNewPriority] = useState('medium');
  const [createSaving, setCreateSaving] = useState(false);
  const [createError, setCreateError] = useState(null);

  function startEdit() {
    setEditTitle(project.title);
    setEditDescription(project.description || '');
    setSaveError(null);
    setEditing(true);
  }

  function cancelEdit() {
    setEditing(false);
  }

  function openCreate() {
    setNewTitle('');
    setNewDescription('');
    setNewType('task');
    setNewPriority('medium');
    setCreateError(null);
    setCreating(true);
  }

  function cancelCreate() {
    setCreating(false);
  }

  function submitCreate() {
    if (!newTitle.trim()) return;
    setCreateSaving(true);
    setCreateError(null);
    createTicket(project.id, {
      title: newTitle.trim(),
      description: newDescription.trim(),
      type: newType.toUpperCase(),
      priority: newPriority.toUpperCase(),
    })
      .then(ticket => {
        setTickets(prev => [...prev, ticket]);
        setCreating(false);
        setCreateSaving(false);
      })
      .catch(err => {
        setCreateError(err.message);
        setCreateSaving(false);
      });
  }

  function saveEdit() {
    if (!editTitle.trim()) return;
    setSaving(true);
    setSaveError(null);
    updateProject(project.id, { title: editTitle.trim(), description: editDescription.trim() })
      .then(updated => {
        setSaving(false);
        setEditing(false);
        onProjectUpdate(updated);
      })
      .catch(err => {
        setSaving(false);
        setSaveError(err.message);
      });
  }

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchTickets(project.id)
      .then(data => {
        setTickets(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [project.id]);

  const grouped = COLUMNS.reduce((acc, col) => {
    acc[col.id] = tickets.filter(t => normalizeStatus(t.status) === col.id);
    return acc;
  }, {});

  return (
    <div className="board-page">
      <div className="board-header">
        <button className="back-btn" onClick={onBack}>
          &#8592; Projects
        </button>
        <button className="project-frame" onClick={startEdit}>
          <h1>{project.title}</h1>
          {project.description && <p>{project.description}</p>}
        </button>
      </div>

      {editing && (
        <div className="edit-modal-overlay" onClick={cancelEdit}>
          <div className="edit-modal" onClick={e => e.stopPropagation()}>
            <h2 className="edit-modal-heading">Edit Project</h2>
            <div className="edit-modal-fields">
              <input
                className="edit-title-input"
                value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
                placeholder="Project title"
                autoFocus
              />
              <textarea
                className="edit-desc-input"
                value={editDescription}
                onChange={e => setEditDescription(e.target.value)}
                placeholder="Project description"
              />
            </div>
            {saveError && <p className="edit-error">{saveError}</p>}
            <div className="edit-actions">
              <button className="edit-save-btn" onClick={saveEdit} disabled={saving || !editTitle.trim()}>
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button className="edit-cancel-btn" onClick={cancelEdit} disabled={saving}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {creating && (
        <div className="edit-modal-overlay" onClick={cancelCreate}>
          <div className="create-ticket-modal" onClick={e => e.stopPropagation()}>
            <h2 className="edit-modal-heading">Create Ticket</h2>
            <div className="create-ticket-fields">
              <input
                className="edit-title-input"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="Ticket title"
                autoFocus
              />
              <textarea
                className="edit-desc-input create-ticket-desc"
                value={newDescription}
                onChange={e => setNewDescription(e.target.value)}
                placeholder="Description (optional)"
              />
              <div className="create-ticket-selects">
                <div className="create-ticket-field">
                  <label>Type</label>
                  <div className="select-group">
                    {['task', 'bug', 'story', 'epic'].map(t => (
                      <button
                        key={t}
                        className={`select-chip${newType === t ? ' active' : ''} chip-${t}`}
                        onClick={() => setNewType(t)}
                        type="button"
                      >
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="create-ticket-field">
                  <label>Priority</label>
                  <div className="select-group">
                    {['highest', 'high', 'medium', 'low', 'lowest'].map(p => (
                      <button
                        key={p}
                        className={`select-chip${newPriority === p ? ' active' : ''} chip-priority-${p}`}
                        onClick={() => setNewPriority(p)}
                        type="button"
                      >
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {createError && <p className="edit-error">{createError}</p>}
            <div className="edit-actions">
              <button className="edit-save-btn" onClick={submitCreate} disabled={createSaving || !newTitle.trim()}>
                {createSaving ? 'Creating...' : 'Create'}
              </button>
              <button className="edit-cancel-btn" onClick={cancelCreate} disabled={createSaving}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="board-subheader">
        <span className="board-label">Board</span>
        <button className="create-ticket-btn" onClick={openCreate}>+ Create Ticket</button>
      </div>

      {loading && <p className="board-status">Loading tickets...</p>}
      {error && <p className="board-status board-error">Error: {error}</p>}

      {!loading && !error && (
        <div className="board-columns">
          {COLUMNS.map(col => (
            <div className="board-column" key={col.id}>
              <div className="column-header">
                <span className="column-title">{col.label}</span>
                <span className="column-count">{grouped[col.id].length}</span>
              </div>
              <div className="column-tickets">
                {grouped[col.id].map(ticket => (
                  <TicketCard key={ticket.id} ticket={ticket} />
                ))}
                {grouped[col.id].length === 0 && (
                  <p className="column-empty">No issues</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProjectBoard;
