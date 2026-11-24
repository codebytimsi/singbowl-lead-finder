# OM Enterprise Buyer Lead Finder

A real-time buyer lead finder built for OM Enterprise's wholesale outreach workflow.

The application searches the US market for potential buyers of handcrafted home décor and gifting products using Google Search through SerpAPI. It filters irrelevant results, validates business websites, detects publicly available business emails, and helps prepare wholesale outreach emails.

## Features

- Real-time buyer search
- US-focused Google search
- Buyer-focused search queries
- Filters irrelevant marketplaces and invalid results
- Validates business website URLs
- Displays clean business domains
- Detects publicly available business emails
- Lead selection workflow
- Buyer details view
- Wholesale email preparation interface
- `mailto` email workflow
- Dashboard with buyer, website, and email statistics
- Responsive dashboard UI

## Product Categories

The lead finder can be used to search for potential buyers related to:

- Home décor
- Handcrafted décor
- Giftware
- Decorative lanterns
- Candle holders
- Decorative jars
- Votive holders
- Gifting products
- Handcrafted lifestyle products

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
4. Irrelevant marketplace and invalid results are filtered.
5. Valid business websites are retained.
6. Public business emails are detected from available website pages.
7. Results are displayed as buyer lead cards.
8. A lead can be selected for outreach.
9. The buyer's public email is added to the email composer when available.
10. The OM Enterprise wholesale outreach template is prepared.
11. The prepared email can be opened in the user's default email application.

## Email Outreach

The application prepares the following wholesale outreach format:

**Subject:**

Wholesale Inquiry – Handcrafted Home Décor & Giftware

The email introduces OM Enterprise and its handcrafted home décor and gifting products, including decorative lanterns, candle holders, and decorative jars.

## Project Structure

om-enterprise-buyer-lead-finder/
│
├── index.html
├── style.css
├── script.js
├── server.js
├── package.json
├── package-lock.json
├── .gitignore
└── README.md

## Setup

### 1. Install dependencies

```bash
npm install
