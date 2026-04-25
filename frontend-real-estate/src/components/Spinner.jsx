import React from "react";

export default function Spinner({ size = 18, color = "#00dcb4" }) {
  return (
    <span
      style={{
        display: "inline-block",
        width:  size,
        height: size,
        borderRadius: "50%",
        border: `2px solid ${color}30`,
        borderTopColor: color,
        animation: "spin 0.65s linear infinite",
        flexShrink: 0,
      }}
    />
  );
}
