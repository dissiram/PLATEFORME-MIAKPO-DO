import MatchingEngine from './MatchingEngine.js';
import NodeCache from 'node-cache';

class MatchingService {
  constructor() {
    this.engine = new MatchingEngine();
    this.cache = new NodeCache({ 
      stdTTL: 300,
      checkperiod: 60 
    });
  }

  async getMatches(resumeId, options = {}) {
    const cacheKey = this.generateCacheKey(resumeId, options);
    
    try {
      const cachedResult = this.cache.get(cacheKey);
      if (cachedResult) {
        console.log('📦 Serving from cache for resume:', resumeId);
        return cachedResult;
      }

      console.log('⚡ Calculating fresh matches for resume:', resumeId);
      const matches = await this.engine.matchResumeToOffers(resumeId, options);
      
      this.cache.set(cacheKey, matches);
      return matches;

    } catch (error) {
      console.error('❌ Error in getMatches:', error);
      throw error;
    }
  }

  generateCacheKey(resumeId, options) {
    const optionsStr = JSON.stringify(options);
    return `matches:${resumeId}:${optionsStr}`;
  }

  clearCache() {
    this.cache.flushAll();
    console.log('🗑️ All cache cleared');
  }

  clearCacheForResume(resumeId) {
    const keys = this.cache.keys();
    const resumeKeys = keys.filter(key => key.includes(`:${resumeId}:`));
    
    resumeKeys.forEach(key => this.cache.del(key));
    console.log(`🗑️ Cache cleared for resume: ${resumeId}`);
  }

  getCacheStats() {
    return {
      keys: this.cache.keys().length,
      hits: this.cache.getStats().hits,
      misses: this.cache.getStats().misses,
      keysize: this.cache.getStats().ksize
    };
  }
}

// Export ES6
export default new MatchingService();