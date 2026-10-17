import { useState, useEffect } from "react";
import { toPng } from "html-to-image";
import Toast from "./Toast";
import {
  getCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  addCustomerPayment,
  deleteCustomerPayment,
  getErrorMessage,
} from "../api/customers";
import "./CustomerManager.css";

function currentMonthValue() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${now.getFullYear()}-${month}`;
}

function formatMonth(value) {
  const [year, month] = value.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
}

function formatRupees(amount) {
  return `₹${Number(amount).toLocaleString("en-IN")}`;
}

function monthTotal(payments, month) {
  return (payments || [])
    .filter((payment) => payment.month === month)
    .reduce((sum, payment) => sum + Number(payment.amount), 0);
}

function statementPayments(payments) {
  return [...(payments || [])].sort(
    (a, b) => new Date(a.paidAt) - new Date(b.paidAt)
  );
}

function dataUrlToBlob(dataUrl) {
  const [header, data] = dataUrl.split(",");
  const mime = header.match(/:(.*?);/)[1];
  const binary = atob(data);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: mime });
}

const CustomerManager = ({ isOpen, onClose }) => {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [paymentCustomerId, setPaymentCustomerId] = useState(null);
  const [paymentForm, setPaymentForm] = useState({
    amount: "",
    mode: "cash",
    month: currentMonthValue(),
  });
  const [savingPayment, setSavingPayment] = useState(false);
  const [proofCustomerId, setProofCustomerId] = useState(null);
  const [proofImage, setProofImage] = useState("");
  const [sharingProof, setSharingProof] = useState(false);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  // Load customers from MongoDB when modal opens
  useEffect(() => {
    if (!isOpen) {
      setForm({ name: "", phone: "", address: "" });
      setEditingId(null);
      setSearch("");
      setPaymentCustomerId(null);
      setProofCustomerId(null);
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

  // Build the proof image as soon as the preview opens, so Send
  // can open WhatsApp in the same tap.
  useEffect(() => {
    if (!isOpen || !proofCustomerId) {
      setProofImage("");
      return undefined;
    }

    let cancelled = false;
    setProofImage("");
    const timer = setTimeout(async () => {
      const node = document.getElementById("customer-payment-proof");
      if (!node || cancelled) return;
      try {
        const dataUrl = await toPng(node, {
          pixelRatio: 2,
          backgroundColor: "#ffffff",
        });
        if (!cancelled) setProofImage(dataUrl);
      } catch (error) {
        if (!cancelled) {
          setProofImage("");
          showToast("Could not prepare the proof", "error");
        }
      }
    }, 80);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [isOpen, proofCustomerId, customers]);

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

  const openPayment = (customerId) => {
    setPaymentCustomerId((current) =>
      current === customerId ? null : customerId
    );
    setPaymentForm({
      amount: "",
      mode: "cash",
      month: currentMonthValue(),
    });
  };

  const handlePaymentSubmit = async (e, customerId) => {
    e.preventDefault();
    const amount = Number(paymentForm.amount);

    if (!amount || amount <= 0) {
      showToast("Enter the amount the customer paid", "error");
      return;
    }

    setSavingPayment(true);
    try {
      const updated = await addCustomerPayment(customerId, {
        amount,
        mode: paymentForm.mode,
        month: paymentForm.month,
      });
      setCustomers((prev) =>
        prev.map((customer) =>
          customer._id === customerId ? updated : customer
        )
      );
      setPaymentForm((prev) => ({ ...prev, amount: "" }));
      showToast("Payment saved in customer history");
    } catch (error) {
      showToast(getErrorMessage(error, "Could not save payment"), "error");
    } finally {
      setSavingPayment(false);
    }
  };

  const handleDeletePayment = async (customerId, payment) => {
    const label = `${formatRupees(payment.amount)} (${payment.mode}) for ${formatMonth(payment.month)}`;
    if (!window.confirm(`Remove this payment?\n${label}`)) return;

    try {
      const updated = await deleteCustomerPayment(customerId, payment._id);
      setCustomers((prev) =>
        prev.map((customer) =>
          customer._id === customerId ? updated : customer
        )
      );
      showToast("Payment removed");
    } catch (error) {
      showToast(getErrorMessage(error, "Could not remove payment"), "error");
    }
  };

  const handleShareProof = async (customer) => {
    const payments = statementPayments(customer.payments);
    if (!proofImage || payments.length === 0) {
      showToast("Proof is still preparing. Try again in a moment.", "error");
      return;
    }

    const blob = dataUrlToBlob(proofImage);
    const safeName =
      customer.name.trim().replace(/[<>:"/\\|?*]/g, "") || "customer";
    const file = new File([blob], `${safeName}-payment-history.png`, {
      type: "image/png",
    });

    setSharingProof(true);
    try {
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file] });
        setProofCustomerId(null);
        showToast("Payment proof image shared");
        return;
      }

      const link = document.createElement("a");
      link.download = file.name;
      link.href = proofImage;
      link.click();
      setProofCustomerId(null);
      showToast("Proof image downloaded. Send only that image to the customer.");
    } catch (error) {
      if (error?.name === "AbortError") return;
      showToast("Could not share the payment proof", "error");
    } finally {
      setSharingProof(false);
    }
  };

  const handleDelete = async (id) => {
    const customer = customers.find((c) => c._id === id);
    if (!window.confirm(`Remove customer "${customer?.name}"?`)) return;

    try {
      await deleteCustomer(id);
      setCustomers((prev) => prev.filter((c) => c._id !== id));
      if (editingId === id) resetForm();
      if (paymentCustomerId === id) setPaymentCustomerId(null);
      if (proofCustomerId === id) setProofCustomerId(null);
      showToast("Customer removed");
    } catch (error) {
      showToast(getErrorMessage(error, "Could not remove customer"), "error");
    }
  };

  const query = search.trim().toLowerCase();
  const visibleCustomers = query
    ? customers.filter((customer) => {
        const haystack = `${customer.name} ${customer.phone || ""} ${
          customer.address || ""
        }`.toLowerCase();
        return haystack.includes(query);
      })
    : customers;
  const thisMonth = currentMonthValue();
  const proofCustomer = customers.find(
    (customer) => customer._id === proofCustomerId
  );
  const proofPayments = proofCustomer
    ? statementPayments(proofCustomer.payments)
    : [];

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
            <div className="customer-field">
              <label htmlFor="customer-search">Find customer</label>
              <input
                id="customer-search"
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, phone, or address"
              />
            </div>
            {loading ? (
              <p className="customer-empty">Loading customers...</p>
            ) : customers.length === 0 ? (
              <p className="customer-empty">No customers yet. Add one above.</p>
            ) : visibleCustomers.length === 0 ? (
              <p className="customer-empty">No customer matches that search.</p>
            ) : (
              <ul className="customer-list">
                {visibleCustomers.map((customer) => {
                  const payments = [...(customer.payments || [])].sort(
                    (a, b) => new Date(b.paidAt) - new Date(a.paidAt)
                  );
                  const paidThisMonth = monthTotal(payments, thisMonth);
                  const isPaymentOpen = paymentCustomerId === customer._id;

                  return (
                    <li
                      key={customer._id}
                      className={`customer-list-item${
                        editingId === customer._id ? " is-editing" : ""
                      }`}
                    >
                      <div className="customer-list-row">
                        <div className="customer-list-info">
                          <strong>{customer.name}</strong>
                          {customer.phone && <span>{customer.phone}</span>}
                          {customer.address && (
                            <span className="customer-address">
                              {customer.address}
                            </span>
                          )}
                          <span
                            className={
                              paidThisMonth > 0
                                ? "customer-month-paid"
                                : "customer-month-due"
                            }
                          >
                            {formatMonth(thisMonth)}:{" "}
                            {paidThisMonth > 0
                              ? `${formatRupees(paidThisMonth)} paid`
                              : "not paid yet"}
                          </span>
                        </div>
                        <div className="customer-list-actions">
                          <button
                            type="button"
                            className="customer-btn-pay"
                            onClick={() => openPayment(customer._id)}
                          >
                            {isPaymentOpen ? "Close" : "Add payment"}
                          </button>
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
                      </div>

                      {isPaymentOpen && (
                        <div className="customer-payment">
                          <form
                            className="customer-payment-form"
                            onSubmit={(e) =>
                              handlePaymentSubmit(e, customer._id)
                            }
                          >
                            <div className="customer-field">
                              <label htmlFor={`pay-month-${customer._id}`}>
                                Month
                              </label>
                              <input
                                id={`pay-month-${customer._id}`}
                                type="month"
                                value={paymentForm.month}
                                onChange={(e) =>
                                  setPaymentForm((prev) => ({
                                    ...prev,
                                    month: e.target.value,
                                  }))
                                }
                                required
                              />
                            </div>
                            <div className="customer-field">
                              <label htmlFor={`pay-amount-${customer._id}`}>
                                Amount
                              </label>
                              <input
                                id={`pay-amount-${customer._id}`}
                                type="number"
                                min="1"
                                step="1"
                                inputMode="numeric"
                                value={paymentForm.amount}
                                onChange={(e) =>
                                  setPaymentForm((prev) => ({
                                    ...prev,
                                    amount: e.target.value,
                                  }))
                                }
                                placeholder="Amount customer paid"
                              />
                            </div>
                            <div className="customer-field">
                              <span className="customer-mode-label">
                                Payment mode
                              </span>
                              <div className="customer-mode-options">
                                <button
                                  type="button"
                                  className={`customer-mode-btn${
                                    paymentForm.mode === "cash" ? " is-active" : ""
                                  }`}
                                  onClick={() =>
                                    setPaymentForm((prev) => ({
                                      ...prev,
                                      mode: "cash",
                                    }))
                                  }
                                >
                                  Cash
                                </button>
                                <button
                                  type="button"
                                  className={`customer-mode-btn${
                                    paymentForm.mode === "online"
                                      ? " is-active"
                                      : ""
                                  }`}
                                  onClick={() =>
                                    setPaymentForm((prev) => ({
                                      ...prev,
                                      mode: "online",
                                    }))
                                  }
                                >
                                  Online
                                </button>
                              </div>
                            </div>
                            <button
                              type="submit"
                              className="customer-btn-primary"
                              disabled={savingPayment}
                            >
                              {savingPayment ? "Saving..." : "Save payment"}
                            </button>
                          </form>

                          <div className="customer-history">
                            <div className="customer-history-head">
                              <h4>Payment history</h4>
                              {payments.length > 0 && (
                                <button
                                  type="button"
                                  className="customer-btn-share"
                                  onClick={() =>
                                    setProofCustomerId(customer._id)
                                  }
                                >
                                  Share proof
                                </button>
                              )}
                            </div>
                            {payments.length === 0 ? (
                              <p className="customer-empty">
                                No payments saved yet.
                              </p>
                            ) : (
                              <ul className="customer-history-list">
                                {payments.map((payment) => (
                                  <li key={payment._id}>
                                    <div>
                                      <strong>
                                        {formatMonth(payment.month)} ·{" "}
                                        {formatRupees(payment.amount)}
                                      </strong>
                                      <span>
                                        {payment.mode === "cash"
                                          ? "Cash"
                                          : "Online"}
                                        {" · "}
                                        {new Date(
                                          payment.paidAt
                                        ).toLocaleDateString("en-IN")}
                                      </span>
                                    </div>
                                    <button
                                      type="button"
                                      className="customer-btn-delete"
                                      onClick={() =>
                                        handleDeletePayment(
                                          customer._id,
                                          payment
                                        )
                                      }
                                    >
                                      Remove
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                      )}
                    </li>
                  );
                })}
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

      {proofCustomer && proofPayments.length > 0 && (
        <div
          className="customer-proof-overlay"
          onClick={(e) => {
            e.stopPropagation();
            setProofCustomerId(null);
          }}
        >
          <div
            className="customer-proof-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <div id="customer-payment-proof" className="customer-proof-sheet">
              <p className="customer-proof-brand">Om Sai News Paper Agency</p>
              <h3>Payment history</h3>
              <p className="customer-proof-name">{proofCustomer.name}</p>
              {proofCustomer.phone && <p>Phone: {proofCustomer.phone}</p>}
              {proofCustomer.address && <p>{proofCustomer.address}</p>}
              <table>
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Amount</th>
                    <th>Mode</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {proofPayments.map((payment) => (
                    <tr key={payment._id}>
                      <td>{formatMonth(payment.month)}</td>
                      <td>{formatRupees(payment.amount)}</td>
                      <td>{payment.mode === "cash" ? "Cash" : "Online"}</td>
                      <td>
                        {new Date(payment.paidAt).toLocaleDateString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="customer-proof-note">
                Payment record · Phone 7262889526
              </p>
            </div>
            <div className="customer-proof-actions">
              <button
                type="button"
                className="customer-btn-primary"
                onClick={() => handleShareProof(proofCustomer)}
                disabled={sharingProof || !proofImage}
              >
                {proofImage ? "Send to customer" : "Preparing proof..."}
              </button>
              <button
                type="button"
                className="customer-btn-secondary"
                onClick={() => setProofCustomerId(null)}
                disabled={sharingProof}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerManager;
