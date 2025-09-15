// routes/admin.js
import express from 'express';
import User from '../models/User.js';
import Offer from '../models/Offer.js';

const router = express.Router();

// Middleware d'authentification admin (simplifié)
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  return res.status(403).json({ message: 'Accès interdit' });
};

// GET /api/admin/dashboard
router.get('/admin', isAdmin, async (req, res) => {
  try {
    const users = await User.find();
    const offers = await Offer.find();

    const stats = {
      totalUsers: users.length,
      totalOffers: offers.length,
      pendingOffers: offers.filter(o => o.status === 'pending').length,
      activeUsers: users.filter(u => u.status === 'active').length,
      monthlyGrowth: 12.5, // calcul réel selon ton modèle
      revenueGrowth: 8.3   // calcul réel selon ton modèle
    };

    res.json({ users, offers, stats });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

export default router;
