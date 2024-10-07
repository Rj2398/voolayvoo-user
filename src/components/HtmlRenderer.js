import React from "react";
import parse from "html-react-parser";

const HtmlRenderer = ({ htmlContent }) => {
  return <div>{parse(htmlContent)}</div>;
};

export default HtmlRenderer;
