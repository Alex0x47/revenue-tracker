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
    totalRevenue: 93.69,
    revenueComposition: [
      {
        id: 'my-apps',
        name: 'My Apps',
        url: '',
        revenue: 93.69,
      },
    ]
  },
  {
    day: 2,
    date: '2026-01-02',
    totalRevenue: 121.13,
    revenueComposition: [
      {
        id: 'my-apps',
        name: 'My Apps',
        url: '',
        revenue: 121.13,
      },
    ]
  },
  {
    day: 3,
    date: '2026-01-03',
    totalRevenue: 57.71,
    revenueComposition: [
      {
        id: 'my-apps',
        name: 'My Apps',
        url: '',
        revenue: 57.71,
      },
    ]
  },
  {
    day: 4,
    date: '2026-01-04',
    totalRevenue: 95.29,
    revenueComposition: [
      {
        id: 'my-apps',
        name: 'My Apps',
        url: '',
        revenue: 95.29,
      },
    ]
  },
  {
    day: 5,
    date: '2026-01-05',
    totalRevenue: 100.00,
    revenueComposition: [
      {
        id: 'ebook',
        name: 'My Ebook - from $0 to $2k/mo in 9 months',
        url: 'https://pim.ms/kutR8yz',
        revenue: 49,
      },
      {
        id: 'my-apps',
        name: 'My Apps',
        url: '',
        revenue: 98.42,
      },
      {
        id: 'freelancing',
        name: 'Freelancing',
        url: '',
        revenue: 700,
      }
    ]
  }
];