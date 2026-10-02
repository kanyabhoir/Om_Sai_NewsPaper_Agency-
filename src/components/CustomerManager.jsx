import { useState, useEffect } from "react";
import Toast from "./Toast";
import {
  getCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  getErrorMessage,
} from "../api/customers";
import "./CustomerManager.css";

const CustomerManager = ({ isOpen, onClose }) => {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  // Load customers from MongoDB when modal opens
  useEffect(() => {
    if (!isOpen) {
      setForm({ name: "", phone: "", address: "" });
      setEditingId(null);
      return;
    }

    const fetchCustomers = async () => {
      setLoading(true);
      try {
        // await = wait for API, then continue
        const data = await getCustomers();
        setCustomers(data);
      } catch (error) {
        showToast(getErrorMessage(error, "Could not load customers"), "error");
      } finally {
        // always runs (success or error)
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [isOpen]);

  const resetForm = () => {
    setForm({ name: "", phone: "", address: "" });
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
      showToast("Customer name is required", "error");
      return;
    }

    const payload = {
      name,
      phone: form.phone.trim(),
      address: form.address.trim(),
    };

    setSaving(true);
    try {
      if (editingId) {
        const updated = await updateCustomer(editingId, payload);
        setCustomers((prev) =>
          prev.map((c) => (c._id === editingId ? updated : c))
        );
        showToast("Customer updated successfully");
      } else {
        const created = await addCustomer(payload);
        setCustomers((prev) => [created, ...prev]);
        showToast("Customer added successfully");
      }
      resetForm();
    } catch (error) {
      showToast(getErrorMessage(error, "Could not save customer"), "error");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (customer) => {
    setEditingId(customer._id);
    setForm({
      name: customer.name,
      phone: customer.phone || "",
      address: customer.address || "",
    });
  };

  const handleDelete = async (id) => {
    const customer = customers.find((c) => c._id === id);
    if (!window.confirm(`Remove customer "${customer?.name}"?`)) return;

    try {
      await deleteCustomer(id);
      setCustomers((prev) => prev.filter((c) => c._id !== id));
      if (editingId === id) resetForm();
      showToast("Customer removed");
    } catch (error) {
      showToast(getErrorMessage(error, "Could not remove customer"), "error");
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
          <h2>Customers</h2>
          <button className="customer-close" onClick={onClose} type="button">
            ×
          </button>
        </div>

        <div className="customer-content">
          <form className="customer-form" onSubmit={handleSubmit}>
            <h3>{editingId ? "Edit Customer" : "Add Customer"}</h3>
            <div className="customer-field">
              <label htmlFor="customer-name">Name *</label>
              <input
                id="customer-name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter customer name"
                autoComplete="name"
              />
            </div>
            <div className="customer-field">
              <label htmlFor="customer-phone">Phone</label>
              <input
                id="customer-phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                autoComplete="tel"
              />
            </div>
            <div className="customer-field">
              <label htmlFor="customer-address">Address</label>
              <input
                id="customer-address"
                name="address"
                type="text"
                value={form.address}
                onChange={handleChange}
                placeholder="Enter address"
                autoComplete="street-address"
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
                    ? "Update Customer"
                    : "Add Customer"}
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
              Customer List
              <span className="customer-count">{customers.length}</span>
            </h3>
            {loading ? (
              <p className="customer-empty">Loading customers...</p>
            ) : customers.length === 0 ? (
              <p className="customer-empty">No customers yet. Add one above.</p>
            ) : (
              <ul className="customer-list">
                {customers.map((customer) => (
                  <li
                    key={customer._id}
                    className={`customer-list-item${
                      editingId === customer._id ? " is-editing" : ""
                    }`}
                  >
                    <div className="customer-list-info">
                      <strong>{customer.name}</strong>
                      {customer.phone && <span>{customer.phone}</span>}
                      {customer.address && (
                        <span className="customer-address">
                          {customer.address}
                        </span>
                      )}
                    </div>
                    <div className="customer-list-actions">
                      <button
                        type="button"
                        className="customer-btn-edit"
                        onClick={() => handleEdit(customer)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="customer-btn-delete"
                        onClick={() => handleDelete(customer._id)}
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

export default CustomerManager;
