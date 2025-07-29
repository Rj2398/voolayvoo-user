"use client";

export default function BackButton() {
  return (
    <div className="back-btn" style={{ cursor: "pointer", width: "100%", padding: "0 20px" }}>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          window.history.back();
        }}
      >
        <img src="/images/left-arrow.svg" alt="Back" style={{
          filter: "brightness(0) saturate(100%)", // Makes the SVG pure black
        }} />
      </a>
    </div>
  );
}