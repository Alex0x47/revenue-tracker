/**
 * EXAMPLE:
 * 
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
 */

export const revenue = [
  {
    day: 1,
    date: '2026-01-01',
    totalRevenue: 71.14,
    revenueComposition: [
      {
        id: 'my-apps',
        name: 'My Apps',
        url: '',
        revenue: 71.14,
      },
    ]
  }
];