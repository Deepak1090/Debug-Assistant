# Debug Assistant — Deploy Guide (no coding needed)

You already have: a GitHub account, a Vercel account, and an Anthropic API key.

## Step 1: Get these files onto GitHub

1. Go to https://github.com and click the **+** icon (top right) → **New repository**
2. Name it `debug-assistant`, keep it **Public** or **Private** (either is fine), click **Create repository**
3. On the next page, click **uploading an existing file**
4. Drag in ALL the files from this folder (keep the `pages` folder structure intact — GitHub will preserve it if you drag the whole folder)
5. Scroll down, click **Commit changes**

## Step 2: Deploy on Vercel

1. Go to https://vercel.com/new
2. Find `debug-assistant` in your repo list → click **Import**
3. Before clicking Deploy, open **Environment Variables**
4. Add one:
   - Name: `ANTHROPIC_API_KEY`
   - Value: (paste the key you copied earlier, starts with `sk-ant-`)
5. Click **Deploy**
6. Wait ~1 minute. Vercel gives you a live URL like `debug-assistant-yourname.vercel.app`

That's it — your app is live and working for anyone with that link.

## Step 3: Test it

Open your live URL, hit "Analyze error" on the pre-filled example, confirm you get a real response back. Then try pasting your own error/code.

## What each file does

- `pages/index.js` — the page people see (the form, the results)
- `pages/api/analyze.js` — the hidden backend that safely calls Claude using your API key (this never runs in the browser, so your key stays private)
- `package.json` — tells Vercel what dependencies to install 

## Next steps once this works

- Add a Stripe paywall (limit free uses, charge for more)
- Get a custom domain (buy one, e.g. from Namecheap, connect it in Vercel settings)
- Share it — Reddit r/reactjs, X/Twitter, Product Hunt
