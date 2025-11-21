# Google Maps Setup Guide

This project uses Google Maps API to display running routes. Follow these steps to set it up.

## 1. Get a Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Maps JavaScript API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Maps JavaScript API"
   - Click "Enable"

4. Create an API Key:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy your API key

5. (Recommended) Restrict your API key:
   - Click on the API key to edit it
   - Under "Application restrictions", select "HTTP referrers"
   - Add your domain(s):
     - `https://yourusername.github.io/*`
     - `http://localhost:*` (for local development)
   - Under "API restrictions", select "Restrict key"
   - Choose "Maps JavaScript API"
   - Save

## 2. Add API Key to HTML Files

Replace `YOUR_API_KEY` in these files with your actual API key:

- `strava-runs.html` (line ~116)
- `routes.html` (line ~400)

Example:
```html
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxx&callback=initGoogleMaps" async defer></script>
```

## 3. For GitHub Pages Deployment

If you're using GitHub Pages, you can:

### Option A: Use Environment Variable (Recommended for CI/CD)
Store the API key as a GitHub Secret and use it in your build process.

### Option B: Use a Config File (Not Recommended - Security Risk)
Create a `config.js` file (add to `.gitignore`):
```javascript
window.GOOGLE_MAPS_API_KEY = 'YOUR_API_KEY';
```

Then update the script tag:
```html
<script src="js/config.js"></script>
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initGoogleMaps" async defer></script>
```

### Option C: Use GitHub Secrets in Workflow
If using GitHub Actions, you can inject the key during build.

## 4. Pricing

Google Maps JavaScript API has a free tier:
- **$200 free credit per month**
- After free credit: $7 per 1,000 map loads

For most personal websites, the free tier is sufficient.

## 5. Testing

1. Open your site locally or on GitHub Pages
2. Check browser console for any API errors
3. Verify maps load correctly
4. Test route visualization

## Troubleshooting

### "This page can't load Google Maps correctly"
- Check API key is correct
- Verify Maps JavaScript API is enabled
- Check API key restrictions allow your domain

### Maps not showing
- Check browser console for errors
- Verify API key has proper permissions
- Ensure callback function `initGoogleMaps` is defined

### Rate limit errors
- Check your API usage in Google Cloud Console
- Consider implementing caching
- Review API key restrictions

## Security Notes

### ⚠️ Important: API Key Security

**For Google Maps JavaScript API, the key MUST be in client-side code (HTML/JavaScript).** This is the intended way to use it. However, you MUST restrict it properly:

1. **Always restrict your API key:**
   - Go to Google Cloud Console > APIs & Services > Credentials
   - Click on your API key
   - Under "Application restrictions":
     - Select "HTTP referrers (web sites)"
     - Add ONLY your specific domains:
       - `https://yourusername.github.io/*`
       - `https://*.github.io/*` (if using GitHub Pages)
       - `http://localhost:*` (for local development only)
   - Under "API restrictions":
     - Select "Restrict key"
     - Choose ONLY "Maps JavaScript API"
     - Save

2. **Why restrictions matter:**
   - Without restrictions, anyone can copy your key and use it
   - This can lead to unexpected charges on your account
   - Restricted keys can only be used from your specified domains

3. **Monitor usage:**
   - Check Google Cloud Console regularly for usage
   - Set up billing alerts
   - Review API usage reports

4. **Best practices:**
   - Use separate keys for development and production
   - Rotate keys periodically
   - Never share keys publicly
   - Use the free tier monitoring tools

### ⚠️ Public Repository Warning

If your repository is public (like GitHub Pages), your API key will be visible in the HTML. This is acceptable ONLY if:
- ✅ The key is properly restricted to your domain
- ✅ The key is restricted to Maps JavaScript API only
- ✅ You monitor usage regularly

If you're concerned about key visibility, consider:
- Using GitHub Secrets for CI/CD (but still need key in HTML for client-side)
- Using a proxy server (advanced, not recommended for simple sites)
- Accepting that client-side keys are visible but properly restricted

