# GitHub Pages Deployment Instructions

## Quick Deployment Guide

### Step 1: Create GitHub Repository

1. Go to https://github.com and log in
2. Click the "+" icon in the top right, select "New repository"
3. Name your repository: `username.github.io` (replace `username` with your GitHub username)
   - Example: if your username is `johnrunner`, name it `johnrunner.github.io`
4. Make sure it's **Public**
5. **Do NOT** initialize with README (you already have one)
6. Click "Create repository"

### Step 2: Upload Your Website Files

#### Option A: Using Git Command Line

```bash
# Navigate to your project directory
cd running-blog

# Initialize git repository
git init

# Add all files
git add .

# Commit files
git commit -m "Initial commit: Running Journal website"

# Add remote repository (replace 'username' with your GitHub username)
git remote add origin https://github.com/username/username.github.io.git

# Push to GitHub
git branch -M main
git push -u origin main
```

#### Option B: Using GitHub Desktop

1. Download and install GitHub Desktop from https://desktop.github.com
2. Open GitHub Desktop
3. File → Add Local Repository → Choose your `running-blog` folder
4. Click "Publish repository"
5. Make sure "Keep this code private" is **UNCHECKED**
6. Click "Publish Repository"

#### Option C: Upload Files Directly via Web

1. Go to your new repository on GitHub
2. Click "uploading an existing file"
3. Drag and drop all your website files
4. Click "Commit changes"

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click "Settings" tab
3. Scroll down to "Pages" in the left sidebar
4. Under "Source", select "main" branch
5. Click "Save"
6. Wait 2-5 minutes for deployment

### Step 4: Access Your Website

Your website will be available at:
```
https://username.github.io
```

Replace `username` with your actual GitHub username.

## Custom Domain (Optional)

If you want to use your own domain (e.g., `www.myrunningjournal.com`):

1. Buy a domain from providers like:
   - Namecheap
   - GoDaddy
   - Google Domains
   - Cloudflare

2. In your repository, create a file named `CNAME` (no extension) with your domain:
   ```
   www.myrunningjournal.com
   ```

3. In your domain registrar's DNS settings, add:
   - Type: CNAME
   - Name: www
   - Value: username.github.io
   - TTL: 3600

4. Wait 24-48 hours for DNS propagation

## Adding Your Content

### Add Your Photos

1. Replace placeholder image paths in HTML with your actual photos
2. Upload images to the respective folders:
   - `assets/images/hero/` - Hero background images
   - `assets/images/marathons/` - Marathon photos
   - `assets/images/routes/` - Route photos

3. Recommended image sizes:
   - Hero images: 1920x1080px
   - Route/Marathon photos: 1200x800px

4. Optimize images before uploading:
   - Use tools like TinyPNG, ImageOptim, or Squoosh
   - Target file size: < 500KB per image

### Add Your GPX Routes

1. Export GPX files from:
   - Strava: Activity → ⚙️ → Export GPX
   - Garmin Connect: Activity → ⚙️ → Export GPX
   - Any GPS watch/app

2. Rename files to match HTML references:
   - `bondi-bronte.gpx`
   - `centennial-loop.gpx`
   - `harbour-circuit.gpx`

3. Upload to `assets/gpx/` folder

### Update Personal Information

Edit the HTML files to update:

1. **index.html**
   - Hero title and subtitle
   - Statistics (marathons completed, years running)
   - Recent milestones
   - Personal introduction text

2. **marathons.html**
   - Personal best times
   - Marathon race records
   - Half marathon records
   - Race photos

3. **routes.html**
   - Your favorite running routes
   - Route details and descriptions
   - Route photos

4. **about.html**
   - Your personal story
   - Running journey timeline
   - Training approach
   - Running philosophy

### Update Social Media Links

In all HTML files, update these links:

```html
<!-- Find and replace these placeholder URLs -->
<a href="https://www.xiaohongshu.com/YOUR_PROFILE" ...>
<a href="https://www.tiktok.com/@YOUR_USERNAME" ...>
<a href="https://channels.weixin.qq.com/YOUR_CHANNEL" ...>
```

## Updating Your Website

After making changes:

```bash
git add .
git commit -m "Update website content"
git push origin main
```

Changes will appear on your live site within 1-2 minutes.

## Troubleshooting

### Website Not Showing Up

1. Check GitHub Pages settings are enabled
2. Ensure repository is public
3. Wait 5-10 minutes after first deployment
4. Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)

### Images Not Loading

1. Check file paths are correct (case-sensitive)
2. Ensure images are uploaded to correct folders
3. Verify image file extensions match HTML references

### GPX Maps Not Displaying

1. Check Leaflet.js is loading (check browser console)
2. Verify GPX file paths in HTML
3. Ensure GPX files are valid XML format

### Language Toggle Not Working

1. Check JavaScript files are loading
2. Clear browser cache
3. Check browser console for errors

## Performance Optimization

### Image Optimization

```bash
# Install ImageOptim (Mac) or use online tools
# Compress all images to < 500KB each
```

### Enable Caching

Create `.htaccess` file (if using custom domain with Apache):

```apache
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

## SEO Optimization

1. Update meta descriptions in each HTML file
2. Add relevant keywords
3. Submit sitemap to Google Search Console:
   - Go to https://search.google.com/search-console
   - Add property: https://username.github.io
   - Submit sitemap: https://username.github.io/sitemap.xml

2. Create `sitemap.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://username.github.io/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://username.github.io/marathons.html</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://username.github.io/routes.html</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://username.github.io/about.html</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

## Analytics (Optional)

Add Google Analytics to track visitors:

1. Sign up at https://analytics.google.com
2. Create a property
3. Copy tracking code
4. Add before `</head>` in all HTML files:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

## Support

For issues with:
- **GitHub Pages**: https://docs.github.com/en/pages
- **Git basics**: https://git-scm.com/doc
- **Web hosting**: Contact GitHub Support

## Security

- Never commit sensitive information (passwords, API keys)
- Keep repository public for GitHub Pages to work
- Use `.gitignore` to exclude sensitive files
- Regularly update dependencies

---

**Congratulations!** Your running journal is now live on the web! 🏃‍♂️🎉

