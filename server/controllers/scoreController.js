const Score = require('../models/score');

const scoreController = {
  // Méthode pour mettre à jour le score
  updateScore: async (req, res) => {
    try {
      // Extraire l'identifiant du score à mettre à jour et le nouveau score depuis la requête
      const { scoreId, newScore } = req.body;

      // Recherche du score dans la base de données par son identifiant
      const scoreToUpdate = await Score.findById(scoreId);

      // Vérifier si le score existe
      if (!scoreToUpdate) {
        return res.status(404).json({ error: 'Score non trouvé' });
      }

      // Mettre à jour le score avec la nouvelle valeur
      scoreToUpdate.score = newScore;

      // Enregistrer les modifications dans la base de données
      await scoreToUpdate.save();

      // Renvoyer la réponse avec le score mis à jour
      res.status(200).json(scoreToUpdate);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du score :', error);
      res.status(500).json({ error: 'Erreur serveur lors de la mise à jour du score' });
    }
  },

  // Méthode pour récupérer le score de l'utilisateur
  getScore: async (req, res) => {
    try {
      // Vous devez implémenter la logique pour récupérer le score de l'utilisateur à partir de la base de données
      // Par exemple :
      const userId = req.userId; // Supposons que vous avez l'ID de l'utilisateur dans la requête (par exemple, via l'authentification)
      const userScore = await Score.findOne({ userId });

      if (!userScore) {
        return res.status(404).json({ error: 'Score non trouvé pour cet utilisateur' });
      }

      // Ensuite, renvoyez le score dans la réponse
      res.status(200).json({ score: userScore.score });
    } catch (error) {
      console.error('Erreur lors de la récupération du score :', error);
      res.status(500).json({ error: 'Erreur serveur lors de la récupération du score' });
    }
  }
};

module.exports = scoreController;
