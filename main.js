import { OBJECTIVE, TWITTER_HANDLE, REVENUE_TRESHOLDS } from './const.js';
import { revenue } from './revenue.js';

// DOM Elements
const currentRevenueEl = document.getElementById('current-revenue');
const objectiveEl = document.getElementById('objective');
const progressPercentEl = document.getElementById('progress-percent');
const yearPercentEl = document.getElementById('year-percent');
const progressFillEl = document.getElementById('progress-fill');
const yearMarkerEl = document.getElementById('year-marker');
const contributionGridEl = document.getElementById('contribution-grid');
const monthsLabelsEl = document.getElementById('months-labels');
const dayDetailsEl = document.getElementById('day-details');
const detailsDateEl = document.getElementById('details-date');
const detailsDateBadgeEl = document.getElementById('details-date-badge');
const detailsRevenueEl = document.getElementById('details-revenue');
const detailsProgressTextEl = document.getElementById('details-progress-text');
const compositionEl = document.getElementById('composition');
const closeDetailsBtn = document.getElementById('close-details');
const shareBtnEl = document.getElementById('share-btn');
const profilePicEl = document.getElementById('profile-pic');
const twitterLinkEl = document.getElementById('twitter-link');
const twitterHandleEl = document.getElementById('twitter-handle');

// Current displayed day data (for sharing)
let currentDayData = null;

// Constants
const YEAR = 2026;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Create a map of revenue by date for quick lookup
const revenueByDate = new Map();
revenue.forEach(entry => {
  revenueByDate.set(entry.date, entry);
});

// Calculate total revenue
function getTotalRevenue() {
  return revenue.reduce((sum, entry) => sum + entry.totalRevenue, 0);
}

// Calculate year progress percentage
function getYearProgress() {
  const now = new Date();
  const startOfYear = new Date(YEAR, 0, 1);
  const endOfYear = new Date(YEAR, 11, 31, 23, 59, 59);

  if (now < startOfYear) return 0;
  if (now > endOfYear) return 100;

  const totalDays = (endOfYear - startOfYear) / (1000 * 60 * 60 * 24);
  const daysPassed = (now - startOfYear) / (1000 * 60 * 60 * 24);

  return (daysPassed / totalDays) * 100;
}

// Get revenue level for a given amount (0-4)
function getRevenueLevel(amount) {
  if (amount === 0) return 0;
  if (amount < REVENUE_TRESHOLDS.level1) return 1;
  if (amount < REVENUE_TRESHOLDS.level2) return 2;
  if (amount < REVENUE_TRESHOLDS.level3) return 3;
  if (amount < REVENUE_TRESHOLDS.level4) return 4;
  return 4;
}

// Format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

// Format date for display
function formatDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Update header stats
function updateStats() {
  const totalRevenue = getTotalRevenue();
  const progressPercent = (totalRevenue / OBJECTIVE) * 100;
  const yearPercent = getYearProgress();

  currentRevenueEl.textContent = formatCurrency(totalRevenue);
  objectiveEl.textContent = formatCurrency(OBJECTIVE);
  progressPercentEl.textContent = `${progressPercent.toFixed(1)}%`;
  yearPercentEl.textContent = `${yearPercent.toFixed(1)}%`;

  progressFillEl.style.width = `${Math.min(progressPercent, 100)}%`;
  yearMarkerEl.style.left = `${yearPercent}%`;
}

// Helper to format date as YYYY-MM-DD
function toDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Generate the contribution grid
function generateGrid() {
  contributionGridEl.innerHTML = '';

  const startDate = new Date(YEAR, 0, 1);
  const endDate = new Date(YEAR, 11, 31);
  const today = new Date();
  const todayStr = toDateString(today);

  // Find the first day to display (could be from previous year to align weeks)
  const firstDayOfYear = startDate.getDay(); // 0 = Sunday
  const adjustedStart = new Date(startDate);
  adjustedStart.setDate(adjustedStart.getDate() - firstDayOfYear);

  let currentDate = new Date(adjustedStart);
  let weekIndex = 0;
  const monthPositions = [];
  let lastMonth = -1;

  while (currentDate <= endDate || currentDate.getDay() !== 0) {
    const weekColumn = document.createElement('div');
    weekColumn.className = 'week-column';

    for (let day = 0; day < 7; day++) {
      const daySquare = document.createElement('div');
      daySquare.className = 'day-square';

      const dateStr = toDateString(currentDate);
      const isCurrentYear = currentDate.getFullYear() === YEAR;
      const isFuture = dateStr > todayStr;
      const revenueData = revenueByDate.get(dateStr);

      if (!isCurrentYear) {
        daySquare.style.visibility = 'hidden';
      } else {
        daySquare.dataset.date = dateStr;

        if (isFuture) {
          daySquare.classList.add('future');
          daySquare.dataset.level = '0';
        } else {
          const amount = revenueData ? revenueData.totalRevenue : 0;
          daySquare.dataset.level = getRevenueLevel(amount);
          daySquare.dataset.revenue = amount;

          // Add click handler
          daySquare.addEventListener('click', () => showDayDetails(dateStr, revenueData));

          // Add hover tooltip
          daySquare.addEventListener('mouseenter', (e) => showTooltip(e, dateStr, amount));
          daySquare.addEventListener('mouseleave', hideTooltip);
        }

        // Track month positions for labels
        const currentMonth = currentDate.getMonth();
        if (currentMonth !== lastMonth && day === 0) {
          monthPositions.push({ month: currentMonth, week: weekIndex });
          lastMonth = currentMonth;
        }
      }

      weekColumn.appendChild(daySquare);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    contributionGridEl.appendChild(weekColumn);
    weekIndex++;
  }

  // Generate month labels
  generateMonthLabels(monthPositions, weekIndex);
}

// Generate month labels above the grid
function generateMonthLabels(positions, totalWeeks) {
  monthsLabelsEl.innerHTML = '';

  const squareSize = 12;
  const gap = 3;
  const weekWidth = squareSize + gap;

  positions.forEach((pos, index) => {
    const label = document.createElement('span');
    label.className = 'month-label';
    label.textContent = MONTHS[pos.month];

    // Calculate width based on next month position or end
    const nextPos = positions[index + 1];
    const endWeek = nextPos ? nextPos.week : totalWeeks;
    const width = (endWeek - pos.week) * weekWidth;

    label.style.width = `${width}px`;
    monthsLabelsEl.appendChild(label);
  });
}

// Show tooltip on hover
let tooltipEl = null;

function showTooltip(event, dateStr, revenue) {
  hideTooltip();

  tooltipEl = document.createElement('div');
  tooltipEl.className = 'tooltip';
  tooltipEl.innerHTML = `
    <div class="tooltip-date">${formatDate(dateStr)}</div>
    <div class="tooltip-revenue">${formatCurrency(revenue)} revenue</div>
  `;

  document.body.appendChild(tooltipEl);

  const rect = event.target.getBoundingClientRect();
  tooltipEl.style.left = `${rect.left + rect.width / 2 - tooltipEl.offsetWidth / 2}px`;
  tooltipEl.style.top = `${rect.top - tooltipEl.offsetHeight - 8}px`;
}

function hideTooltip() {
  if (tooltipEl) {
    tooltipEl.remove();
    tooltipEl = null;
  }
}

// Format date for sharing (shorter format)
function formatDateShort(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

// Get day number of the year
function getDayOfYear(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

// Show day details panel
function showDayDetails(dateStr, revenueData) {
  // Store current data for sharing
  currentDayData = { dateStr, revenueData };

  // Remove selection from other squares
  document.querySelectorAll('.day-square.selected').forEach(el => {
    el.classList.remove('selected');
  });

  // Add selection to clicked square
  const clickedSquare = document.querySelector(`.day-square[data-date="${dateStr}"]`);
  if (clickedSquare) {
    clickedSquare.classList.add('selected');
  }

  // Update header
  detailsDateBadgeEl.textContent = `Day ${getDayOfYear(dateStr)}`;
  detailsDateEl.textContent = formatDate(dateStr);

  // Calculate progress percentage
  const totalRevenue = getTotalRevenue();
  const progressPercent = ((totalRevenue / OBJECTIVE) * 100).toFixed(1);

  if (revenueData && revenueData.totalRevenue > 0) {
    detailsRevenueEl.textContent = formatCurrency(revenueData.totalRevenue);
    detailsProgressTextEl.textContent = `${progressPercent}% of yearly goal (${formatCurrency(OBJECTIVE)})`;

    // Add composition title and items
    compositionEl.innerHTML = '<div class="composition-title">Breakdown</div>';
    revenueData.revenueComposition.forEach(item => {
      const itemEl = document.createElement('div');
      itemEl.className = 'composition-item';

      const nameContent = item.url
        ? `<a href="${item.url}" target="_blank" rel="noopener noreferrer">${item.name}</a>`
        : item.name;

      itemEl.innerHTML = `
        <span class="composition-item-name">${nameContent}</span>
        <span class="composition-item-revenue">${formatCurrency(item.revenue)}</span>
      `;
      compositionEl.appendChild(itemEl);
    });

    shareBtnEl.style.display = 'flex';
  } else {
    detailsRevenueEl.textContent = formatCurrency(0);
    detailsProgressTextEl.textContent = `${progressPercent}% of yearly goal (${formatCurrency(OBJECTIVE)})`;
    compositionEl.innerHTML = '<div class="composition-item">No revenue recorded for this day</div>';
    shareBtnEl.style.display = 'none';
  }

  dayDetailsEl.classList.remove('hidden');
}

// Close day details panel
closeDetailsBtn.addEventListener('click', () => {
  dayDetailsEl.classList.add('hidden');
  document.querySelectorAll('.day-square.selected').forEach(el => {
    el.classList.remove('selected');
  });
});

// Generate tweet text
function generateTweetText() {
  if (!currentDayData || !currentDayData.revenueData) return '';

  const { dateStr, revenueData } = currentDayData;
  const totalRevenue = getTotalRevenue();
  const progressPercent = ((totalRevenue / OBJECTIVE) * 100).toFixed(1);

  // Build breakdown text
  const breakdown = revenueData.revenueComposition
    .map(item => {
      const amount = formatCurrency(item.revenue);
      return item.url ? `- ${amount} with ${item.name} ${item.url}` : `- ${amount} with ${item.name}`;
    })
    .join('\n');

  return `On ${formatDateShort(dateStr)} I made ${formatCurrency(revenueData.totalRevenue)}, I'm now at ${progressPercent}% of my yearly goal of ${formatCurrency(OBJECTIVE)}

Breakdown:
${breakdown}

Follow my journey with my revenue tracker: ${window.location.href}`;
}

// Capture chart as image (includes header with stats)
async function captureChartImage() {
  const screenshotArea = document.getElementById('screenshot-area');
  const chartHint = document.getElementById('chart-hint');
  const chartFooterSeparator = document.querySelector('.chart-footer-separator');
  const downloadBtn = document.getElementById('download-chart-btn');
  const dayDetails = document.getElementById('day-details');
  const twitterLink = document.getElementById('twitter-link');
  const profilePic = document.getElementById('profile-pic');
  const twitterHandle = document.getElementById('twitter-handle');
  const yearProgressLabel = document.querySelector('.stat:nth-child(4) .stat-label');

  // Store original values to restore later
  const originalHandleText = twitterHandle ? twitterHandle.textContent : null;
  const originalYearLabel = yearProgressLabel ? yearProgressLabel.textContent : null;
  const originalPicSrc = profilePic ? profilePic.src : null;

  try {
    // Hide elements that shouldn't appear in screenshot
    if (chartHint) chartHint.style.display = 'none';
    if (chartFooterSeparator) chartFooterSeparator.style.display = 'none';
    if (downloadBtn) downloadBtn.style.display = 'none';
    if (dayDetails) dayDetails.style.display = 'none';
    // Hide profile pic AND remove src (CORS issues even when hidden)
    if (twitterLink) twitterLink.style.display = 'none';
    if (profilePic) profilePic.removeAttribute('src');
    // Replace X handle with full link
    if (twitterHandle) twitterHandle.textContent = `x.com/${TWITTER_HANDLE}`;
    // Make "Year Progress" fit on one line
    if (yearProgressLabel) yearProgressLabel.textContent = 'Year';

    const blob = await domtoimage.toBlob(screenshotArea, {
      bgcolor: '#0a0a0f',
      scale: 2,
      style: {
        'transform': 'scale(1)',
        'transform-origin': 'top left'
      }
    });

    // Restore hidden elements
    if (chartHint) chartHint.style.display = '';
    if (chartFooterSeparator) chartFooterSeparator.style.display = '';
    if (downloadBtn) downloadBtn.style.display = '';
    if (dayDetails) dayDetails.style.display = '';
    if (twitterLink) twitterLink.style.display = '';
    if (profilePic && originalPicSrc) profilePic.src = originalPicSrc;
    if (twitterHandle && originalHandleText) twitterHandle.textContent = originalHandleText;
    if (yearProgressLabel && originalYearLabel) yearProgressLabel.textContent = originalYearLabel;

    return blob;
  } catch (error) {
    console.error('Failed to capture chart:', error);
    // Restore hidden elements on error
    if (chartHint) chartHint.style.display = '';
    if (chartFooterSeparator) chartFooterSeparator.style.display = '';
    if (downloadBtn) downloadBtn.style.display = '';
    if (dayDetails) dayDetails.style.display = '';
    if (twitterLink) twitterLink.style.display = '';
    if (profilePic && originalPicSrc) profilePic.src = originalPicSrc;
    if (twitterHandle && originalHandleText) twitterHandle.textContent = originalHandleText;
    if (yearProgressLabel && originalYearLabel) yearProgressLabel.textContent = originalYearLabel;
    return null;
  }
}

// Share on X
shareBtnEl.addEventListener('click', async () => {
  if (!currentDayData || !currentDayData.revenueData) return;

  const tweetText = generateTweetText();

  // Try to capture chart image
  shareBtnEl.disabled = true;
  shareBtnEl.innerHTML = `
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" class="spin">
      <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" opacity=".3"/>
      <path d="M20 12h2A10 10 0 0 0 12 2v2a8 8 0 0 1 8 8z"/>
    </svg>
    Generating...
  `;

  const imageBlob = await captureChartImage();

  // Check if Web Share API with files is supported
  const canShareFiles = navigator.canShare && navigator.canShare({
    files: [new File([new Blob()], 'test.png', { type: 'image/png' })]
  });

  if (imageBlob && canShareFiles) {
    // Use Web Share API with image
    const file = new File([imageBlob], 'revenue-chart.png', { type: 'image/png' });

    try {
      await navigator.share({
        text: tweetText,
        files: [file]
      });
    } catch (err) {
      if (err.name !== 'AbortError') {
        // Fallback to Twitter intent without image
        openTwitterIntent(tweetText);
      }
    }
  } else if (imageBlob) {
    // Download image and open Twitter intent
    downloadImage(imageBlob, `revenue-chart-${currentDayData.dateStr}.png`);
    // Small delay to let user see the download, then open Twitter
    setTimeout(() => {
      openTwitterIntent(tweetText + '\n\n(Chart image downloaded - attach it to your tweet!)');
    }, 500);
  } else {
    // No image, just open Twitter intent
    openTwitterIntent(tweetText);
  }

  // Reset button
  shareBtnEl.disabled = false;
  shareBtnEl.innerHTML = `
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
    Share on X
  `;
});

// Open Twitter intent
function openTwitterIntent(text) {
  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
  window.open(tweetUrl, '_blank', 'width=550,height=520');
}

// Download image
function downloadImage(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || `revenue-chart-${currentDayData?.dateStr || 'export'}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Download chart button
const downloadChartBtn = document.getElementById('download-chart-btn');
downloadChartBtn.addEventListener('click', async () => {
  const originalText = downloadChartBtn.textContent;
  downloadChartBtn.textContent = 'Generating...';
  downloadChartBtn.disabled = true;

  const imageBlob = await captureChartImage();

  if (imageBlob) {
    const today = toDateString(new Date());
    downloadImage(imageBlob, `revenue-tracker-${today}.png`);
  }

  downloadChartBtn.textContent = originalText;
  downloadChartBtn.disabled = false;
});

// Setup Twitter profile
function setupTwitterProfile() {
  // Use unavatar.io to get the Twitter profile picture
  const profilePicUrl = `https://unavatar.io/twitter/${TWITTER_HANDLE}`;
  profilePicEl.src = profilePicUrl;
  profilePicEl.alt = `@${TWITTER_HANDLE}`;

  // Set link to Twitter profile
  const twitterUrl = `https://x.com/${TWITTER_HANDLE}`;
  twitterLinkEl.href = twitterUrl;
  twitterLinkEl.title = `@${TWITTER_HANDLE} on X`;

  // Set the handle link
  twitterHandleEl.href = twitterUrl;
  twitterHandleEl.textContent = `@${TWITTER_HANDLE}`;
}

// Show yesterday's data by default if available
function showYesterdayByDefault() {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = toDateString(yesterday);

  // Check if yesterday is in the current year
  if (yesterday.getFullYear() !== YEAR) return;

  // Check if we have revenue data for yesterday
  const yesterdayData = revenueByDate.get(yesterdayStr);
  if (yesterdayData && yesterdayData.totalRevenue > 0) {
    showDayDetails(yesterdayStr, yesterdayData);
  }
}

// Initialize the app
function init() {
  setupTwitterProfile();
  updateStats();
  generateGrid();
  showYesterdayByDefault();
}

// Run on DOM ready
init();
