# Software Requirements Specification (SRS)
## PhishGuard: AI-Powered Phishing Detection Platform

### 1. Executive Summary & Vision
**PhishGuard** is an enterprise-grade AI phishing detection and threat intelligence platform. It analyzes emails, URLs, domain metadata, and web content using multi-modal AI (NLP, vision models, heuristic analysis) to detect sophisticated phishing attempts, spear-phishing, credential harvesting, and brand impersonation in real-time.

---

### 2. Core Capabilities & Functional Requirements

#### 2.1 Email Analysis Engine
- **Header & Authentication Verification**: Parse and validate SPF, DKIM, DMARC alignment, inspect `Received` hop path, and flag spoofed sender domains.
- **Content & Sentiment Analysis**: NLP model (Transformer-based) to detect urgency, financial request patterns, credential lures, and spear-phishing tone.
- **Embedded URL Extraction**: Extract all inline links, redirects, shorteners, and obfuscated URLs (e.g. Punycode/IDN, IP addresses).
- **Attachment Sandbox Triggering**: Compute hashes (SHA256) of email attachments and flag suspicious file extensions or macro-enabled documents.

#### 2.2 URL & Visual Webpage Inspector
- **Headless Browser Rendering**: Render target URLs in isolated Chromium instances.
- **Visual Impersonation Detection**: Vision AI comparison against known target brand logotypes (e.g. Microsoft, Google, PayPal, Banks).
- **DOM & SSL Inspection**: Inspect SSL certificate issuer, domain registration age (WHOIS lookups), form input fields (password/credit card fields on newly registered domains), and zero-day login form clones.

#### 2.3 Risk Scoring Engine
- **Composite Risk Score (0 - 100)**:
  - `0 - 29`: Safe / Low Risk
  - `30 - 69`: Suspicious / Caution
  - `70 - 100`: High Risk / Malicious (Phishing confirmed)
- **Explainable AI (XAI)**: Provide granular breakdown of risk score drivers (e.g., "Mismatched DMARC (+30)", "Brand Logo Similarity on Unregistered Domain (+40)", "Urgent Action Language (+15)").

#### 2.4 Analyst Dashboard & Threat Center
- **Incident Queue**: Real-time stream of flagged emails and suspicious URLs submitted by users or automated monitors.
- **Detailed Threat Breakdown**: Visual snapshot of webpage, header tree, extracted links, risk breakdown, and recommended action.
- **Mitigation Controls**: One-click URL blocklisting, domain sinkholing, and automated email quarantine webhooks.

#### 2.5 Integrations & APIs
- **RESTful API**: `/api/v1/scan/email`, `/api/v1/scan/url`, `/api/v1/threats/score`.
- **Browser Extension**: Real-time link hover & webpage warning overlay.
- **Email Add-in**: Outlook / Gmail add-in for 1-click user reporting and inline scanning.

---

### 3. Architecture & Tech Stack

- **Frontend**: Next.js / React, Modern CSS styling, Lucide Icons, Analytics charts.
- **Backend Service**: Python (FastAPI / PyTorch / HuggingFace transformers) or Node.js backend API.
- **Scanning Services**: Playwright / Puppeteer for headless site rendering & screenshotting.
- **Database**: PostgreSQL / SQLite (metadata & threat logs), Redis (queues & cached domain lookups).

---

### 4. Non-Functional Requirements

- **Performance & Latency**: API response time < 1.5s for URL analysis; email scanning within 2s.
- **Security & Privacy**: Zero storage of raw PII/email body content unless explicitly enabled for retraining (privacy-first data handling).
- **Scalability**: Asynchronous task processing using Celery/Redis for concurrent web rendering tasks.
- **Reliability**: 99.9% API uptime with graceful fallback for external WHOIS / DNS lookup failures.
