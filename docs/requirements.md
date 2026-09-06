# PhishGuard — AI Phishing Detection Platform

## 1. Project Overview

PhishGuard is a web-based cybersecurity platform that helps users identify potentially malicious URLs and phishing emails.

The platform analyzes submitted URLs and email content using security APIs and rule-based detection techniques. It generates a risk score, risk level, detection reasons, and recommendation.

The project is built using Java Spring Boot, Next.js, PostgreSQL, Spring Security, and external cybersecurity APIs.

---

## 2. Objectives

The main objectives are:

- Detect potentially malicious URLs
- Analyze suspicious email content
- Generate phishing risk scores
- Identify common phishing indicators
- Integrate external security APIs
- Store scan history
- Provide security reports
- Provide user and admin dashboards
- Implement secure authentication and authorization

---

## 3. User Roles

### User

A registered user can:

- Register an account
- Login securely
- Scan URLs
- Analyze email content
- View scan results
- View personal scan history
- View security reports
- View dashboard statistics

### Admin

An administrator can:

- Login securely
- View registered users
- View all scans
- Monitor phishing detection statistics
- View system analytics
- Monitor suspicious activity

---

## 4. URL Scanner

The user submits a URL.

The backend performs:

1. URL validation
2. HTTPS analysis
3. Suspicious keyword analysis
4. External security API checks
5. Risk score calculation
6. Risk classification
7. Database storage

Example:

URL:
`https://example.com/login`

Result:
- **Risk Score**: 82/100
- **Risk Level**: HIGH
- **Recommendation**: Avoid visiting this website.

---

## 5. Email Analyzer

The user submits email content.

The system analyzes:

- Urgent language
- Credential requests
- Suspicious links
- Scam keywords
- Account/payment requests
- Common phishing phrases

Example:

- **Risk Score**: 91/100
- **Risk Level**: CRITICAL
- **Detection Reasons**:
  - Urgent language detected
  - Password request detected
  - Suspicious URL detected

---

## 6. Risk Levels

The system uses the following levels:

| Score | Risk Level |
|------:|------------|
| 0–20 | SAFE |
| 21–40 | LOW |
| 41–60 | MEDIUM |
| 61–80 | HIGH |
| 81–100 | CRITICAL |

---

## 7. Dashboard

The user dashboard displays:

- Total scans
- Safe scans
- Suspicious scans
- High-risk scans
- Recent scans
- Risk statistics
- Scan history

---

## 8. Admin Dashboard

The admin dashboard displays:

- Total users
- Total scans
- URL scans
- Email scans
- High-risk detections
- Recent suspicious activity
- User management

---

## 9. Authentication

Authentication will use:

- Spring Security
- JWT
- BCrypt password hashing
- Role-based authorization

Authentication flow:

Register → Password hashing → Database
Login → Credential validation → JWT generation → Authenticated requests

---

## 10. Technology Stack

### Frontend
- Next.js
- React
- Tailwind CSS
- Axios

### Backend
- Java 17+ / 21
- Spring Boot 3
- Spring Web
- Spring Security
- Spring Data JPA
- Hibernate
- Maven

### Database
- PostgreSQL

### External APIs
- VirusTotal API
- Google Safe Browsing API

### Development Tools
- Git / GitHub
- Postman
- Docker

---

## 11. Core Modules

### Authentication Module
Handles:
- Registration
- Login
- JWT authentication
- Authorization
- User roles (USER, ADMIN)

### URL Analysis Module
Handles:
- URL validation
- Security API integration (VirusTotal, Google Safe Browsing)
- URL feature analysis
- Risk calculation
- Scan storage

### Email Analysis Module
Handles:
- Email content analysis
- Keyword & heuristics detection
- Suspicious link extraction & analysis
- Risk calculation
- Scan storage

### Report Module
Handles:
- Detection reasons
- Risk score & level classification
- Recommendations
- Report generation

### Dashboard Module
Handles:
- User statistics
- Scan statistics
- Recent scans
- Risk analytics

### Admin Module
Handles:
- User management
- Scan monitoring
- System analytics

---

## 12. Non-Functional Requirements

### Security
- Passwords must never be stored as plain text (BCrypt)
- JWT authentication must be used for protected APIs
- User access must be role-based
- Input validation must be implemented
- Sensitive API keys must not be committed to GitHub

### Performance
- API requests should return within a reasonable time
- External API failures should be handled gracefully
- Database queries should be optimized where necessary

### Usability
- Responsive UI
- Clear risk indicators
- Simple scanning workflow
- Meaningful error messages

### Maintainability
- Layered Spring Boot architecture
- DTO-based API communication
- Centralized exception handling
- Clean Git workflow
