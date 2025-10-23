# UConn Email Safety - Outlook Add-in

This is an Outlook extension that checks if emails are **safe** or **suspicious**. It shows a green checkmark for safe emails and a red warning for phishing attempts!

---

## What You Need Before Starting

1. **Node.js** installed on your computer (download from https://nodejs.org)
2. **A web browser** (Microsoft Edge works best)
3. **Outlook** - either:
   - Outlook on the web (outlook.office.com) OR
   - Outlook desktop app (Windows or Mac)

---

## Step 1: Get the Code Ready

### 1a. Open PowerShell (Windows) or Terminal (Mac)
- **Windows**: Press `Windows Key`, type "PowerShell", and press Enter
- **Mac**: Press `Cmd + Space`, type "Terminal", and press Enter

### 1b. Navigate to the project folder
Type this command and press Enter:
```powershell
cd C:\projectp2\pranavproject\outlook-addin-frontend
```
(On Mac, the path might be different - use wherever you saved the project)

### 1c. Install the packages
Type this command and press Enter (this downloads all the tools the add-in needs):
```powershell
npm install
```
Wait for it to finish (you'll see a lot of text scrolling by - that's normal!)

---

## Step 2: Start the Development Server

This makes your add-in available so Outlook can load it.

### 2a. Start the server
In PowerShell/Terminal, type:
```powershell
npm run dev
```

You should see something like:
```
VITE v5.4.21  ready in 245 ms
➜  Local:   https://localhost:3000/
```

**Leave this window open!** The server needs to keep running.

### 2b. Trust the security certificate (IMPORTANT - do this once)
1. Open **Microsoft Edge** browser
2. Go to: `https://localhost:3000/taskpane.html`
3. You'll see a scary warning that says "Your connection isn't private" - **this is normal!**
4. Click **"Advanced"**
5. Click **"Continue to localhost (unsafe)"**
6. You should now see the UConn Email Safety interface with a blue "Run Check" button

**Why do this?** Outlook needs a secure (HTTPS) connection. By visiting once in Edge, you're telling your computer to trust the development server.

---

## Step 3: Install the Add-in into Outlook

Now we'll add the extension to Outlook so it shows up when you read emails.

### Option A: Outlook on the Web (easiest)

1. Open your browser and go to: https://outlook.office.com
2. Log in with your UConn email
3. Click the **Settings gear icon** (⚙️) in the top right
4. At the bottom of the settings panel, click **"View all Outlook settings"**
5. In the left sidebar, click **"Mail"** → **"Customize actions"**
6. Look for **"Get Add-ins"** or go directly to: https://outlook.office.com/owa/?path=/options/manageapps
7. Click **"My add-ins"** in the left sidebar
8. Click **"+ Add a custom add-in"**
9. Choose **"Add from file..."**
10. Click **"Browse"** and select this file:
    ```
    C:\projectp2\pranavproject\outlook-addin-frontend\manifest.xml
    ```
11. Click **"Install"** (ignore any localhost warnings)
12. You should see: **"UConn Email Safety"** in your add-ins list

### Option B: Outlook Desktop App

1. Open **Outlook** desktop app
2. Click the **"Home"** tab at the top
3. Click **"Get Add-ins"** (might say "Store" on older versions)
4. Click **"My add-ins"** in the left sidebar
5. Click the **three dots (⋯)** in the top right
6. Choose **"Add a custom add-in"** → **"Add from file..."**
7. Browse and select:
    ```
    C:\projectp2\pranavproject\outlook-addin-frontend\manifest.xml
    ```
8. Click **"Install"**

### Option C: PowerShell Command (for advanced users)

If Outlook blocks custom add-ins, use this developer method:
```powershell
npm install -g office-addin-dev-settings
npx office-addin-dev-settings add C:\projectp2\pranavproject\outlook-addin-frontend\manifest.xml
```
Then restart Outlook.

---

## Step 4: Use the Add-in

### 4a. Open any email
Click on any email in your inbox (it will open in the reading pane)

### 4b. Find the "Check Email" button
Look at the **top ribbon** (where all the buttons are). You should see a new section called **"UConn Safety"** with a button that says **"Check Email"**.

### 4c. Click "Check Email"
A panel will slide out from the right side of the screen. This is your **task pane**!

### 4d. What you'll see:
- **UConn logo** at the top
- **Backend API URL** field (leave this empty for demo mode)
- **Run Check** button (blue)
- **Verdict indicator** (green/red/gray circle with text)
- **Details section** showing why the email is safe or suspicious

---

## How the Add-in Works

### Demo Mode (no backend needed)
The add-in checks emails using smart rules:

**🟢 GREEN = SAFE** if:
- Email is from `@uconn.edu`
- No phishing indicators found

**🔴 RED = SUSPICIOUS** if the email has:
- Urgent words: "urgent", "immediate", "action required", "suspended"
- Sensitive topics: "password", "bank account", "credit card", "SSN"
- Phishing phrases: "verify your account", "click here", "unusual activity"
- Requests for personal info: bank details, SSN, credit card numbers
- Fake sender: Gmail/Yahoo pretending to be UConn or a bank
- Threatening language: "legal action", "penalty", "account will be closed"
- Generic greetings: "Dear Customer" instead of your real name

**⚪ GRAY = UNKNOWN** if:
- Not enough information to decide

### Example Test Emails

**Test 1: Safe Email**
- Send yourself an email from `@uconn.edu` 
- Result: 🟢 GREEN

**Test 2: Phishing Email**
- Send yourself an email with subject: "URGENT: Verify your password"
- Body: "Click here to confirm your bank account or we will suspend it"
- Result: 🔴 RED (catches urgent words + phishing phrases)

**Test 3: Your Current Test**
- Subject: "(No subject)" or "VPN"
- Body: "Give me your bank account and credit card..."
- Result: 🔴 RED (catches requests for financial info)

---

## Connecting to Your Backend (Optional)

If Team Identification has a Python backend ready:

1. Get the backend URL (example: `http://localhost:5000` or `https://backend.uconn.edu`)
2. Open the task pane in Outlook
3. Type the URL in the **"Backend API URL"** field
4. Click **"Run Check"**

The add-in will send the email details to your backend and show the result!

**Backend Requirements:**
- Must have an endpoint: `POST /api/verdict`
- Accepts JSON: `{ subject, from, to, cc, body }`
- Returns JSON: `{ status: 'safe' | 'suspicious', explanation: 'why...' }`

---

## Troubleshooting

### "Check Email" button doesn't appear
1. Remove the add-in and re-install using Step 3
2. Refresh Outlook (F5 on web, restart desktop app)
3. Make sure `npm run dev` is still running in PowerShell

### Task pane is blank or shows error
1. Check that the dev server is running (`npm run dev`)
2. Visit `https://localhost:3000/taskpane.html` in Edge again and accept the certificate
3. Look at the browser console (press F12 in the task pane) for error messages

### "ENOENT" or "cannot find package.json"
You're in the wrong folder! Use:
```powershell
cd C:\projectp2\pranavproject\outlook-addin-frontend
```
Then try `npm install` again.

### Port 3000 is already in use
Another program is using port 3000. Either:
- Close other development servers, OR
- Edit `vite.config.ts` and change `port: 3000` to `port: 3001`
- Then update `manifest.xml` URLs to use `:3001` instead of `:3000`

---

## Project Structure

```
outlook-addin-frontend/
├── manifest.xml          # Outlook add-in definition (install this)
├── package.json          # Project dependencies
├── vite.config.ts        # Development server settings
├── taskpane.html         # Entry point for task pane
├── commands.html         # Entry point for ribbon commands
├── src/
│   ├── taskpane.tsx      # Loads React app
│   ├── commands.ts       # Ribbon button logic
│   ├── ui/
│   │   ├── App.tsx       # Main UI component
│   │   └── styles.css    # Styling
│   └── utils/
│       ├── outlook.ts    # Reads email metadata from Office.js
│       ├── api.ts        # Calls backend API
│       └── demo.ts       # Demo phishing detection logic
└── public/icons/         # UConn logo images
```

---

## For Teachers/Graders

This add-in demonstrates:
- **Office.js API integration** - reading email metadata (sender, subject, body)
- **React frontend** - modern UI framework
- **TypeScript** - type-safe code
- **Vite dev server** - fast development with HTTPS
- **Manifest-based deployment** - official Microsoft add-in format
- **Phishing detection logic** - 10+ checks for suspicious indicators
- **API-ready architecture** - can connect to machine learning backend

**Team #18 • UConn • Anti-Phishing Project**
