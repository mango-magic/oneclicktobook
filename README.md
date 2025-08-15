# OneClickToBook.Me

OneClickToBook.Me is a privacy-first, one-click scheduling system.  
Send a single link → invitee grants calendar access once → we find the overlap → instant booking.

---

## 🚀 Features
- **Google Calendar & Microsoft 365 OAuth** — free/busy only, no event details  
- **Privacy-first availability matching** between organizer & invitee  
- **Instant booking** with organizer + invitee events created automatically  
- **Auto-reschedule support** with calendar webhooks  
- **Apple/iCloud fallback** via private iCal URL

---

## 🛠 Stack
- **Backend:** Node 20+, Express, TypeScript
- **Database:** PostgreSQL (Prisma ORM)
- **Cache:** Redis (optional, for fast free/busy lookups)
- **Auth:** OAuth 2.0 (Google, Microsoft), JWT link tokens
- **Frontend:** Minimal static HTML/JS landing for the booking link

---

## 📂 Monorepo Layout
