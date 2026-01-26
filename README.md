# 🛡️ OAuth 2.0 Vulnerability Lab: Open Redirect & Broken Logic

![Security Research](https://img.shields.io/badge/Security-Research-red)
![Node.js](https://img.shields.io/badge/Node.js-v18+-green)
![GCP](https://img.shields.io/badge/Google_Cloud-OAuth_2.0-blue)

## 📌 Project Overview
This project is an educational security lab designed to demonstrate **Broken Logic** vulnerabilities within the "Login with Google" (OAuth 2.0) flow. We focus on showing how a simple programming oversight in handling redirection can lead to full account takeovers via **Open Redirect** exploits.

## ⚠️ Mandatory Security Warning
This application is **Vulnerable by Design**. It has been intentionally left open to Open Redirect attacks for research and training purposes. **Do not use this code in a production environment.**

---

## 🏗️ Team Roles & Contributions
* **The Builder (Mohammad):** Responsible for environment setup, building the Express.js backend, and configuring the Google Cloud Platform (GCP) integration.
* **The Hacker:** Responsible for intercepting requests using Burp Suite and exploiting the Open Redirect to capture session data.
* **The Architect:** Responsible for the theoretical analysis, documenting the vulnerability, and providing secure coding solutions.

---

## 🛠️ Technical Stack
* **Backend:** Node.js & Express.js.
* **Authentication:** Passport.js with `passport-google-oauth20` strategy.
* **Infrastructure:** Google Cloud Console for OAuth Client ID/Secret management.
* **IDE:** Antigravity (AI-Powered Code Editor).

---

## 🔍 The Vulnerability: Open Redirect
The core flaw is located in the `server.js` callback logic. The server accepts a `returnTo` query parameter and performs a redirect immediately after a successful Google login without validating the destination against a whitelist.



### Attack Scenario:
1. An attacker crafts a malicious link: 
   `http://localhost:3000/auth/google?returnTo=https://attacker-site.com`
2. The victim clicks the link and logs in through the official Google prompt.
3. Upon success, our server blindly redirects the victim to `attacker-site.com` along with sensitive session fragments.

---

## 🚀 Installation & Setup
1. **Clone the repo:** `git clone https://github.com/MohammadTbakhy/OAuth-Vulnerability-Lab.git`
2. **Install dependencies:** `npm install`.
3. **Configure Environment:** Create a `.env` file and add your `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` obtained from GCP.
4. **Run the Server:** `node server.js`.
5. **Access the Lab:** Open `http://localhost:3000`.

---

## 🛡️ Mitigation Strategies
To secure this implementation, we recommend:
1. **Static Whitelisting:** Only allow redirects to pre-defined, trusted URLs.
2. **State Parameter:** Always implement and validate the `state` parameter to prevent CSRF and redirect manipulation.
3. **Secret Protection:** Utilizing GitHub's **Push Protection** (which successfully flagged our initial attempts to upload secrets!) to prevent credential leaks.