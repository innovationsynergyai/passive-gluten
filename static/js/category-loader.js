// Category loader
document.addEventListener('DOMContentLoaded', function() {
    loadCategoryContent();
    loadPopularPosts();
});

// Load category content
function loadCategoryContent() {
    // Get category from URL
    const category = getCategoryFromUrl();
    
    if (!category) {
        showError('Category not found');
        return;
    }
    
    // Update category title and description
    updateCategoryHeader(category);
    
    // Load articles in this category
    fetch('/content/article_index.json')
        .then(response => response.json())
        .then(data => {
            // Filter articles by category
            const categoryArticles = data.articles.filter(article => 
                article.category.toLowerCase() === category.toLowerCase()
            );
            
            if (categoryArticles.length === 0) {
                showEmptyCategory();
                return;
            }
            
            const container = document.getElementById('category-articles');
            
            if (container) {
                categoryArticles.forEach(article => {
                    // Create article card
                    const card = createArticleCard(article);
                    container.appendChild(card);
                });
            }
            
            // Update page metadata
            updatePageMetadata(category, categoryArticles.length);
        })
        .catch(error => {
            console.error('Error loading category:', error);
            showError('Error loading category');
        });
}

// Load popular posts for sidebar
function loadPopularPosts() {
    fetch('/content/article_index.json')
        .then(response => response.json())
        .then(data => {
            const popularPosts = data.articles.slice(0, 5);
            const container = document.getElementById('popular-posts');
            
            if (container) {
                popularPosts.forEach(article => {
                    // Create list item
                    const li = document.createElement('li');
                    const link = document.createElement('a');
                    
                    // Create slug from title
                    const slug = createSlug(article.title);
                    
                    link.href = `/article/${slug}/`;
                    link.textContent = article.title;
                    
                    li.appendChild(link);
                    container.appendChild(li);
                });
            }
        })
        .catch(error => console.error('Error loading popular posts:', error));
}

// Update category header
function updateCategoryHeader(category) {
    const titleElement = document.getElementById('category-title');
    const descElement = document.getElementById('category-description');
    
    if (titleElement) {
        titleElement.textContent = formatCategoryName(category);
    }
    
    if (descElement) {
        descElement.textContent = getCategoryDescription(category);
    }
}

// Format category name
function formatCategoryName(category) {
    return category.charAt(0).toUpperCase() + category.slice(1);
}

// Get category description
function getCategoryDescription(category) {
    const descriptions = {
        'health': 'Expert information on celiac disease, gluten sensitivity, and gluten-free health topics.',
        'lifestyle': 'Tips and advice for living a gluten-free lifestyle in various situations and environments.',
        'recipes': 'Delicious gluten-free recipes, meal plans, and cooking tips for every occasion.',
        'products': 'Reviews and information about gluten-free products, brands, and certifications.',
        'research': 'Latest research and scientific findings related to celiac disease and gluten sensitivity.'
    };
    
    return descriptions[category.toLowerCase()] || 'Browse articles in this category.';
}

// Create article card element
function createArticleCard(article) {
    const card = document.createElement('div');
    card.className = 'article-card';
    
    // Create slug from title
    const slug = createSlug(article.title);
    
    // Create card content
    card.innerHTML = `
        <div class="article-card-content">
            <h4><a href="/article/${slug}/">${article.title}</a></h4>
            <p>${getArticleExcerpt(article)}</p>
            <div class="article-meta">
                <span>${article.category}</span>
                <span>${article.date}</span>
            </div>
        </div>
    `;
    
    return card;
}

// Get article excerpt
function getArticleExcerpt(article) {
    // Extract first paragraph or create summary
    const content = article.content || '';
    const match = content.match(/<p>(.*?)<\/p>/);
    let excerpt = match ? match[1] : 'Learn about gluten-free living and celiac disease management.';
    
    // Truncate if needed
    if (excerpt.length > 120) {
        excerpt = excerpt.substring(0, 117) + '...';
    }
    
    return excerpt;
}

// Update page metadata
function updatePageMetadata(category, articleCount) {
    // Update title
    document.title = `${formatCategoryName(category)} - Gluten-Free Resources | WeHateGluten`;
    
    // Update description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
        metaDesc.setAttribute('content', getCategoryDescription(category));
    }
    
    // Update data attributes for SEO
    const body = document.body;
    if (body) {
        body.setAttribute('data-page-type', 'category');
        body.setAttribute('data-page-info', JSON.stringify({
            category: formatCategoryName(category),
            description: getCategoryDescription(category),
            articleCount: articleCount
        }));
    }
}

// Show empty category message
function showEmptyCategory() {
    const container = document.getElementById('category-articles');
    
    if (container) {
        container.innerHTML = `
            <div class="empty-category">
                <p>No articles found in this category yet.</p>
                <p>Check back soon for new content!</p>
            </div>
        `;
    }
}

// Show error message
function showError(message) {
    const container = document.getElementById('category-articles');
    
    if (container) {
        container.innerHTML = `
            <div class="error-message">
                <h2>Error</h2>
                <p>${message}</p>
                <p><a href="/">Return to homepage</a></p>
            </div>
        `;
    }
}

// Get category from URL
function getCategoryFromUrl() {
    const path = window.location.pathname;
    const match = path.match(/\/category\/([^\/]+)/);
    return match ? match[1] : null;
}

// Create slug from title
function createSlug(title) {
    return title.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}