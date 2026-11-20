# Shirley Dhlamini & Mdumo Gama — Digital Wedding Invitation

## Quick Start

Open `index.html` in any modern web browser. No build tools or server required.

---

## Customising the Website

### 1. Couple's Names & Date
Already set throughout the website:
- **Bride:** Shirley Dhlamini
- **Groom:** Mdumo Gama
- **Date:** Saturday, 20 February 2027

---

### 2. Venue Details (`index.html`)

Search for `[Venue Name]` and `[Venue Address, City, Province]` and replace with the real venue.

Also update the Google Maps address in `script.js`:
```js
venueAddress: 'The Grand Venue, 123 Main Street, Johannesburg',
```

---

### 3. Event Times (`index.html`)

Search for `[Add time]` — there are five in the Details section:
- Welcome
- Ceremony
- Cocktail Hour
- Photos
- Dinner & Party

---

### 4. RSVP Deadline (`index.html`)

Search for `[RSVP Deadline Date]` and replace with the actual deadline.

---

### 5. Couple's Photograph

Place your photo at `assets/images/couple.jpg`, then in `index.html` replace the
`.story-photo-placeholder` div inside `.story-photo-frame__inner` with:

```html
<img src="assets/images/couple.jpg" alt="Shirley and Mdumo" loading="lazy" />
```

---

### 6. Venue Photograph

Place your venue photo at `assets/images/venue.jpg`, then replace the
`.venue-photo-placeholder` div inside `.venue-photo-wrapper` with:

```html
<img src="assets/images/venue.jpg" alt="[Venue Name]" loading="lazy" />
```

---

### 7. Gift Registry (`script.js` and `index.html`)

In `script.js`:
```js
registryUrl: 'https://your-registry-link.com',
```

Or fill in the banking details section in `index.html` by searching for `[Bank Name]`, `[Account Name]`, etc.

---

### 8. Wedding Hashtag (`index.html`)

Search for `#ShirleyAndMdumo2027` and update if desired.

---

### 9. RSVP Form Backend

The RSVP form collects data and logs it via `console.log`. To connect a backend:

In `script.js`, find the comment `// TODO: Connect to backend/database here` and add:

```js
fetch('/api/rsvp', {
  method: 'POST',
  body: JSON.stringify(formData),
  headers: { 'Content-Type': 'application/json' }
});
```

Alternatively, services like **Formspree**, **EmailJS**, or **Firebase** can receive the form data without a custom backend.

---

## File Structure

```
ShirleyMdumoWedding/
├── index.html          — All HTML markup
├── style.css           — All styles (mobile-first, responsive)
├── script.js           — Envelope animation, countdown, RSVP form
├── README.md           — This file
└── assets/
    └── images/         — Place couple.jpg and venue.jpg here
```

---

## Browser Support

Works on all modern browsers (Chrome, Safari, Firefox, Edge).
Optimised for mobile — perfect for sharing via WhatsApp.
