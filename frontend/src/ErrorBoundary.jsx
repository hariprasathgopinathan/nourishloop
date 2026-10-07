import React from 'react';
export class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null, errorInfo: null }; }
  componentDidCatch(error, errorInfo) { this.setState({ error, errorInfo }); }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 20, color: 'red', background: '#ffebee', minHeight: '100vh' }}>
          <h2>Frontend Crash!</h2>
          <pre>{this.state.error.toString()}</pre>
          <pre>{this.state.errorInfo.componentStack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}
