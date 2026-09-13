import { useState } from "react";
import "./Clothing.css";
const Clothing = () => {
  const [formData, setFormData] = useState({
    customerName: "",
    contactInfo: "",
    date: "",
    items: [{ description: "", quantity: "", unitPrice: "" }],
    tax: "",
    discount: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const items = [...formData.items];
    items[index][name] = value;
    setFormData({ ...formData, items });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        { description: "", quantity: "", unitPrice: "" },
      ],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };
  return (
    <div className="app">
      <h1>Clothing Store Bill</h1>
      <form onSubmit={handleSubmit} className="bill-form">
        <label>
          Customer Name:
          <input
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
          />
        </label>
        <label>
          Contact Information:
          <input
            type="text"
            name="contactInfo"
            value={formData.contactInfo}
            onChange={handleChange}
          />
        </label>
        <label>
          Date:
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />
        </label>
        <h2>Items</h2>
        {formData.items.map((item, index) => (
          <div key={index} className="item">
            <label>
              Description:
              <input
                type="text"
                name="description"
                value={item.description}
                onChange={(e) => handleItemChange(index, e)}
              />
            </label>
            <label>
              Quantity:
              <input
                type="number"
                name="quantity"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, e)}
              />
            </label>
            <label>
              Unit Price:
              <input
                type="number"
                name="unitPrice"
                value={item.unitPrice}
                onChange={(e) => handleItemChange(index, e)}
              />
            </label>
          </div>
        ))}
        <button type="button" onClick={addItem}>
          Add Item
        </button>
        <label>
          Sales Tax (%):
          <input
            type="number"
            name="tax"
            value={formData.tax}
            onChange={handleChange}
          />
        </label>
        <label>
          Discount (%):
          <input
            type="number"
            name="discount"
            value={formData.discount}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
      <div className="summary">
        <h2>Summary</h2>
        <table>
          <thead>
            <tr>
              <th rowSpan="2">Description</th>
              <th colSpan="2">Quantity</th>
            </tr>
            <tr>
            </tr>
          </thead>
          {/* <tbody>
            {formData.items.map((item, index) => (
              <>
                <tr key={index} >
                  <td style={{height:'30rem'}}>{item.quantity}</td>
                  <td >{item.quantity}</td>
                </tr>
                <tr>
                  <td>{item.quantity}</td>
                </tr>
                <tr>
                  <td>{item.quantity}</td>
                </tr>
                <tr>
                </tr>
              </>
            ))}
          </tbody> */}
          <tbody>
            {formData.items.map((item,) => (
              <>
                <tr>
                  <td rowSpan="1" style={{height:'30rem'}}>{item.description}</td>
                  <td rowSpan="1">{item.quantity}</td>
                </tr>
                <tr>
                  <td rowSpan="1">{item.quantity}</td>
                  <td rowSpan="1">{item.quantity}</td>
                </tr>
                <tr>
                  <td rowSpan="1">{item.quantity}</td>
                </tr>
               
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Clothing;
