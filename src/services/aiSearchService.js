class AISearchService {
  constructor() {
    this.searchIndex = null;
    this.contentCache = new Map();
  }

  // Initialize search index
  async initializeSearchIndex(contentData) {
    try {
      this.searchIndex = this.buildSearchIndex(contentData);
      console.log('AI Search Index initialized');
    } catch (error) {
      console.error('Failed to initialize search index:', error);
    }
  }

  // Build index for semantic search
  buildSearchIndex(contentData) {
    const index = {
      documents: [],
      terms: new Map()
    };

    contentData.forEach((doc, docId) => {
      const processedDoc = this.processDocument(doc, doc.id || docId);
      index.documents.push(processedDoc);
      this.indexDocumentTerms(processedDoc, index.terms);
    });

    return index;
  }

  // Process document and extract keywords
  processDocument(doc, id) {
    // Combine relevant fields for indexing
    const text = `${doc.title || ''} ${doc.content || doc.description || ''} ${doc.tags?.join(' ') || ''}`;
    const words = this.tokenize(text);
    const wordFrequency = this.calculateWordFrequency(words);
    
    return {
      id,
      title: doc.title,
      content: doc.content || doc.description,
      type: doc.type || 'general',
      tags: doc.tags || [],
      wordFrequency,
      vector: this.createVector(wordFrequency)
    };
  }

  // Tokenize text
  tokenize(text) {
    if (!text) return [];
    return text.toLowerCase()
      .replace(/[^\w\s\u0600-\u06FF]/g, '') // Keep Arabic and alphanumeric
      .split(/\s+/)
      .filter(word => word.length > 2); // Filter short words
  }

  // Calculate word frequency
  calculateWordFrequency(words) {
    const frequency = {};
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });
    return frequency;
  }

  // Create vector from frequency map
  createVector(wordFrequency) {
    const vector = {};
    const totalWords = Object.values(wordFrequency).reduce((a, b) => a + b, 0);
    Object.keys(wordFrequency).forEach(word => {
      vector[word] = wordFrequency[word] / totalWords;
    });
    return vector;
  }

  // Index terms mapping
  indexDocumentTerms(document, termsMap) {
    Object.keys(document.wordFrequency).forEach(term => {
      if (!termsMap.has(term)) {
        termsMap.set(term, []);
      }
      termsMap.get(term).push({
        docId: document.id,
        frequency: document.wordFrequency[term]
      });
    });
  }

  // Perform search
  async search(query, options = {}) {
    try {
      if (!this.searchIndex) {
        // Fallback or empty if not initialized
        console.warn('Search index not initialized');
        return { query, results: [], total: 0 };
      }

      const processedQuery = this.processQuery(query);
      const results = this.performSemanticSearch(processedQuery, options);
      
      return {
        query,
        results: results.slice(0, options.limit || 10),
        total: results.length,
        took: Date.now()
      };
    } catch (error) {
      console.error('Search failed:', error);
      return { query, results: [], total: 0, error: error.message };
    }
  }

  // Process search query
  processQuery(query) {
    const words = this.tokenize(query);
    const wordFrequency = this.calculateWordFrequency(words);
    return {
      text: query,
      words,
      wordFrequency,
      vector: this.createVector(wordFrequency)
    };
  }

  // Execute semantic search logic
  performSemanticSearch(query, options) {
    const scores = new Map();

    // Keyword matching
    query.words.forEach(word => {
      const termDocs = this.searchIndex.terms.get(word) || [];
      termDocs.forEach(docInfo => {
        const currentScore = scores.get(docInfo.docId) || 0;
        // Simple term frequency scoring
        scores.set(docInfo.docId, currentScore + docInfo.frequency);
      });
    });

    // Cosine Similarity check for vector space model
    this.searchIndex.documents.forEach(doc => {
      const similarity = this.cosineSimilarity(query.vector, doc.vector);
      if (similarity > 0.05) { // Threshold
        const currentScore = scores.get(doc.id) || 0;
        // Combine TF score with Cosine Similarity
        scores.set(doc.id, currentScore + (similarity * 10)); 
      }
    });

    // Format and sort results
    const results = Array.from(scores.entries())
      .map(([docId, score]) => {
        const doc = this.searchIndex.documents.find(d => d.id === docId);
        if (!doc) return null;
        return {
          ...doc,
          score: Math.round(score * 100) / 100,
          excerpt: options.includeExcerpts ? this.generateExcerpt(doc.content, query.words) : ''
        };
      })
      .filter(item => item !== null)
      .sort((a, b) => b.score - a.score);

    return results;
  }

  // Calculate cosine similarity between two vectors
  cosineSimilarity(vecA, vecB) {
    const intersection = Object.keys(vecA).filter(key => vecB.hasOwnProperty(key));
    const dotProduct = intersection.reduce((sum, key) => sum + vecA[key] * vecB[key], 0);
    
    const magnitudeA = Math.sqrt(Object.values(vecA).reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(Object.values(vecB).reduce((sum, val) => sum + val * val, 0));
    
    return (magnitudeA && magnitudeB) ? dotProduct / (magnitudeA * magnitudeB) : 0;
  }

  // Generate text excerpt highlighting keywords
  generateExcerpt(content, keywords, maxLength = 150) {
    if (!content) return '';

    const lowerContent = content.toLowerCase();
    let bestMatchIndex = 0;
    
    // Find first occurrence of any keyword
    for (const keyword of keywords) {
      const index = lowerContent.indexOf(keyword);
      if (index !== -1) {
        bestMatchIndex = index;
        break;
      }
    }

    const start = Math.max(0, bestMatchIndex - 50);
    const end = Math.min(content.length, bestMatchIndex + maxLength);
    let excerpt = content.substring(start, end);
    
    if (start > 0) excerpt = '...' + excerpt;
    if (end < content.length) excerpt = excerpt + '...';
    
    return excerpt;
  }

  // Add new content dynamically
  async addContent(contentItem) {
    if (!this.searchIndex) return;

    const processedDoc = this.processDocument(contentItem, contentItem.id);
    this.searchIndex.documents.push(processedDoc);
    this.indexDocumentTerms(processedDoc, this.searchIndex.terms);
  }

  getSearchStats() {
    return {
      totalDocuments: this.searchIndex?.documents.length || 0,
      totalTerms: this.searchIndex?.terms.size || 0,
      indexedTypes: [...new Set(this.searchIndex?.documents.map(doc => doc.type) || [])]
    };
  }
}

export default new AISearchService();