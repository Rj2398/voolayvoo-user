import React from "react";

const PaymentBreakDown = ({
  isOpen,
  setIsOpen,
  amount,
  getSelectedCard,
  onPayNow,
}) => {
  const last4Digits = getSelectedCard?.last4;
  const maskedCardNumber = `XXXX  XXXX  XXXX  ${last4Digits}`;

  if (!isOpen) return null;

  const handleClose = () => {
    if (typeof setIsOpen === "function") {
      setIsOpen(false);
    }
  };

  const handlePayNow = () => {
    if (onPayNow) {
      onPayNow();
    } else {
      console.log("Processing payment...");
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modalCard}>
        {/* Close Button */}
        <button
          style={styles.closeBtn}
          onClick={handleClose}
          aria-label="Close Modal"
        >
          ✕
        </button>

        {/* Modal Header */}
        <h2 style={styles.headerTitle}>Amount Payable</h2>

        {/* Card Breakdown Box */}
        <div style={styles.breakdownBox}>
          <div style={styles.cardNumber}>{maskedCardNumber}</div>

          <div style={styles.infoRow}>
            <span style={styles.label}>Name :</span>
            <span style={styles.value}>{getSelectedCard?.cardholdername}</span>
          </div>

          <div style={styles.infoRow}>
            <span style={styles.label}>Expiry :</span>
            <span style={styles.value}>
              {getSelectedCard?.exp_month + "/" + getSelectedCard?.exp_year}
            </span>
          </div>

          <div style={styles.infoRow}>
            <span style={styles.label}>Price :</span>
            <span style={styles.value}>{amount?.fee}</span>
          </div>

          <div style={styles.infoRow}>
            <span style={styles.label}>Tax Amount :</span>
            <span style={styles.value}>{amount?.tax}</span>
          </div>

          <div style={styles.infoRow}>
            <span style={styles.label}>Total Amt :</span>
            <span style={styles.value}>{amount?.total}</span>
          </div>

          {/* Pay Now Button */}
          <button style={styles.payNowBtn} onClick={handlePayNow}>
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    padding: "16px",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  modalCard: {
    position: "relative",
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    width: "100%",
    maxWidth: "380px",
    padding: "36px 20px 24px 20px",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
  },
  closeBtn: {
    position: "absolute",
    top: "12px",
    right: "12px",
    backgroundColor: "#ff3b53",
    color: "#ffffff",
    border: "none",
    borderRadius: "50%",
    width: "26px",
    height: "26px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "13px",
    fontWeight: "bold",
    cursor: "pointer",
    lineHeight: 1,
  },
  headerTitle: {
    textAlign: "center",
    color: "#ff5268",
    fontSize: "22px",
    fontWeight: "500",
    marginBottom: "20px",
  },
  breakdownBox: {
    border: "1px solid #ffd4db",
    borderRadius: "16px",
    padding: "24px 18px",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  cardNumber: {
    fontSize: "16px",
    fontWeight: "500",
    color: "#555d66",
    letterSpacing: "1px",
    marginBottom: "4px",
  },
  infoRow: {
    display: "flex",
    alignItems: "center",
    fontSize: "17px",
    color: "#4e555e",
    gap: "8px",
  },
  label: {
    fontWeight: "400",
  },
  value: {
    fontWeight: "500",
  },
  payNowBtn: {
    marginTop: "16px",
    backgroundColor: "#E60023",
    color: "#ffffff",
    border: "none",
    borderRadius: "30px",
    padding: "14px 0",
    fontSize: "17px",
    fontWeight: "600",
    cursor: "pointer",
    width: "100%",
    boxShadow: "0 4px 12px rgba(255, 42, 68, 0.25)",
    transition: "background-color 0.2s ease",
  },
};

export default PaymentBreakDown;
