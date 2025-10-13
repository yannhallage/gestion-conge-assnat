import React from "react";
import Modal from "react-modal";

Modal.setAppElement("#root"); // Tu peux aussi le mettre ailleurs une seule fois (par ex. dans App.tsx)

interface CustomModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children?: React.ReactNode;
}

const customStyles: Modal.Styles = {
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        transform: "translate(-50%, -50%)",
        padding: "2rem",
        borderRadius: "10px",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
        minWidth: "300px",
        maxWidth: "90%",
    },
    overlay: {
        backgroundColor: "rgba(0, 0, 0, 0.4)",
    },
};

const CustomModal: React.FC<CustomModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            style={customStyles}
            contentLabel={title || "Modal"}
        >
            {title && <h2 style={{ marginBottom: "1rem" }}>{title}</h2>}

            <div>{children}</div>

            <button
                onClick={onClose}
                style={{
                    marginTop: "1.5rem",
                    padding: "8px 16px",
                    // borderRadius: ",
                    border: "none",
                    background: "#dc3545",
                    color: "white",
                    cursor: "pointer",
                }}
            >
                Fermer
            </button>
        </Modal>
    );
};

export default CustomModal;
