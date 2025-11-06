# Running Journal | 悉尼老梅的跑步日志

A beautiful, bilingual (English/Chinese) personal running journal website designed for runners 40+. Features elegant design, responsive layout, and optimized for GitHub Pages hosting.

![Running Journal](https://img.shields.io/badge/Running-Journal-5a7a8c?style=for-the-badge)
![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-222222?style=for-the-badge&logo=github)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## ✨ Features

- 🌍 **Bilingual Support**: Seamless English/Chinese toggle
- 📱 **Fully Responsive**: Optimized for desktop, tablet, and mobile
- 🎨 **Elegant Design**: Calm, mature color palette with soft animations
- 🗺️ **Interactive Maps**: GPX route visualization with Leaflet.js
- 📊 **Marathon Records**: Track and showcase all your race achievements
- 🏃 **Route Gallery**: Document favorite running routes with photos and details
- 🎥 **Video Integration**: Embed YouTube/TikTok videos
- 📈 **Personal Timeline**: Showcase your running journey
- 🚀 **Fast Loading**: Optimized images and lazy loading
- 🔍 **SEO Optimized**: Comprehensive SEO with structured data, Open Graph, Twitter Cards, and more

## 📁 Project Structure

```
running-blog/
├── index.html              # Homepage
├── marathons.html          # Marathon records and achievements
├── routes.html             # Running routes with maps
├── about.html              # Personal story and philosophy
│
├── css/
│   ├── main.css           # Core styles
│   ├── responsive.css     # Mobile/tablet breakpoints
│   └── animations.css     # Smooth transitions and effects
│
├── js/
│   ├── language.js        # Bilingual toggle functionality
│   ├── main.js            # Navigation, scroll, interactions
│   └── map.js             # GPX route visualization
│
├── assets/
│   ├── images/
│   │   ├── hero/          # Hero background images
│   │   ├── marathons/     # Marathon event photos
│   │   ├── routes/        # Route scenery photos
│   │   └── icons/         # Social media icons
│   ├── audio/
│   │   └── ambient.mp3    # Optional background music
│   └── gpx/
│       └── *.gpx          # GPS route data files
│
├── SITEMAP.md             # Site structure overview
├── DEPLOYMENT.md          # Detailed deployment guide
├── SEO-GUIDE.md           # Complete SEO optimization guide
├── robots.txt             # Search engine crawler instructions
├── sitemap.xml            # XML sitemap for search engines
└── README.md              # This file
```

## 🚀 Quick Start

### 1. Clone or Download

```bash
git clone https://github.com/yourusername/running-blog.git
cd running-blog
```

### 2. Add Your Content

1. **Update Personal Information**:
   - Edit HTML files with your name, stats, and stories
   - Update marathon times and race records
   - Customize route descriptions

2. **Add Photos**:
   - Place your photos in `assets/images/` folders
   - Recommended sizes: Hero (1920x1080), Routes/Marathons (1200x800)
   - Optimize images before uploading (< 500KB each)

3. **Add GPX Routes**:
   - Export GPX files from Strava/Garmin
   - Save to `assets/gpx/` folder
   - Name them: `bondi-bronte.gpx`, `centennial-loop.gpx`, etc.

4. **Update Social Links**:
   - Replace placeholder social media URLs in HTML files

### 3. Test Locally

Simply open `index.html` in your web browser to preview the site.

For a local server (optional):

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js
npx http-server

# Using PHP
php -S localhost:8000
```

Then visit: `http://localhost:8000`

### 4. Deploy to GitHub Pages

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

**Quick version:**

```bash
# Initialize git
git init
git add .
git commit -m "Initial commit"

# Create repository on GitHub named: username.github.io
# Then push:
git remote add origin https://github.com/username/username.github.io.git
git branch -M main
git push -u origin main
```

Your site will be live at: `https://username.github.io`

## 🎨 Customization

### Change Colors

Edit `css/main.css`:

```css
:root {
    --primary-color: #5a7a8c;      /* Main theme color */
    --primary-dark: #3d5a6b;       /* Darker shade */
    --secondary-color: #8b9d77;    /* Secondary accent */
    --accent-color: #c89968;       /* Highlight color */
    /* ... */
}
```

### Modify Fonts

In HTML `<head>` section, change Google Fonts:

```html
<link href="https://fonts.googleapis.com/css2?family=Your+Font+Here&display=swap" rel="stylesheet">
```

Then update CSS:

```css
body {
    font-family: 'Your Font Here', sans-serif;
}
```

### Add Background Music (Optional)

1. Add audio file to `assets/audio/ambient.mp3`
2. See `assets/audio/README.md` for implementation

## 📱 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile Safari (iOS 13+)
- ✅ Chrome Mobile (Android 10+)

## 🔧 Technologies Used

- **HTML5**: Semantic markup, accessibility features
- **CSS3**: Flexbox, Grid, custom properties, animations
- **JavaScript (ES6+)**: Modern vanilla JS, no frameworks
- **Leaflet.js**: Interactive map visualization
- **Google Fonts**: Lato + Noto Sans SC for bilingual support

## 📸 Adding Images

### Recommended Image Sources

Free, high-quality running photos:
- [Unsplash](https://unsplash.com/s/photos/running) - Free high-res photos
- [Pexels](https://www.pexels.com/search/marathon/) - Free stock photos
- [Pixabay](https://pixabay.com/images/search/runner/) - Free images

### Image Optimization Tools

- [TinyPNG](https://tinypng.com/) - Online compression
- [Squoosh](https://squoosh.app/) - Advanced web optimization
- [ImageOptim](https://imageoptim.com/) - Mac app
- [RIOT](https://riot-optimizer.com/) - Windows app

## 🗺️ GPX Routes

### How to Get GPX Files

**From Strava:**
1. Go to activity
2. Click ⚙️ (settings) → Export GPX

**From Garmin Connect:**
1. Open activity
2. Click ⚙️ → Export → GPX

**Create Manually:**
- [Plot a Route](https://www.plotaroute.com/)
- [On The Go Map](https://onthegomap.com/)
- [GPS Visualizer](https://www.gpsvisualizer.com/)

## 🌍 SEO Optimization (✅ COMPLETE)

The site now includes comprehensive SEO optimization:

✅ **Open Graph & Twitter Cards** - Beautiful social media previews  
✅ **Structured Data (Schema.org)** - Rich snippets in search results  
✅ **XML Sitemap** - Complete sitemap.xml for search engines  
✅ **robots.txt** - Proper crawler instructions  
✅ **Canonical URLs** - Prevents duplicate content issues  
✅ **Language Alternates** - Bilingual SEO support  
✅ **Meta Tags** - Optimized titles, descriptions, keywords

**See [SEO-GUIDE.md](SEO-GUIDE.md) for complete details and post-deployment tasks.**

### Quick Setup After Deployment

1. Replace `yourusername.github.io` with your actual URL in:
   - All HTML head sections
   - `sitemap.xml`
   - `robots.txt`

2. Submit to search engines:
   - [Google Search Console](https://search.google.com/search-console)
   - [Bing Webmaster Tools](https://www.bing.com/webmasters)

3. Test your SEO:
   - [Rich Results Test](https://search.google.com/test/rich-results)
   - [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug)
   - [Twitter Card Validator](https://cards-dev.twitter.com/validator)

## 🤝 Contributing

This is a personal project template, but suggestions are welcome!

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

Feel free to use this template for your own running journal!

## 🎯 Credits

**Design & Development**: Created as a personal running journal template
**Icons**: Emoji icons for simplicity and universal appeal
**Maps**: Powered by Leaflet.js and OpenStreetMap
**Fonts**: Google Fonts (Lato, Noto Sans SC)

## 💡 Tips for Runners

### Content Ideas

- **Weekly Running Log**: Add a blog section
- **Training Plans**: Share your marathon training approach
- **Gear Reviews**: Review running shoes, watches, accessories
- **Running Tips**: Share advice for other runners 40+
- **Race Reports**: Detailed write-ups of each marathon
- **Injury Prevention**: Share recovery and injury prevention tips
- **Nutrition**: Document pre-race meals and hydration strategies

### Community Engagement

- Link to running clubs
- Add comments section (Disqus, Facebook Comments)
- Create newsletter signup
- Share on running forums and communities

## 📞 Support

**Issues with deployment?** Check [DEPLOYMENT.md](DEPLOYMENT.md)

**Technical questions?** Open an issue on GitHub

**General feedback?** Connect via social media links

---

## 🏃‍♂️ Start Your Running Journal Today!

Every step of your journey deserves to be documented. Use this template to create your own beautiful running journal and inspire others!

**Happy Running! 加油！** 🎉

---

Made with ❤️ and many kilometers

*"The journey of a thousand miles begins with a single step."* - Lao Tzu

