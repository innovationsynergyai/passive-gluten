
// Auto-generated AdSense configuration
const adSenseConfig = {
    enabled: true,
    adClient: "ca-pub-XXXXXXXXXXXXXXXX",  // Replace with your actual AdSense Publisher ID
    autoAds: true,
    
    // Responsive ad units
    adUnits: {
        headerLeaderboard: {
            adSlot: "XXXXXXXXXX",  // Replace with actual ad slot ID
            format: "horizontal",
            responsive: true
        },
        sidebarRectangle: {
            adSlot: "XXXXXXXXXX",  // Replace with actual ad slot ID
            format: "rectangle",
            responsive: true
        },
        inContentRectangle: {
            adSlot: "XXXXXXXXXX",  // Replace with actual ad slot ID
            format: "rectangle",
            responsive: true
        },
        footerLeaderboard: {
            adSlot: "XXXXXXXXXX",  // Replace with actual ad slot ID
            format: "horizontal",
            responsive: true
        },
        stickyBottomBanner: {
            adSlot: "XXXXXXXXXX",  // Replace with actual ad slot ID
            format: "horizontal",
            responsive: true
        }
    },
    
    // Content injection settings
    contentInjection: {
        paragraphInterval: 3,
        minParagraphsBeforeFirstAd: 2,
        maxAdsPerArticle: 3
    },
    
    // High-value keywords for targeting
    highValueKeywords: [
        "celiac disease treatment",
        "gluten intolerance testing",
        "gluten-free health insurance",
        "celiac disease specialist",
        "gluten sensitivity doctor",
        "celiac disease medication",
        "gluten-free medical diet",
        "celiac disease symptoms",
        "gluten allergy treatment",
        "gluten-free health supplements"
    ]
};

// Initialize AdSense
function initializeAdSense() {
    // Add auto ads if enabled
    if (adSenseConfig.autoAds) {
        document.head.insertAdjacentHTML('beforeend', `
            <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adSenseConfig.adClient}"
                crossorigin="anonymous"></script>
            <script>
                (adsbygoogle = window.adsbygoogle || []).push({});
            </script>
        `);
    }
    
    // Insert in-content ads for articles
    if (document.querySelector('.article-content')) {
        insertInContentAds();
    }
    
    // Show/hide sticky bottom banner based on scroll position
    window.addEventListener('scroll', handleStickyAdVisibility);
}

// Insert ads within article content
function insertInContentAds() {
    const content = document.querySelector('.article-content');
    if (!content) return;
    
    const paragraphs = content.querySelectorAll('p, h2, h3');
    if (paragraphs.length < adSenseConfig.contentInjection.minParagraphsBeforeFirstAd) return;
    
    let adCount = 0;
    const maxAds = adSenseConfig.contentInjection.maxAdsPerArticle;
    const interval = adSenseConfig.contentInjection.paragraphInterval;
    
    for (let i = adSenseConfig.contentInjection.minParagraphsBeforeFirstAd; i < paragraphs.length; i += interval) {
        if (adCount >= maxAds) break;
        
        const adElement = document.createElement('div');
        adElement.className = 'ad-container ad-in-content';
        adElement.innerHTML = `
            <div class="ad-label">Advertisement</div>
            <ins class="adsbygoogle"
                style="display:block"
                data-ad-client="${adSenseConfig.adClient}"
                data-ad-slot="${adSenseConfig.adUnits.inContentRectangle.adSlot}"
                data-ad-format="auto"
                data-full-width-responsive="true"></ins>
        `;
        
        paragraphs[i].after(adElement);
        (adsbygoogle = window.adsbygoogle || []).push({});
        adCount++;
    }
}

// Handle sticky ad visibility
function handleStickyAdVisibility() {
    const stickyAd = document.querySelector('.ad-sticky-bottom');
    if (!stickyAd) return;
    
    // Show sticky ad only after scrolling down 30% of the page
    const scrollPosition = window.scrollY;
    const pageHeight = document.body.scrollHeight;
    const viewportHeight = window.innerHeight;
    
    if (scrollPosition > (pageHeight - viewportHeight) * 0.3) {
        stickyAd.style.display = 'block';
    } else {
        stickyAd.style.display = 'none';
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeAdSense);
