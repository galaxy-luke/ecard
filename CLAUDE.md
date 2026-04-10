# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Digital business card (數位名片) web application for 彥星喬商 (Geosun/JSB). A static frontend site served by Laragon — no build tools, no bundler, no framework. All pages are plain HTML with jQuery, loaded directly by the browser.

## Architecture

**Two card page variants coexist:**

- `index.html` — Static card for a single employee (hardcoded layout for 楊羽瑄). Uses `css/style.css` and `js/main.js`. This is the "new design" with a green header wave, profile photo, and contact list.
- `without_slash_index.html` — Dynamic card that resolves an employee code from the URL path (e.g. `/G001`) or query param, loads data from `employees.json` or a backend API. Uses `js/script.js` (self-contained, all logic inline). This is the "legacy design" with sidebar buttons.

**Employee list pages:**

- `EmployeeList.html` — Tries `employees.json` first, then falls back to `http://192.168.100.150:3000/api/employees`. Links to `index.html?code=...`.
- `list.html` — Simpler version that calls `http://localhost:3000/api/employees` directly. Links to `Index.html?code=...`.

**Data loading pattern (dual-source):**

Both dynamic pages attempt to load `./employees.json` via AJAX first. If that fails (404), they fall back to a backend API at `http://192.168.100.150:3000/api/employee/{code}` or `/api/employees`. The `employees.json` file contains sample/test data with fields: `Code`, `CnName`, `EnName`, `JobTitle`, `ServiceYears`, `DeptName`, `Email`, `MobilePhone`, `Address`, `Photo`.

## Key Features (implemented in JS)

- **QR Code** — Generated via `api.qrserver.com` (new design) or `qrcodejs` library (legacy). The new design renders it in a modal overlay.
- **Share** — Uses `navigator.share` (Web Share API) with clipboard fallback.
- **Download as image** — Uses `html2canvas` to snapshot `.card-container`, temporarily hiding sidebar buttons.
- **Add to contacts** — Generates a vCard 3.0 `.vcf` file and triggers download.
- **Copy Line ID** — Selection-based copy via `document.execCommand('copy')`.

## Development

No build step required. Serve the directory with any static web server (Laragon, `npx serve`, etc.). Changes to HTML/CSS/JS are reflected immediately on refresh.

## File Reference

| Path | Role |
|---|---|
| `css/style.css` | Main card styles (new design), CSS variables in `:root` |
| `js/main.js` | New card logic (QR modal, share, copy) |
| `js/script.js` | Legacy card logic (all self-contained: download, QR, vCard, share, toast) |
| `employees.json` | Sample employee data used as offline/fallback data source |
| `assets/` | Static design assets (icons, header/bg PNGs, logo) |
| `images/` | Employee photos and logos |
