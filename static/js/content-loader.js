// Content loader for homepage
document.addEventListener('DOMContentLoaded', function() {
    loadFeaturedArticles();
    loadRecentArticles();
    loadPopularPosts();
});

// Load featured articles
function loadFeaturedArticles() {
    fetch('/content/article_index.json')
        .then(response => response.json())
        .then(data => {
            const featuredArticles = data.articles.slice(0, 3);
            const container = document.getElementById('featured-articles');
            
            if (container) {
                featuredArticles.forEach(article => {
                    // Create article card
                    const card = createArticleCard(article);
                    container.appendChild(card);
                });
            }
        })
        .catch(error => console.error('Error loading featured articles:', error));
}

// Load recent articles
function loadRecentArticles() {
    fetch('/content/article_index.json')
        .then(response => response.json())
        .then(data => {
            const recentArticles = data.articles.slice(3, 9);
            const container = document.getElementById('recent-articles');
            
            if (container) {
                recentArticles.forEach(article => {
                    // Create article card
                    const card = createArticleCard(article);
                    container.appendChild(card);
                });
            }
        })
        .catch(error => console.error('Error loading recent articles:', error));
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

// Create slug from title
function createSlug(title) {
    return title.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}