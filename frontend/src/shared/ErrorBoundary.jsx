import React from "react";

/**
 * Minimal Error Boundary so runtime render errors show on screen
 * instead of a blank page. It does not change your App logic.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    // Log to console so the stack trace can be inspected in DevTools.
    // In production, this is a safe place to report errors to a logging service.
    console.error("UI crashed:", error, info);
  }
  render() {
    const { error } = this.state;
    if (error) {
      return (
        <pre
          style={{
            whiteSpace: "pre-wrap",
            background: "#fff4f4",
            color: "#a40000",
            padding: 16,
            border: "1px solid #ffd6d6",
            margin: 16,
            borderRadius: 8,
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          }}
        >{`UI crashed:
    ${error?.message || error}

    Open DevTools → Console to see the full stack trace.`}</pre>
      );
    }
    return this.props.children;
  }
}
