import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

/** Without this, an uncaught error anywhere in the tree unmounts the whole
 * app and leaves a blank white screen with no clue what happened —
 * especially bad on a home-screen PWA where there's no dev console handy.
 * This turns that into a visible, recoverable screen instead. */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error('Mental Wellness crashed:', error, info.componentStack)
  }

  handleReload = () => {
    this.setState({ error: null })
    window.location.reload()
  }

  render() {
    if (!this.state.error) return this.props.children

    return (
      <div
        style={{
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          textAlign: 'center',
          background: '#f6f3ec',
          color: '#2e332f',
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif",
        }}
      >
        <div style={{ fontSize: 40, marginBottom: 12 }}>🌱</div>
        <h1 style={{ fontSize: 19, margin: '0 0 8px' }}>Something went wrong</h1>
        <p style={{ fontSize: 14, color: '#767c72', maxWidth: 320, margin: '0 0 20px' }}>
          Mental Wellness hit an unexpected error. Reloading usually fixes it — your data is safe either way.
        </p>
        <button
          onClick={this.handleReload}
          style={{
            border: 'none',
            borderRadius: 10,
            padding: '12px 24px',
            fontSize: 15,
            fontWeight: 600,
            color: 'white',
            background: '#6b8f84',
            cursor: 'pointer',
          }}
        >
          Reload
        </button>
        <pre
          style={{
            marginTop: 24,
            maxWidth: '100%',
            overflowX: 'auto',
            fontSize: 11,
            color: '#9b9a94',
            whiteSpace: 'pre-wrap',
          }}
        >
          {this.state.error.message}
        </pre>
      </div>
    )
  }
}
