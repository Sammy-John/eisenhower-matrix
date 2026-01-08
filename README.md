# Eisenhower Matrix

**A simple, focused tool for prioritising what actually matters.**

🔗 **Landing page:**  
https://<your-username>.github.io/eisenhower-matrix/

🔗 **Launch the tool:**  
https://<your-username>.github.io/eisenhower-matrix/app/

---

## What is this?

This project is a lightweight **Eisenhower Matrix** tool — designed to help separate:

- What’s **urgent**
- What’s **important**
- What’s noise

It’s built as two parts in a single repository:

1. A **marketing / explanation landing page**
2. The **actual interactive tool**

Both are hosted on **GitHub Pages**, no backend required.

---

## Why this exists

Most productivity tools try to do everything:  
tasks, projects, goals, calendars, collaboration, automation.

This does one thing well.

The Eisenhower Matrix is most useful when it’s:
- fast
- frictionless
- not buried inside a larger system

This tool is designed to be:
- **local-first**
- **simple**
- **clear**
- **distraction-free**

---

## Structure

```
eisenhower-matrix/
├─ docs/        # landing page (GitHub Pages root)
└─ app/         # The Eisenhower Matrix tool
```

### `/docs`
- Public-facing landing page
- Explains the concept
- Links directly to the tool

### `/app`
- The actual matrix UI
- Runs entirely in the browser
- Uses localStorage for persistence

---

## Features (current)

- Four-quadrant Eisenhower Matrix
- Add / edit / remove tasks
- Local storage (no account required)
- Fast load, no dependencies

---

## Planned iterations

This repo is intentionally simple, but future iterations may explore:

- Keyboard-first interaction
- Drag & drop between quadrants
- Export / import (JSON)
- Optional sync or auth
- UI/UX refinements

The goal is **evolution, not bloat**.

---

## Tech stack

- HTML
- CSS
- Vanilla JavaScript
- GitHub Pages

No frameworks. No build step. No backend.

---

## Development

Open the files directly in the browser.

---

## Philosophy

> Not every idea needs to become a task.  
> Not every task needs to be urgent.  
> Not everything deserves your attention.

This tool exists to protect focus — not manage everything.

---

## License

MIT

---

Built as part of ongoing experiments in **small, focused tools** under [studioTeknabu](https://teknabu.com/)
