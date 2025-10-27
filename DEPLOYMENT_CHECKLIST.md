# PartyBear Deployment Checklist

## ✅ Completed Changes

### 1. Branding
- [x] Changed app name from "partyconnect" to "partybear" in package.json
- [x] Updated APP_TITLE to "PartyBear 🐻" in const.ts
- [x] Updated page title in index.html
- [x] Added PartyBear logo (/party-bear.png)
- [x] Updated Header component with PartyBear branding

### 2. Image Upload System
- [x] Implemented imgbb image upload utility (client/src/lib/imageUpload.ts)
- [x] Replaced Multer-based upload with imgbb in Admin.tsx
- [x] Works in Vercel serverless environment

### 3. UI Improvements
- [x] Removed Instagram DM link from Create Party button
- [x] Improved mobile header layout
- [x] Reduced header height on mobile (h-16 vs h-20)
- [x] Optimized button sizes for mobile (h-8 px-3)
- [x] Better spacing with gap utilities
- [x] Logo shows "PartyBear" text on all screen sizes
- [x] Smaller logo on mobile (w-8 h-8 vs w-10 h-10)

### 4. Removed Features
- [x] Instagram DM link removed from Header
- [x] Create Party button now links to /create-party

## 📋 Verification Checklist

Before deployment:
- [ ] No "PartyConnect" references in code
- [ ] No Instagram links in code
- [ ] Mobile header looks good
- [ ] Logo displays correctly
- [ ] Image upload works with imgbb
- [ ] Build completes successfully

## 🚀 Next Steps

1. Build project: `pnpm build`
2. Push to GitHub
3. Vercel auto-deploys
4. Change Vercel project name to "partybear" in dashboard
5. New URL: https://partybear.vercel.app

## 📝 Notes

- Custom PartyBear logo pending from user
- Domain change requires Vercel dashboard access
