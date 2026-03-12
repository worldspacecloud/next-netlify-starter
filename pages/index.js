import Head from 'next/head'
import { useState, useEffect } from 'react'

export default function Home() {
  const [status, setStatus] = useState(null)
  const [reportType, setReportType] = useState('')
  const [currentTime, setCurrentTime] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleString('en-GB', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false
      }))
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    const formData = new FormData(e.target)
    // Add auto-generated timestamp
    const timestamp = new Date().toISOString()
    formData.set('report-timestamp', timestamp)

    try {
      const response = await fetch('/__forms.html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString(),
      })

      if (response.ok) {
        setStatus('SUCCESS')
      } else {
        setStatus('ERROR')
      }
    } catch (error) {
      setStatus('ERROR')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container">
      <Head>
        <title>WorldSpace Abuse Report</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main>
        <div className="page-header">
          <h1 className="page-title">Abuse Report</h1>
          <p className="page-subtitle">Submit a report for DDoS attacks or copyright issues</p>
        </div>

        {status === 'SUCCESS' ? (
          <div className="form-card status-success">
            <h3>Report Submitted Successfully</h3>
            <p>Thank you for your report. Our team will review it and get back to you as soon as possible.</p>
          </div>
        ) : (
          <div className="form-card">
            <form name="abuse-report" method="POST" onSubmit={handleSubmit}>
              <input type="hidden" name="form-name" value="abuse-report" />
              <input type="hidden" name="report-timestamp" value="" />

              {/* Timestamp badge */}
              <div className="timestamp-badge">
                <span className="ts-dot"></span>
                Report time: {currentTime}
              </div>

              {/* Contact Info */}
              <div className="form-section">
                <div className="form-section-title">Contact Information</div>

                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input type="text" id="name" name="name" placeholder="Your full name" required />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" name="email" placeholder="you@example.com" required />
                </div>

                <div className="form-group">
                  <label htmlFor="discord">Discord ID <span className="optional-tag">(optional)</span></label>
                  <input type="text" id="discord" name="discord-id" placeholder="username#0000" />
                </div>
              </div>

              {/* Report Type Selection */}
              <div className="form-section">
                <div className="form-section-title">Report Type</div>

                <div className="report-type-selector">
                  <button
                    type="button"
                    className={`report-type-btn${reportType === 'ddos' ? ' active' : ''}`}
                    onClick={() => setReportType('ddos')}
                  >
                    <span className="btn-icon">&#9889;</span>
                    <span className="btn-label">DDoS Attack</span>
                  </button>
                  <button
                    type="button"
                    className={`report-type-btn${reportType === 'dmca' ? ' active' : ''}`}
                    onClick={() => setReportType('dmca')}
                  >
                    <span className="btn-icon">&#169;</span>
                    <span className="btn-label">Copyright / DMCA</span>
                  </button>
                </div>

                <input type="hidden" name="report-type" value={reportType} />
              </div>

              {/* DDoS Fields */}
              {reportType === 'ddos' && (
                <div className="form-section">
                  <div className="form-section-title">DDoS Attack Details</div>

                  <div className="form-group">
                    <label htmlFor="ddos-target">What is the IP address or domain under attack?</label>
                    <input type="text" id="ddos-target" name="ddos-target" placeholder="e.g. 192.168.1.1 or example.com" required />
                  </div>

                  <div className="form-group">
                    <label htmlFor="ddos-start">When did the attack start? <span className="optional-tag">(optional)</span></label>
                    <input type="datetime-local" id="ddos-start" name="ddos-start-time" />
                  </div>

                  <div className="form-group">
                    <label htmlFor="ddos-service">What type of service is affected?</label>
                    <select id="ddos-service" name="ddos-service-type" required>
                      <option value="">Select a service type...</option>
                      <option value="website">Website</option>
                      <option value="api">API</option>
                      <option value="game-server">Game Server</option>
                      <option value="email">Email Server</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="ddos-symptoms">What symptoms are you experiencing?</label>
                    <textarea id="ddos-symptoms" name="ddos-symptoms" placeholder="e.g. downtime, high traffic, server overload..." required></textarea>
                  </div>

                  <div className="form-group">
                    <label htmlFor="ddos-evidence">Do you have logs, traffic data, or evidence? <span className="optional-tag">(optional)</span></label>
                    <textarea id="ddos-evidence" name="ddos-evidence" placeholder="Paste any relevant logs or data here..."></textarea>
                  </div>

                  <div className="form-group">
                    <label htmlFor="ddos-details">Additional details</label>
                    <textarea id="ddos-details" name="ddos-additional-details" placeholder="Any other information that may help us investigate..." required></textarea>
                  </div>
                </div>
              )}

              {/* DMCA / Copyright Fields */}
              {reportType === 'dmca' && (
                <div className="form-section">
                  <div className="form-section-title">Copyright / DMCA Details</div>

                  <div className="form-group">
                    <label htmlFor="dmca-org">Company or organization name <span className="optional-tag">(if applicable)</span></label>
                    <input type="text" id="dmca-org" name="dmca-organization" placeholder="Your company or organization" />
                  </div>

                  <div className="form-group">
                    <label htmlFor="dmca-owner">Are you the copyright owner or authorized representative?</label>
                    <select id="dmca-owner" name="dmca-is-owner" required>
                      <option value="">Select...</option>
                      <option value="yes-owner">Yes, I am the copyright owner</option>
                      <option value="yes-authorized">Yes, I am authorized to act on behalf of the owner</option>
                      <option value="no">No</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="dmca-title">Title or name of the copyrighted work</label>
                    <input type="text" id="dmca-title" name="dmca-work-title" placeholder="Name of the copyrighted content" required />
                  </div>

                  <div className="form-group">
                    <label htmlFor="dmca-type">Type of copyrighted content</label>
                    <select id="dmca-type" name="dmca-content-type" required>
                      <option value="">Select content type...</option>
                      <option value="text">Text / Article</option>
                      <option value="image">Image / Photo</option>
                      <option value="video">Video</option>
                      <option value="music">Music / Audio</option>
                      <option value="software">Software / Code</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="dmca-original-url">Where can the original work be found?</label>
                    <input type="url" id="dmca-original-url" name="dmca-original-url" placeholder="https://..." required />
                  </div>

                  <div className="form-group">
                    <label htmlFor="dmca-infringing-url">Where is the infringing content located?</label>
                    <input type="url" id="dmca-infringing-url" name="dmca-infringing-url" placeholder="https://..." required />
                  </div>
                </div>
              )}

              {reportType && (
                <button type="submit" className="submit-btn" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Report'}
                </button>
              )}

              {status === 'ERROR' && (
                <div className="status-error">
                  Something went wrong. Please try again.
                </div>
              )}
            </form>
          </div>
        )}
      </main>

      <footer className="site-footer">
        <a href="https://www.netlify.com" target="_blank" rel="noopener noreferrer">
          <img src="/logo-netlify.svg" alt="Netlify Logo" />
        </a>
      </footer>
    </div>
  )
}
