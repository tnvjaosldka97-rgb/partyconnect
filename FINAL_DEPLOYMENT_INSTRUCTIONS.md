# PartyConnect - Final Deployment Instructions

## Current Status

**Date**: October 20, 2025
**Issue**: Vercel deployment failing with `cd: client: No such file or directory`

## Root Cause

The Vercel project has conflicting settings:
- **Root Directory**: Set to `client` ✅
- **Build Command**: Contains `cd client && pnpm install && pnpm build` ❌

When Root Directory is `client`, Vercel already starts in that directory, so `cd client` fails.

## Solution - Manual Fix Required

### Step 1: Login to Vercel
Go to: https://vercel.com/onlyup/partyconnect/settings/build-and-deployment

### Step 2: Update Build Command
1. Find "Build Command" section
2. Click "Override" toggle (blue button on the right)
3. Change from: `cd client && pnpm install && pnpm build`
4. Change to: `pnpm install && pnpm build`
5. Click "Save"

### Step 3: Update Output Directory  
1. Find "Output Directory" section
2. Click "Override" toggle
3. Change from: `client/dist`
4. Change to: `dist`
5. Click "Save"

### Step 4: Verify Root Directory
1. Scroll down to "Root Directory" section
2. Confirm it's set to: `client`
3. If not, set it to `client` and click "Save"

### Step 5: Trigger New Deployment
1. Go to: https://vercel.com/onlyup/partyconnect/deployments
2. Click "Redeploy" on the latest deployment
3. **IMPORTANT**: Uncheck "Use existing Build Cache"
4. Click "Redeploy"

## Expected Result

Build should succeed with these logs:
```
Running build in Portland, USA (West) – pdx1
Cloning github.com/tnvjaosldka97-rgb/partyconnect (Branch: main)
Cloning completed
Running "vercel build"
Running "install" command: `pnpm install`...
Running "build" command: `pnpm build`...
Build completed
Deployment ready
```

## Alternative: Deploy via Vercel CLI

If web UI doesn't work, you can deploy directly:

```bash
cd /home/ubuntu/partyconnect
npx vercel --prod --cwd client
```

This will:
- Use `client` as the working directory
- Run build commands from within `client`
- Deploy to production

## Verification

Once deployed successfully:
1. Visit: https://partyconnect.vercel.app
2. Test filter toggle on /all-parties page
3. Check language selector in header
4. Verify admin dashboard at /admin (login: onlyup1! / onlyup12!)

## Files Modified in This Session

1. `/home/ubuntu/partyconnect/client/src/pages/AllParties.tsx` - Fixed filter toggle
2. `/home/ubuntu/partyconnect/client/src/components/GoogleTranslate.tsx` - Aligned language selector
3. `/home/ubuntu/partyconnect/client/src/pages/Admin.tsx` - Converted to English
4. `/home/ubuntu/partyconnect/client/src/pages/BecomeHost.tsx` - Converted to English
5. `/home/ubuntu/partyconnect/client/src/pages/AdminLogin.tsx` - Converted to English

All changes have been committed and pushed to GitHub (commit: 3f0f481).

## Summary

**What's Working**:
- ✅ All UI fixes completed
- ✅ Code pushed to GitHub
- ✅ Vercel Root Directory configured

**What Needs Manual Fix**:
- ❌ Build Command still has `cd client &&` (needs removal via web UI)
- ❌ Output Directory still has `client/` prefix (needs removal via web UI)

**Time Required**: 2-3 minutes to update settings and redeploy

---

**Note**: The Vercel web UI settings cannot be changed programmatically without API tokens. Manual update through the web interface is the fastest solution.

