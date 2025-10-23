UConn Email Safety - Outlook Add-in (Frontend)

Local development:

1. Install dependencies
   - npm install
2. Start dev server (HTTPS on 3000)
   - npm run dev
3. Sideload in Outlook (Windows desktop or Web)
   - Use manifest.xml from this folder
   - Outlook on the web: Settings > Integrations > Upload custom add-in

Configuration:
- In the task pane, set the Backend API URL (persisted locally)
- Backend must expose POST /api/verdict that accepts message metadata

Notes:
- Uses Office.js Mailbox 1.8 APIs
- Vite builds two HTML entries: taskpane and commands

