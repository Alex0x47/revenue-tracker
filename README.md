# Revenue Tracker

A beautiful, static revenue tracker inspired by GitHub's contribution chart. Track your yearly revenue goal progress with a visual daily breakdown.

## Features

- Visual yearly revenue tracking with GitHub-style contribution chart
- Daily revenue breakdown with composition details
- Progress tracking against yearly goal
- Share on X (Twitter) with auto-generated text
- Download chart as image for social sharing
- Connected to your X profile (avatar + handle)
- Fully static - deploy anywhere (GitHub Pages, Netlify, Vercel)
- Dark mode design with modern UI
- Mobile responsive

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/Alex0x47/revenue-tracker.git
cd revenue-tracker
```

### 2. Configure your settings

Edit `const.js` with your details:

```javascript
export const OBJECTIVE = 330000;        // Your yearly revenue goal in dollars
export const TWITTER_HANDLE = 'nomalex_'; // Your X (Twitter) handle (without @)
```

### 3. Add your revenue data

Edit `revenue.js` to add your daily revenue. Each entry follows this structure:

```javascript
export const revenue = [
  {
    day: 1,                    // Day number of the year
    date: '2026-01-01',        // Date in YYYY-MM-DD format
    totalRevenue: 100,         // Total revenue for the day
    revenueComposition: [      // Breakdown of revenue sources
      {
        id: 'my-app',          // Unique identifier
        name: 'My App',        // Display name
        url: 'https://...',    // Optional: link to the product
        revenue: 80,           // Revenue from this source
      },
      {
        id: 'my-ebook',
        name: 'My Ebook',
        url: '',               // Leave empty if no link
        revenue: 20,
      },
    ]
  },
  // Add more days...
];
```

### 4. Deploy

#### GitHub Pages

1. Push your changes to GitHub
2. Go to repository Settings > Pages
3. Select "Deploy from a branch" and choose `main`
4. Your tracker will be live at `https://yourusername.github.io/revenue-tracker`

#### Other platforms

Simply upload the files to any static hosting service (Netlify, Vercel, Cloudflare Pages, etc.)

## Daily Usage

Each day, add a new entry to the `revenue` array in `revenue.js`:

```javascript
{
  day: 2,
  date: '2026-01-02',
  totalRevenue: 250,
  revenueComposition: [
    { id: 'my-app', name: 'My App', url: 'https://myapp.com', revenue: 200 },
    { id: 'consulting', name: 'Consulting', url: '', revenue: 50 },
  ]
}
```

Then commit and push your changes to update the live site.

## Customization

### Color Levels

The chart uses 5 color levels based on daily revenue. Edit these thresholds in `main.js`:

```javascript
function getRevenueLevel(amount) {
  if (amount === 0) return 0;
  if (amount < 500) return 1;   // Adjust these values
  if (amount < 1000) return 2;
  if (amount < 2000) return 3;
  return 4;
}
```

### Year

The tracker defaults to 2026. To change it, edit the `YEAR` constant in `main.js`:

```javascript
const YEAR = 2026; // Change to your target year
```

### Styling

All styles are in `main.css`. Key CSS variables you might want to customize:

```css
:root {
  --accent-purple: #8b5cf6;   /* Primary accent color */
  --accent-cyan: #06b6d4;     /* Secondary accent color */
  --accent-green: #10b981;    /* Money/revenue color */
  --bg-primary: #0a0a0f;      /* Background color */
}
```

## File Structure

```
revenue-tracker/
├── index.html      # Main HTML file
├── main.css        # All styles
├── main.js         # Application logic
├── const.js        # Configuration (objective, Twitter handle)
├── revenue.js      # Your revenue data
└── README.md       # This file
```

## Tech Stack

- Vanilla JavaScript (ES6 modules)
- Vanilla CSS (CSS variables, Grid, Flexbox)
- [html2canvas](https://html2canvas.hertzen.com/) for chart image generation
- [unavatar.io](https://unavatar.io/) for Twitter profile pictures

## License

MIT License - feel free to use this for your own revenue tracking!

## Credits

Originally built by [Alexandre Grisey](https://x.com/nomalex_)
