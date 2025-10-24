// Article loader
document.addEventListener('DOMContentLoaded', function() {
    loadArticleContent();
    loadRelatedPosts();
});

// Load article content
function loadArticleContent() {
    // Get article slug from URL
    const slug = getSlugFromUrl();
    
    if (!slug) {
        showError('Article not found');
        return;
    }
    
    // First load article index to find the right article
    fetch('/content/article_index.json')
        .then(response => response.json())
        .then(data => {
            // Find article with matching slug
            const article = findArticleBySlug(data.articles, slug);
            
            if (!article) {
                showError('Article not found');
                return;
            }
            
            // Load the specific article file
            const category = article.category || 'health';
            const articleFile = `/content/${category}_${createSlug(article.title)}.json`;
            
            return fetch(articleFile)
                .then(response => response.json())
                .then(articleData => {
                    displayArticle(articleData);
                    
                    // Update page metadata
                    updatePageMetadata(articleData);
                });
        })
        .catch(error => {
            console.error('Error loading article:', error);
            showError('Error loading article');
        });
}

// Load related posts
function loadRelatedPosts() {
    // Get article slug from URL
    const slug = getSlugFromUrl();
    
    fetch('/content/article_index.json')
        .then(response => response.json())
        .then(data => {
            // Find current article
            const currentArticle = findArticleBySlug(data.articles, slug);
            
            if (!currentArticle) return;
            
            // Find articles in the same category
            const relatedArticles = data.articles
                .filter(article => article.category === currentArticle.category)
                .filter(article => createSlug(article.title) !== slug)
                .slice(0, 5);
            
            const container = document.getElementById('related-posts');
            
            if (container) {
                relatedArticles.forEach(article => {
                    // Create list item
                    const li = document.createElement('li');
                    const link = document.createElement('a');
                    
                    // Create slug from title
                    const articleSlug = createSlug(article.title);
                    
                    link.href = `/article/${articleSlug}/`;
                    link.textContent = article.title;
                    
                    li.appendChild(link);
                    container.appendChild(li);
                });
            }
        })
        .catch(error => console.error('Error loading related posts:', error));
}

// Display article content
function displayArticle(article) {
    const container = document.getElementById('article-content');
    
    if (!container) return;
    
    // Set article content
    container.innerHTML = article.content;
    
    // Add metadata if needed
    const metaDiv = document.createElement('div');
    metaDiv.className = 'article-meta';
    metaDiv.innerHTML = `
        <p>Published on ${article.date}</p>
        <p>Category: ${article.category}</p>
    `;
    
    // Insert meta info after the first heading
    const firstHeading = container.querySelector('h1, h2');
    if (firstHeading) {
        firstHeading.after(metaDiv);
    } else {
        container.prepend(metaDiv);
    }
}

// Update page metadata
function updatePageMetadata(article) {
    // Update title
    document.title = `${article.title} - WeHateGluten`;
    
    // Update description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
        // Extract first paragraph for description
        const content = article.content || '';
        const match = content.match(/<p>(.*?)<\/p>/);
        let excerpt = match ? match[1] : 'Learn about gluten-free living and celiac disease management.';
        
        // Truncate if needed
        if (excerpt.length > 150) {
            excerpt = excerpt.substring(0, 147) + '...';
        }
        
        metaDesc.setAttribute('content', excerpt);
    }
    
    // Update data attributes for SEO
    const body = document.body;
    if (body) {
        body.setAttribute('data-page-type', 'article');
        body.setAttribute('data-page-info', JSON.stringify({
            title: article.title,
            category: article.category,
            description: article.content ? article.content.substring(0, 150) + '...' : '',
            date: article.date,
            updated: article.updated || article.date
        }));
    }
}

// Get slug from URL
function getSlugFromUrl() {
    const path = window.location.pathname;
    const match = path.match(/\/article\/([^\/]+)/);
    return match ? match[1] : null;
}

// Find article by slug
function findArticleBySlug(articles, targetSlug) {
    return articles.find(article => createSlug(article.title) === targetSlug);
}

// Create slug from title
function createSlug(title) {
    return title.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

// Show error message
function showError(message) {
    const container = document.getElementById('article-content');
    
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