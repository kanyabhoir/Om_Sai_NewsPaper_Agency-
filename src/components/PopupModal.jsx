import "./PopupModal.css";
import BookRide from "./NewServices/BookRide";

const PopupModal = ({ isOpen, closeModal }) => {
  if (!isOpen) return null; 

  return (
    <div className="popup-overlay">
      <div className="popup-modal">
        <div className="popup-header">
          <h3></h3>
          <span className="close-icon" onClick={closeModal}>
            &times;
          </span>
        </div>
        <div className="popup-body">
          <BookRide />
        </div>
      </div>
    </div>
  );
};

export default PopupModal;
