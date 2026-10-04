import { useState, useEffect } from "react";
import Toast from "./Toast";
import {
  getNewspapers,
  addNewspaper,
  updateNewspaper,
  deleteNewspaper,
  getErrorMessage,
} from "../api/newspapers";
import "./CustomerManager.css";

const NewspaperManager = ({ isOpen, onClose }) => {
  const [newspapers, setNewspapers] = useState([]);
  const [form, setForm] = useState({ name: "" });
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (!isOpen) {
      setForm({ name: "" });
      setEditingId(null);
      return;
    }

    const fetchNewspapers = async () => {
      setLoading(true);
      try {
        const data = await getNewspapers();
        setNewspapers(data);
      } catch (error) {
        showToast(getErrorMessage(error, "Could not load newspapers"), "error");
      } finally {
        setLoading(false);
      }
    };

    fetchNewspapers();
  }, [isOpen]);

  const resetForm = () => {
    setForm({ name: "" });
    setEditingId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = form.name.trim();
    if (!name) {
      showToast("Newspaper name is required", "error");
      return;
    }

    const payload = { name };

    setSaving(true);
    try {
      if (editingId) {
        const updated = await updateNewspaper(editingId, payload);
        setNewspapers((prev) =>
          prev.map((n) => (n._id === editingId ? updated : n))
        );
        showToast("Newspaper updated successfully");
      } else {
        const created = await addNewspaper(payload);
        setNewspapers((prev) => [created, ...prev]);
        showToast("Newspaper added successfully");
      }
      resetForm();
    } catch (error) {
      showToast(getErrorMessage(error, "Could not save newspaper"), "error");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (newspaper) => {
    setEditingId(newspaper._id);
    setForm({ name: newspaper.name });
  };

  const handleDelete = async (id) => {
    const newspaper = newspapers.find((n) => n._id === id);
    if (!window.confirm(`Remove newspaper "${newspaper?.name}"?`)) return;

    try {
      await deleteNewspaper(id);
      setNewspapers((prev) => prev.filter((n) => n._id !== id));
      if (editingId === id) resetForm();
      showToast("Newspaper removed");
    } catch (error) {
      showToast(getErrorMessage(error, "Could not remove newspaper"), "error");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="customer-overlay"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="customer-modal" onClick={(e) => e.stopPropagation()}>
        <div className="customer-header">
          <h2>Newspapers</h2>
          <button className="customer-close" onClick={onClose} type="button">
            ×
          </button>
        </div>

        <div className="customer-content">
          <form className="customer-form" onSubmit={handleSubmit}>
            <h3>{editingId ? "Edit Newspaper" : "Add Newspaper"}</h3>
            <div className="customer-field">
              <label htmlFor="newspaper-name">Name *</label>
              <input
                id="newspaper-name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter newspaper name"
                autoComplete="off"
              />
            </div>
            <div className="customer-form-actions">
              <button
                type="submit"
                className="customer-btn-primary"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Newspaper"
                    : "Add Newspaper"}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="customer-btn-secondary"
                  onClick={resetForm}
                  disabled={saving}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="customer-list-section">
            <h3>
              Newspaper List
              <span className="customer-count">{newspapers.length}</span>
            </h3>
            {loading ? (
              <p className="customer-empty">Loading newspapers...</p>
            ) : newspapers.length === 0 ? (
              <p className="customer-empty">No newspapers yet. Add one above.</p>
            ) : (
              <ul className="customer-list">
                {newspapers.map((newspaper) => (
                  <li
                    key={newspaper._id}
                    className={`customer-list-item${
                      editingId === newspaper._id ? " is-editing" : ""
                    }`}
                  >
                    <div className="customer-list-info">
                      <strong>{newspaper.name}</strong>
                    </div>
                    <div className="customer-list-actions">
                      <button
                        type="button"
                        className="customer-btn-edit"
                        onClick={() => handleEdit(newspaper)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="customer-btn-delete"
                        onClick={() => handleDelete(newspaper._id)}
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="customer-footer">
          <button
            type="button"
            className="customer-btn-primary"
            onClick={onClose}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewspaperManager;
