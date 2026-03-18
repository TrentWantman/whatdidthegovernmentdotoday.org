# What Did The Government Do Today

Browse and search congressional bills using the [Congress.gov API](https://api.congress.gov/). View bill details, legislative actions, sponsors, and committee information.

[screenshot]

## Stack

- React 18, React Router
- Express, node-cache, Swagger
- Docker

## Setup

```bash
git clone https://github.com/TrentWantman/whatdidthegovernmentdotoday.org
cd whatdidthegovernmentdotoday.org
cp backend/.env.example backend/.env
# Add your Congress.gov API key to backend/.env
```

### npm

```bash
npm run install:all
npm run dev
```

Frontend: http://localhost:3000
Backend API: http://localhost:5000

### Docker

```bash
docker-compose up
```

## API

```
GET /api/congress                     recent bills
GET /api/congress/actions             congressional actions
GET /api/congress/search              search bills
GET /api/congress/members             congress members
GET /api/congress/bill/:slug          bill details
GET /api/congress/bill/:slug/summary  bill summary
GET /health
GET /api-docs
```

Bill slug format: `congress-type-number` - example: `118-hr-146`
