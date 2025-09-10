import express from 'express';
import mongoose from 'mongoose';
import MatchingService from '../services/matching/MatchingService.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

// GET /api/match/offers/:resumeId
router.get('/offers/:resumeId', auth, async (req, res) => {
  try {
    const { resumeId } = req.params;
    const { 
      page = 1, 
      limit = 10, 
      minScore = 65,
      skills,
      location,
      remote,
      category 
    } = req.query;

    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
      return res.status(400).json({
        success: false,
        error: 'ID de CV invalide'
      });
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      minScore: parseInt(minScore),
      skills: skills ? skills.split(',') : [],
      location: location || '',
      remote: remote === 'true',
      category: category || ''
    };

    console.log(`📊 Matching request for resume: ${resumeId}`, options);

    const matches = await MatchingService.getMatches(resumeId, options);
    
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedMatches = matches.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        matches: paginatedMatches,
        pagination: {
          current: parseInt(page),
          totalPages: Math.ceil(matches.length / limit),
          totalMatches: matches.length,
          hasNext: endIndex < matches.length,
          hasPrev: startIndex > 0
        },
        statistics: {
          averageScore: matches.length > 0 ? 
            Math.round(matches.reduce((sum, match) => sum + match.score, 0) / matches.length) : 0,
          topScore: matches.length > 0 ? Math.max(...matches.map(m => m.score)) : 0,
          matchDistribution: getMatchDistribution(matches)
        }
      }
    });

  } catch (error) {
    console.error('❌ Error in matching route:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Erreur lors du calcul des correspondances'
    });
  }
});

// GET /api/match/stats/:resumeId
router.get('/stats/:resumeId', auth, async (req, res) => {
  try {
    const { resumeId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
      return res.status(400).json({
        success: false,
        error: 'ID de CV invalide'
      });
    }

    const matches = await MatchingService.getMatches(resumeId, { limit: 1000 });
    
    const stats = {
      totalOffers: matches.length,
      averageMatchScore: matches.length > 0 ? 
        Math.round(matches.reduce((sum, match) => sum + match.score, 0) / matches.length) : 0,
      excellentMatches: matches.filter(m => m.score >= 90).length,
      goodMatches: matches.filter(m => m.score >= 70 && m.score < 90).length,
      fairMatches: matches.filter(m => m.score >= 50 && m.score < 70).length,
      topSkills: extractTopSkills(matches),
      topCompanies: extractTopCompanies(matches),
      categories: extractCategories(matches)
    };

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('❌ Error in stats route:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Fonctions utilitaires
function getMatchDistribution(matches) {
  return {
    excellent: matches.filter(m => m.score >= 90).length,
    good: matches.filter(m => m.score >= 70 && m.score < 90).length,
    fair: matches.filter(m => m.score >= 50 && m.score < 70).length,
    poor: matches.filter(m => m.score < 50).length
  };
}

function extractTopSkills(matches, limit = 5) {
  const skillCount = {};
  
  matches.forEach(match => {
    if (match.offer.skills) {
      const skills = match.offer.skills.split(',').map(s => s.trim());
      skills.forEach(skill => {
        skillCount[skill] = (skillCount[skill] || 0) + 1;
      });
    }
  });
  
  return Object.entries(skillCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, limit)
    .map(([skill, count]) => ({ skill, count }));
}

function extractTopCompanies(matches, limit = 5) {
  const companyCount = {};
  
  matches.forEach(match => {
    if (match.offer.company) {
      companyCount[match.offer.company] = (companyCount[match.offer.company] || 0) + 1;
    }
  });
  
  return Object.entries(companyCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, limit)
    .map(([company, count]) => ({ company, count }));
}

function extractCategories(matches) {
  const categoryCount = {};
  
  matches.forEach(match => {
    if (match.offer.category) {
      categoryCount[match.offer.category] = (categoryCount[match.offer.category] || 0) + 1;
    }
  });
  
  return categoryCount;
}

export default router;