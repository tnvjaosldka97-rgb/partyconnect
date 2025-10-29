# Host Rejection Process Test Guide

## Test Scenario: Host Application Rejection Flow

### Prerequisites
1. Admin access (username: `onlyup1!`, password: `onlyup12!`)
2. A test host application submitted

### Test Steps

#### Step 1: Submit Host Application
1. Navigate to `/become-host`
2. Fill out the application form:
   - Full Name: `Test User`
   - Email: `test@example.com`
   - Phone: `+1-555-0100`
   - City: `New York`
   - Space Type: `Apartment`
   - Address: `123 Test Street, New York, NY 10001`
   - Capacity: `20`
   - Bio: `I love hosting parties`
   - Experience: `2 years of hosting experience`
3. Upload ID card image (any image file)
4. Upload criminal record document (any image file)
5. Check all required checkboxes:
   - Terms of Service & Privacy Policy
   - Consent to Prohibition of Proxy Writing
6. Click "Apply to Become a Host"
7. Verify success message appears
8. Note the email used: `test@example.com`

#### Step 2: Admin Login
1. Navigate to `/admin/login`
2. Enter credentials:
   - Username: `onlyup1!`
   - Password: `onlyup12!`
3. Click "Login"
4. Verify redirect to `/admin`

#### Step 3: Navigate to Host Approvals
1. From Admin Dashboard, click "Host Approvals" or navigate to `/admin/host-approvals`
2. Verify the test application appears in the list
3. Find the application for `test@example.com`

#### Step 4: Reject Application
1. Locate the "Reject Application" button (red button with X icon)
2. Click "Reject Application"
3. Verify success toast: "Host Application Rejected"
4. Verify the application disappears from the pending list

#### Step 5: Test Rejection Page Access
1. Open a new incognito/private browser window
2. Navigate to `/host/dashboard`
3. Enter email: `test@example.com`
4. Click "Login"
5. **Expected Result:** Automatically redirected to `/host/rejected`

#### Step 6: Verify Rejection Page Content
On the `/host/rejected` page, verify the following elements:

**Header Section:**
- ✅ Red X circle icon
- ✅ Title: "Application Not Approved"
- ✅ Description explaining the rejection

**Possible Reasons Section:**
- ✅ List of possible rejection reasons
- ✅ Red bullet points
- ✅ Clear explanations

**What You Can Do Section:**
- ✅ Step 1: Review Your Application
- ✅ Step 2: Contact Support
- ✅ Step 3: Reapply in the Future
- ✅ Numbered steps with icons

**Contact Support Section:**
- ✅ Email icon
- ✅ "Need Help?" heading
- ✅ "Contact Support" button
- ✅ Button opens email client

**Action Buttons:**
- ✅ "Back to Home" button (outline style)
- ✅ "Submit New Application" button (gradient style)

#### Step 7: Test Navigation
1. Click "Back to Home" button
   - **Expected:** Redirect to `/`
2. Navigate back to `/host/rejected`
3. Click "Submit New Application" button
   - **Expected:** Redirect to `/become-host`
4. Click "Contact Support" button
   - **Expected:** Opens email client with `support@partybear.com`

#### Step 8: Test Direct Access Prevention
1. Try to access `/host/dashboard` while logged in as rejected host
   - **Expected:** Automatically redirected to `/host/rejected`
2. Try to access `/create-party`
   - **Expected:** Should not allow access (if protected)

### Expected Behavior Summary

| Action | Expected Result |
|--------|----------------|
| Submit application | Success toast, redirect to home |
| Admin rejects application | Application status = "rejected" |
| Rejected host tries to login | Redirect to `/host/rejected` |
| Access `/host/rejected` as rejected host | Show rejection page |
| Access `/host/rejected` as non-rejected user | Redirect to home |
| Click "Back to Home" | Redirect to `/` |
| Click "Submit New Application" | Redirect to `/become-host` |
| Click "Contact Support" | Open email client |

### Test Data Cleanup

After testing, clean up test data:

1. **Via Admin Panel:**
   - Login to admin
   - Navigate to Host Approvals
   - Find and delete test applications

2. **Via Browser Console:**
   ```javascript
   // Remove test application
   const apps = JSON.parse(localStorage.getItem('hostApplications') || '[]');
   const filtered = apps.filter(app => app.email !== 'test@example.com');
   localStorage.setItem('hostApplications', JSON.stringify(filtered));
   
   // Remove host email
   localStorage.removeItem('hostEmail');
   ```

### Edge Cases to Test

1. **Multiple Rejections:**
   - Reject same user twice
   - Verify status remains "rejected"

2. **Reapplication After Rejection:**
   - Submit new application with same email
   - Verify new application creates new entry

3. **Direct URL Access:**
   - Access `/host/rejected` without being rejected
   - Should redirect to home

4. **Browser Back Button:**
   - After rejection redirect, press back
   - Should stay on rejection page or redirect again

### Troubleshooting

**Issue:** Rejection page doesn't show
- Check browser console for errors
- Verify `hostEmail` in localStorage
- Verify host status is "rejected" in localStorage

**Issue:** Not redirected to rejection page
- Clear browser cache
- Check HostDashboard redirect logic
- Verify HostRejected route is registered

**Issue:** Contact Support button doesn't work
- Check browser email client settings
- Verify `mailto:` link is correct

### Success Criteria

✅ Host application can be rejected by admin  
✅ Rejected host is redirected to `/host/rejected`  
✅ Rejection page displays all required content  
✅ Navigation buttons work correctly  
✅ Contact support button opens email client  
✅ Non-rejected users cannot access rejection page  
✅ Rejected users cannot access host dashboard  

---

**Test Date:** _____________  
**Tester:** _____________  
**Result:** ✅ Pass / ❌ Fail  
**Notes:** _____________

