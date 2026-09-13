/* eslint-disable react/prop-types */
import { toJpeg, toPng } from "html-to-image";
import GooglePay from "./GooglePay";
import PopupModal from "./PopupModal";
import { useState } from "react";
import "./GenerateImage.css";

const GenerateImage = ({
  name,
  month,
  date,
  googlePay,
  balance,
  total,
  selectedNewspapers,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleDownloadPng = () => {
    const node = document.getElementById("image-content");
    const options = {
      quality: 1.0,
      pixelRatio: 2,
      backgroundColor: "#d5dff0",
      width: node.offsetWidth,
      height: node.offsetHeight,
      style: {
        transform: "scale(1)",
        transformOrigin: "top left",
      },
    };
    toPng(node, options)
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "bill-invoice.png";
        link.href = dataUrl;
        link.click();
      })
      .catch((error) => {
        console.error("Oops, something went wrong!", error);
      });
  };

  const handleDownloadJpeg = () => {
    const node = document.getElementById("image-content");
    const options = {
      quality: 1.0,
      pixelRatio: 2,
      backgroundColor: "#d5dff0",
      width: node.offsetWidth,
      height: node.offsetHeight,
      style: {
        transform: "scale(1)",
        transformOrigin: "top left",
      },
    };
    toJpeg(node, options)
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "bill-invoice.jpeg";
        link.href = dataUrl;
        link.click();
      })
      .catch((error) => {
        console.error("Oops, something went wrong!", error);
      });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  return (
    <div className="invoice-container">
      <div className="invoice-scroll-wrapper">
        <div
          style={{
            padding: 10,
            border: "2px solid rgb(212 208 208)",
            background: "#d5dff0",
            width: "794px",
            maxWidth: "794px",
            minWidth: "794px",
            boxSizing: "border-box",
            flexShrink: 0,
          }}
          id="image-content"
        >
        <div
          style={{
            padding: 10,
            border: "2px solid rgb(212 208 208)",
            background: "#cfd4de",
          }}
        >
          <div style={{ border: "2px solid black", background: "#fff" }}>
            <header>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <span
                  style={{
                    fontWeight: "Bold",
                    textAlign: "center",
                    fontSize: 12,
                    marginTop: 5,
                    color: "#000",
                  }}
                >
                  || श्री कालिका माता प्रसन्न  ||
                </span>
                <span
                  style={{
                    fontFamily: "math",
                    fontSize: 40,
                    fontWeight: 600,
                    color: "#000",
                    textAlign: "center",
                    textTransform: "uppercase",
                  }}
                >
                  Om News Paper Agency
                </span>
                {/* <span
                  style={{
                    fontFamily:
                      "math, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
                    fontSize: 22,
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    display: "inline-block",
                    padding: "8px 16px",
                    borderRadius: 10,
                    background: "linear-gradient(90deg, #ff8c42, #ffd700)",
                    color: "#fff", // White text on strong colors
                    textShadow: "0 2px 4px rgba(0,0,0,0.3)", // makes text readable on bright bg
                  }}
                >
                </span> */}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row-reverse",
                  justifyContent: "space-between",
                  marginTop: 20,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    textAlign: "start",
                    gap: 10,
                  }}
                >
                  {/* <div>
                    <GooglePay />
                  </div> */}

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      textAlign: "start",
                      marginRight: 50,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: "bold",
                        fontFamily: "sans-serif",
                        color: "#000",
                      }}
                    >
                      Google pay / <br /> Phone Pay
                    </span>
                    <span
                      style={{
                        fontSize: 15,
                        fontWeight: "bold",
                        color: "#000",
                        marginTop: -5,
                      }}
                    >
                      {googlePay}
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    height: "10%",
                    marginTop: 12,
                  }}
                >
                  <div
                    style={{
                      fontSize: 16,
                      marginLeft: 20,
                      fontWeight: "bold",
                      fontFamily: "sans-serif",
                      color: "#000",
                    }}
                  >
                    Name -
                  </div>
                  <div
                    style={{
                      fontFamily: "sans-serif",
                      color: "#000",
                      borderBottom: "2px solid #000",
                      marginRight: 20,
                      marginLeft: 5,
                      fontSize: 16,
                    }}
                  >
                    {name}{" "}
                  </div>
                </div>
              </div>
              <div>
                {/* <section
                  style={{
                    backgroundColor: "#0056b3",
                    color: "#fff",
                    padding: "1px 10px",
                  }}
                >
                  <h3>Our new service is live! Book a ride now!</h3>
                </section> */}
                <div style={{ background: "#fff", textAlign: "center" }}>
                  <b style={{ color: "black", textAlign: "center" }}>Note :- </b>
                  <span
                    style={{ color: "red", fontWeight: "bold", fontSize: 17, textAlign: "center" }}
                  >
                    {""}Please send a screenshot of the payment proof via
                    WhatsApp.{""}
                  </span>
                </div>

                <PopupModal
                  isOpen={isModalOpen}
                  closeModal={handleCloseModal}
                />
              </div>
              <hr style={{ border: "1px solid black" }} />
            </header>
            <div
              style={{
                padding: "0px 20px",
                display: "flex",
              }}
            >
              <div
                style={{ width: "100%", textAlign: "start", paddingLeft: 20 }}
              >
                <span
                  style={{
                    fontSize: 16,
                    marginRight: 10,
                    fontWeight: "bold",
                    fontFamily: "sans-serif",
                    color: "#000",
                  }}
                >
                  Month - {month}
                </span>
              </div>
              <div
                style={{ width: "100%", textAlign: "start", paddingLeft: 105 }}
              >
                <span
                  style={{
                    fontSize: 16,
                    marginRight: 10,
                    fontWeight: "bold",
                    fontFamily: "sans-serif",
                    color: "#000",
                  }}
                >
                  Date - {date}
                </span>
              </div>
            </div>
            <hr style={{ border: "1px solid black" }} />
            <div
              style={{
                display: "flex",
              }}
            >
              <div style={{ width: "100%" }}>
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    fontFamily: "sans-serif",
                    color: "#000",
                    textAlign: "center",
                    display: "block",
                  }}
                >
                  Paper Name
                </span>
              </div>
              <hr
                style={{
                  border: "1px solid black",
                  height: 40,
                  margin: "-8px 0px -8px 0px ",
                  padding: 0,
                  marginLeft: 120,
                }}
              />

              <div style={{ width: "100%" }}>
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    fontFamily: "sans-serif",
                    color: "#000",
                    textAlign: "center",
                    display: "block",
                  }}
                >
                  Amount
                </span>
              </div>
            </div>
            <hr style={{ border: "1px solid black" }} />
            <div
              style={{
                display: "flex",
              }}
            >
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                  <div>
                    <ul>
                      {selectedNewspapers.map((item, index) => (
                        <h3 key={index} style={{ textAlign: "center" }}>
                          {item.newspapers.map((n) => n.label).join(", ")}
                        </h3>
                      ))}
                    </ul>
                  </div>

                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      padding: "0px -10px",
                      width: "100%",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 13,
                        marginLeft: 20,
                        textAlign: "left",
                        fontWeight: "bold",
                        fontFamily: "sans-serif",
                        color: "#000",
                        marginTop: 30,
                      }}
                    >
                      Contact No.
                    </span>
                    <p
                      style={{
                        fontSize: 13,
                        marginLeft: 20,
                        textAlign: "left",
                        fontWeight: "bold",
                        fontFamily: "sans-serif",
                        color: "#000",
                        width: "100%",
                      }}
                    >
                        <br/> 7262889526
                    </p>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      marginRight: -120,
                      marginTop: 25,
                    }}
                  >
                    <p
                      style={{
                        fontSize: 13,
                        marginRight: 20,
                        fontWeight: "bold",
                        textAlign: "right",
                        fontFamily: "sans-serif",
                        color: "#000",
                      }}
                    >
                      Balance
                    </p>
                    <p
                      style={{
                        fontSize: 13,
                        marginRight: 20,
                        fontWeight: "bold",
                        textAlign: "right",
                        fontFamily: "sans-serif",
                        color: "#000",
                      }}
                    >
                      Total Amount
                    </p>
                  </div>
                </div>
              </div>
              <hr
                style={{
                  border: "1px solid black",
                  height: "30rem",
                  margin: "-8px 0px -1px 120px ",
                  padding: 0,
                }}
              />

              <div
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <span
                  style={{
                    fontSize: 16,
                    marginRight: 10,
                    fontWeight: "bold",
                    fontFamily: "sans-serif",
                    color: "#000",
                  }}
                >
                  {selectedNewspapers.length > 0 && (
                    <div>
                      <ul>
                        {selectedNewspapers.map((item, index) => (
                          <h3 key={index} style={{ textAlign: "center" }}>₹{item.amount}</h3>
                        ))}
                      </ul>
                    </div>
                  )}
                </span>
                <div>
                  <hr style={{ border: "1px solid black" }} />
                  <p
                    style={{
                      fontSize: 16,
                      fontWeight: "bold",
                      fontFamily: "sans-serif",
                      color: "#000",
                      textAlign: "center",
                    }}
                  >
                    {" "}
                    {balance}
                  </p>
                  <hr style={{ border: "1px solid black" }} />
                  <p
                    style={{
                      fontSize: 16,
                      fontWeight: "bold",
                      fontFamily: "sans-serif",
                      color: "#000",
                      textAlign: "center",
                    }}
                  >
                    {" "}
                    {total}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <span style={{ color: "black", fontWeight: "bolder" }}>
              We accept old newspapers only on Saturdays and Sundays.
            </span>
          </div>
        </div>
      </div>
      </div>
      <div className="download-buttons">
        <button
          onClick={handleDownloadPng}
          style={{
            backgroundColor: "#6c63ff",
            color: "white",
            border: "none",
            padding: "10px 20px",
            fontSize: "16px",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
            margin: "10px 5px",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#574fcf")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#6c63ff")}
          onMouseDown={(e) => (e.target.style.backgroundColor = "#453abd")}
          onMouseUp={(e) => (e.target.style.backgroundColor = "#574fcf")}
        >
          Download as PNG
        </button>
        <button
          onClick={handleDownloadJpeg}
          style={{
            backgroundColor: "#6c63ff",
            color: "white",
            border: "none",
            padding: "10px 20px",
            fontSize: "16px",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
            margin: "10px 5px",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#574fcf")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#6c63ff")}
          onMouseDown={(e) => (e.target.style.backgroundColor = "#453abd")}
          onMouseUp={(e) => (e.target.style.backgroundColor = "#574fcf")}
        >
          Download as JPEG
        </button>
      </div>
    </div>
  );
};

export default GenerateImage;
