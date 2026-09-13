const ReloadButton = () => {
  const handleReload = () => {
    window.location.reload();
  };
  return (
    <button
      onClick={handleReload}
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
      Reload Page
    </button>
  );
};

export default ReloadButton;
