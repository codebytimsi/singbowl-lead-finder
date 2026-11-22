# SingBowl Lead Finder

A real-time buyer lead finder built for the SingBowl internship assignment.

The application searches the US market for potential singing bowl buyers using Google Search through SerpAPI, filters irrelevant results, validates business websites, and detects publicly available business emails for outreach preparation.

## Features

- Real-time buyer search
- US-focused Google search
- Buyer-focused search queries
- Filters irrelevant marketplaces and invalid results
- Validates business website URLs
- Displays clean business domains
- Detects publicly available business emails
- Lead selection workflow
- Email preparation interface
- `mailto` email workflow
- Dashboard with buyer, website, and email statistics
- Responsive dashboard UI

## Tech Stack

### Frontend
- HTML
- CSS
- JavaScript

### Backend
- Node.js
- Express.js
- CORS
- dotenv

### API
- SerpAPI

## How It Works

1. User enters a buyer-related keyword.
2. The frontend sends the search request to the Node.js backend.
3. The backend queries Google through SerpAPI with US targeting.
4. Irrelevant and marketplace results are filtered.
5. Valid business websites are retained.
6. Public business emails are detected from available website pages.
7. Results are displayed as buyer lead cards.
8. A lead can be selected and prepared for email outreach.

## Project Structure

singing-bowl-lead-finder/
│
├── index.html
├── style.css
├── script.js
├── server.js
├── package.json
├── package-lock.json
├── .gitignore
└── README.md