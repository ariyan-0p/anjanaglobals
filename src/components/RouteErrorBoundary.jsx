import { Component } from 'react'
import { CHUNK_RE, reloadOnceForNewVersion } from '../lib/chunkReload'

export default class RouteErrorBoundary extends Component {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error) {
    if (CHUNK_RE.test(String(error?.message || error))) reloadOnceForNewVersion()
  }

  render() {
    if (!this.state.failed) return this.props.children
    return (
      <main className="route-error">
        <div className="wrap">
          <p className="eyebrow">We hit a snag</p>
          <h1 className="d-m">This page didn&apos;t load</h1>
          <p className="lead">The site may have just been updated. A quick reload will bring you to the latest version.</p>
          <button type="button" className="btn btn--plain" onClick={() => window.location.reload()}>Reload the page</button>
        </div>
      </main>
    )
  }
}
