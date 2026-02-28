[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/Nt4zUlkt)

# 🛡️ OAuth 2.0 Vulnerability Lab: Open Redirect & CSRF

![Security Research](https://img.shields.io/badge/Security-Research-red)
![Node.js](https://img.shields.io/badge/Node.js-v18+-green)
![GCP](https://img.shields.io/badge/Google_Cloud-OAuth_2.0-blue)
![Mitigation Applied](https://img.shields.io/badge/Status-Patched-success)

## 📌 Project Overview
This project is an educational security lab designed to demonstrate **Broken Logic** vulnerabilities within the "Login with Google" (OAuth 2.0) flow. We focus on showing how a simple programming oversight in handling redirection and the `state` parameter can lead to **Open Redirect** exploits and **OAuth CSRF** attacks, followed by implementing a robust, cryptographically secure mitigation.

## ⚠️ Security Warning
This repository contains two versions of the server:
1. `server.js`: **Vulnerable by Design**. Left open to attacks for research and PoC purposes.
2. `server-secure.js`: **Fully Patched**. Implements strict validation and in-memory state management.

---

## 🏗️ Team Roles & Contributions
* **The Builder:** Responsible for environment setup, building the initial Express.js backend, designing the UI, and configuring the Google Cloud Platform (GCP) integration.
* **The Hacker:** Responsible for intercepting requests using Burp Suite, identifying the logical flaws, and exploiting the Open Redirect/CSRF to hijack the authentication flow.
* **The Architect:** Responsible for the theoretical analysis, auditing the vulnerable code, and engineering the final secure patch using cryptographic nonces and server-side memory (`Map`).

---

## 🛠️ Technical Stack
* **Backend:** Node.js & Express.js.
* **Authentication:** Passport.js with `passport-google-oauth20` strategy.
* **Security Modules:** Node.js native `crypto` module.
* **Infrastructure:** Google Cloud Console.

---

## 🔍 The Vulnerabilities

### 1. Open Redirect
The server initially accepts a `returnTo` query parameter and performs a redirect immediately after a successful Google login without validating the destination against a whitelist.
* **Attack Scenario:** An attacker crafts a link `http://localhost:3000/auth/google?returnTo=https://attacker-site.com`. The victim logs in, and the server blindly redirects them to the attacker's domain, leaking session data.

### 2. OAuth CSRF (State Manipulation)
The initial code misused the OAuth `state` parameter by passing plaintext routing data inside it, rather than using a randomized, unguessable token, making the flow susceptible to Cross-Site Request Forgery.

---

## 🛡️ The Architect's Mitigation (The Patch)
To secure this implementation in `server-secure.js`, we implemented the following enterprise-grade defenses:
1. **Strict Path Validation:** Enforced relative path checking (`!returnTo.startsWith('/')`) to instantly block external Open Redirects.
2. **Cryptographic Nonce Generation:** Utilized `crypto.randomBytes(20)` to generate a secure, unguessable `state` token for every login attempt.
3. **In-Memory State Management:** Replaced unreliable cookies with a server-side `Map()` to bind the secure token to the intended route.
4. **Replay Attack Prevention:** The token is strictly single-use and is immediately deleted (`validStates.delete`) upon successful validation.

---

## 🚀 Installation & Setup

1. **Clone the repo:** bash
   git clone [https://github.com/MohammadTbakhy/OAuth-Vulnerability-Lab.git](https://github.com/MohammadTbakhy/OAuth-Vulnerability-Lab.git)



2. **Install dependencies:** 
```
bash npm install
```


3. **Configure Environment:** Create a `.env` file based on `.env.example` and add your `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.

---

## 🎮 Running the Lab

**To test the Exploit (Vulnerable Version):**

```bash
node server.js 

```

*Access `http://localhost:3000` and try manipulating the `returnTo` parameter.*

**To test the Defense (Secure Version):**

```bash
node server-secure.js

```

*Access `http://localhost:3000`. The server will now block malicious redirects with a `403 Forbidden` Security Alert.*
