import React from "react";
declare namespace JSX {
  interface IntrinsicElements {
    // Add types for your HTML elements used in JSX
    div: React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    >;
    span: React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLSpanElement>,
      HTMLSpanElement
    >;
    // Add more if needed
  }
}
