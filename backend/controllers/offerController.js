// controllers/offerController.js
import Offer from "../models/Offer.js";

// Créer une offre
export async function createOffer(req, res) {
  try {
    const offer = await Offer.create({
      ...req.body,
      recruiterId: req.user.id,
    });
    res.status(201).json(offer);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
}

// Récupérer toutes les offres (avec filtres / pagination)
export async function getOffers(req, res) {
  try {
    const { location, skill, q, page = 1, limit = 10 } = req.query;
    const filters = {};
    if (location) filters.location = location;
    if (skill) filters.skillsRequired = { $in: [skill] };
    if (q) filters.$text = { $search: q };

    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Offer.find(filters).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Offer.countDocuments(filters)
    ]);

    res.json({
      items,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit))
    });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
}

// Récupérer une offre par ID
export async function getOfferById(req, res) {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) return res.status(404).json({ error: "Offre introuvable" });
    res.json(offer);
  } catch {
    res.status(500).json({ error: "Erreur serveur" });
  }
}

// Mettre à jour une offre
export async function updateOffer(req, res) {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) return res.status(404).json({ error: "Offre introuvable" });

    if (req.user.role !== "admin" && String(offer.recruiterId) !== req.user.id) {
      return res.status(403).json({ error: "Accès interdit" });
    }

    Object.assign(offer, req.body);
    await offer.save();
    res.json(offer);
  } catch {
    res.status(500).json({ error: "Erreur serveur" });
  }
}

// Supprimer une offre
export async function deleteOffer(req, res) {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) return res.status(404).json({ error: "Offre introuvable" });

    if (req.user.role !== "admin" && String(offer.recruiterId) !== req.user.id) {
      return res.status(403).json({ error: "Accès interdit" });
    }

    await offer.deleteOne();
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "Erreur serveur" });
  }
}
