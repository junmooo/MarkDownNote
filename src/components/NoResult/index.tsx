import React from "react";

export const NoResult = React.memo(function NoResult(props: { type: string }) {
  const { type } = props;
  return (
    <div
      style={{
        padding: "40px 10px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontSize: "14px",
        color: "#808080",
      }}
    >
      <span>{type} something wrong</span>
    </div>
  );
});
