# 🚀 Quick Start Guide

Get your running journal live in 10 minutes!

## ⚡ Super Quick Setup (3 Steps)

### Step 1: Get Your Files Ready (2 min)

1. Download or clone this repository
2. Open the folder in your favorite code editor

### Step 2: Personalize Your Content (5 min)

**Must-do edits:**

1. **Open `index.html`** and find these sections:
   ```html
   <!-- Line ~32: Update hero title -->
   <h1 class="hero-title" data-en="Every Step Counts" data-zh="每一步都算数">

   <!-- Line ~42-60: Update your statistics -->
   <div class="stat-number">12</div>  <!-- Change to your marathon count -->
   
   <!-- Line ~78-90: Update your introduction -->
   <p data-en="At 45, running has become..." data-zh="45岁，跑步...">
   ```

2. **Open `marathons.html`** and update:
   ```html
   <!-- Line ~60-75: Update your personal bests -->
   <div class="pb-time">3:45:23</div>  <!-- Your marathon PB -->
   
   <!-- Line ~100+: Update your race results table -->
   <tr>
       <td>2024-10-15</td>  <!-- Your race dates -->
       <td>Sydney Marathon</td>  <!-- Your races -->
       <td>3:45:23</td>  <!-- Your times -->
   </tr>
   ```

3. **Update social media links** in ALL HTML files:
   ```html
   <!-- Find and replace these URLs -->
   https://www.xiaohongshu.com/  → Your Xiaohongshu profile
   https://www.tiktok.com/  → Your TikTok profile
   https://channels.weixin.qq.com/  → Your WeChat channel
   ```

### Step 3: Deploy to GitHub Pages (3 min)

```bash
# In your terminal/command prompt:
cd running-blog

# Initialize and commit
git init
git add .
git commit -m "My running journal"

# Create new repo on GitHub: username.github.io
# Replace 'username' with YOUR GitHub username below:
git remote add origin https://github.com/username/username.github.io.git
git branch -M main
git push -u origin main
```

**Done!** Visit `https://username.github.io` in 2 minutes.

---

## 📸 Adding Your Photos (Optional - Do Later)

### Priority Images to Add:

1. **Hero Background** (`assets/images/hero/runner-landscape.jpg`)
   - Your best running photo
   - Landscape orientation
   - Size: 1920x1080px
   - Can use Unsplash photos temporarily

2. **Profile Photo** (`assets/images/hero/profile-running.jpg`)
   - Photo of you running
   - Portrait or square
   - Size: 800x800px minimum

3. **Route Photos** (3-6 photos in `assets/images/routes/`)
   - Photos from your favorite routes
   - Size: 1200x800px
   - Names: `bondi-beach.jpg`, `centennial-park.jpg`, etc.

4. **Marathon Photos** (3-6 photos in `assets/images/marathons/`)
   - Race day photos
   - Finish line moments
   - Size: 1200x800px

### Where to Get Free Running Photos (Until You Add Your Own):

- [Unsplash Running](https://unsplash.com/s/photos/running)
- [Pexels Marathon](https://www.pexels.com/search/marathon/)
- [Pixabay Runner](https://pixabay.com/images/search/runner/)

### Quick Image Optimization:

Before uploading, compress at: [TinyPNG.com](https://tinypng.com)
- Target: < 500KB per image
- Maintains quality, reduces file size

---

## 🗺️ Adding GPX Routes (Optional)

### From Strava:

1. Go to any activity
2. Click the **wrench icon** (⚙️)
3. Select **Export GPX**
4. Save to `assets/gpx/bondi-bronte.gpx`

### From Garmin:

1. Open activity in Garmin Connect
2. Click **gear icon** → Export
3. Choose **GPX format**
4. Save to `assets/gpx/` folder

### From Apple Watch:

1. Use apps like **HealthFit**
2. Export workout as GPX
3. Save to `assets/gpx/` folder

**Note:** Maps will work without GPX files - they'll show placeholder routes for Sydney.

---

## 🌍 Language Toggle

Your site already supports English/Chinese!

**To test:**
1. Open your website
2. Click the language button (top-right: "中文" or "EN")
3. Watch all text switch languages

**To edit translations:**
In any HTML file, find elements with both `data-en` and `data-zh`:

```html
<h1 data-en="Marathon Records" data-zh="马拉松记录">
```

Change both attributes to update translations.

---

## ✏️ Customization Tips

### Change Theme Colors

Edit `css/main.css` (line 1-15):

```css
:root {
    --primary-color: #5a7a8c;  /* Blue-grey - Change to your favorite color */
    --accent-color: #c89968;   /* Gold - Change accent color */
}
```

**Color ideas for runners:**
- Ocean blue: `#1e88e5`
- Forest green: `#43a047`
- Sunset orange: `#ff6f00`
- Mountain purple: `#7e57c2`

### Change Fonts

In HTML `<head>`, replace the Google Fonts link:

```html
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;700&display=swap" rel="stylesheet">
```

Then in `css/main.css`:

```css
body {
    font-family: 'Montserrat', sans-serif;
}
```

---

## 🐛 Troubleshooting

### "My site isn't showing up!"

1. **Wait 5 minutes** after first push
2. Check GitHub repo is **public** (not private)
3. Go to repo **Settings → Pages**
4. Ensure "Source" is set to "main" branch
5. Clear browser cache: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

### "Images aren't loading!"

1. Check file names match exactly (case-sensitive)
2. Ensure images are in correct folders
3. File paths must start with `assets/images/`

### "Language toggle not working!"

1. Check browser console for errors (F12)
2. Ensure `js/language.js` is loading
3. Clear browser cache

### "Maps not showing!"

This is normal if:
- You haven't added GPX files yet
- You'll see placeholder maps (this is fine!)
- To add real routes, see "Adding GPX Routes" above

---

## 📱 Mobile Preview

Test your site on mobile:

1. **Chrome DevTools**: Press F12 → Click phone icon
2. **Actual Phone**: Open site on your phone
3. **Responsive Check**: [Responsinator.com](http://www.responsinator.com/)

Your site is already mobile-optimized! 📱✅

---

## 🎉 You're Done!

Your running journal is live! Now share it:

- Post on Xiaohongshu: "我的悉尼老梅的跑步日志上线了！"
- Share on TikTok with your running community
- Add link to your WeChat profile
- Share in running clubs and forums

**Next steps:**
1. Add your actual race photos
2. Update marathon times with real data
3. Add GPX files from your favorite routes
4. Share with running friends!

---

## 📚 More Details

- **Full Documentation**: See [README.md](README.md)
- **Deployment Guide**: See [DEPLOYMENT.md](DEPLOYMENT.md)
- **Site Structure**: See [SITEMAP.md](SITEMAP.md)

---

**Questions?** Open an issue on GitHub or check the full documentation.

**Happy Running!** 🏃‍♂️💨

