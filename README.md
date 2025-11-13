# Wake Up Claude

An automation tool to optimize Claude Code usage by strategically managing 5-hour billing windows.

## 🎯 Purpose

Claude Code uses a billing system based on **5-hour windows** that start from your first request. This project allows you to precisely control when these windows open, maximizing your credit usage during your working hours.

## 💡 Why This Project?

### The Problem

Without control, your first request of the day can trigger a 5-hour window at a non-optimal time. For example:

- If you start at 10 AM, your window ends at 3 PM
- You then need to wait for a new window to open to continue

### The Solution

By "waking up" Claude Code automatically at strategic times (e.g., 6 AM), you:

- Start your workday (9 AM-11 AM) with an already active window
- Fully utilize your credits during productive hours
- The window ends at 11 AM, a new one automatically opens for the rest of the day

## 🏗️ Project Structure

```
wake-up-claude/
├── .github/
│   └── workflows/
│       └── wake-up-claude.yml     # GitHub Actions configuration
├── index.js                       # Claude Code API ping script
├── package.json                   # Node.js dependencies
└── README.md
```

- **`index.js`**: Simple Node.js script that sends a minimal prompt to Claude Code to initialize a session
- **`package.json`**: Configuration with `@anthropic-ai/claude-code` dependency (ES modules)
- **`.github/workflows/`**: GitHub Actions workflow that automatically runs the script at fixed times

## 🔑 Claude Token Configuration

You need a Claude Code authentication token. The method depends on your subscription type:

### Option 1: API Access Users

1. Log in to your Anthropic account
2. Access the API dashboard
3. Create a new authentication token
4. Copy the generated token

### Option 2: Monthly Subscription Users

Use the Claude Code CLI to generate a long-lived token:

```bash
npx claude setup-token
```

This command requires an active Claude subscription and generates a token compatible with GitHub Actions.

## 🚀 Installation and Configuration

### 1. Fork or Clone the Repository

```bash
git clone https://github.com/your-username/wake-up-claude.git
cd wake-up-claude
```

### 2. Configure GitHub Secret

1. Go to **Settings** > **Secrets and variables** > **Actions** in your repository
2. Click **New repository secret**
3. Name: `CLAUDE_CODE_OAUTH_TOKEN`
4. Value: paste the token obtained previously
5. Click **Add secret**

### 3. Customize Schedule (Optional)

By default, the workflow runs at **6 AM, 11 AM, and 4 PM** (Paris time). To modify:

1. Open `.github/workflows/wake-up-claude.yml`
2. Modify the `cron` line and conditions in the `check-run` job
3. Example for 8 AM, 2 PM, and 8 PM:
   ```yaml
   schedule:
     - cron: "0 6,7,12,13,18,19 * * *" # UTC times
   ```
   Then adjust the conditions:
   ```bash
   if [ $PARIS_HOUR -eq '8' ] || [ $PARIS_HOUR -eq '14' ] || [ $PARIS_HOUR -eq '20' ]; then
   ```

### 4. Enable GitHub Actions

Once the repository is configured, GitHub Actions will run automatically according to the defined schedule.

## 🧪 Local Testing

To test the script before deploying to GitHub Actions:

```bash
# Install dependencies
npm install

# Set environment variable
export CLAUDE_CODE_OAUTH_TOKEN="your-token"

# Run the script
node index.js
```

You should see a message confirming that the session has started with an ID.

## ⚙️ Technical Details

### GitHub Actions Workflow

The workflow consists of two jobs:

1. **check-run**: Checks local time (Europe/Paris) to decide if the script should run

   - Only executes at configured times (6 AM, 11 AM, 4 PM by default)
   - Allows manual triggering via `workflow_dispatch`

2. **wake-up**: Executes the Node.js script
   - Installs Node.js 20
   - Caches npm dependencies to speed up executions
   - Runs `node index.js` with the token as an environment variable

### Cron Schedule

The cron is defined in UTC (UTC+0). To handle Europe/Paris timezone with daylight saving time:

- Multiple UTC times are scheduled: `0 4,5,9,10,14,15 * * *`
- The `check-run` job checks the actual Paris time and only executes at 6 AM, 11 AM, and 4 PM
- This approach automatically handles the UTC+1 (winter) and UTC+2 (summer) offset changes
- The `check-run` job filters to only execute at 6 AM, 11 AM, and 4 PM Paris time

### Manual Trigger

You can manually trigger the workflow from the GitHub interface:

1. Go to **Actions** in your repository
2. Select the **Wake up Claude** workflow
3. Click **Run workflow**

## 🎨 Customization

### Adjust Schedule to Your Work Hours

Think about your ideal work schedule. For example:

**9 AM-6 PM work with lunch break:**

- Window 1: 6 AM-11 AM (covers 9 AM-11 AM)
- Window 2: 11 AM-4 PM (covers 11 AM-4 PM)
- Window 3: 4 PM-9 PM (covers 4 PM-6 PM)

**Evening work:**

- Window 1: 2 PM-7 PM
- Window 2: 7 PM-12 AM

Adjust the cron and conditions accordingly in the workflow.

### Modify the Script

The `index.js` file is very simple. You can customize it to:

- Change the prompt sent (currently "Hi")
- Modify the model used (`claude-3-5-haiku-20241022`)
- Add additional logging
