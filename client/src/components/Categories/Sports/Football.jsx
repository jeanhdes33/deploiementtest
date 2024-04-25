import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Football() {
  const initialScore = parseInt(localStorage.getItem('score')) || 0; // Récupérer le score initial depuis le local storage
  const [question, setQuestion] = useState(null);
  const [quizComplete, setQuizComplete] = useState(false);
  const [score, setScore] = useState(initialScore); // Utiliser le score initial récupéré du local storage
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [questionCount, setQuestionCount] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [disableButtons, setDisableButtons] = useState(false); // Ajouter un état pour désactiver les boutons de réponse

  useEffect(() => {
    fetchFootballQuestion();
  }, []);

  useEffect(() => {
    let timer;
    if (timeLeft > 0 && !quizComplete) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && !answered) {
      handleAnswerButtonClick(-1); // Si le temps est écoulé et que l'utilisateur n'a pas répondu, réduire le score de 1 point
    }
    return () => clearTimeout(timer);
  }, [timeLeft, quizComplete, answered]);

  const fetchFootballQuestion = async () => {
    try {
      const response = await axios.get('http://localhost:8000/questions/football/random');
      setQuestion(response.data);
      setTimeLeft(10);
      setAnswered(false); // Réinitialiser l'état de réponse à chaque nouvelle question
      setDisableButtons(false); // Activer les boutons de réponse à chaque nouvelle question
    } catch (error) {
      console.error('Erreur lors de la récupération de la question de football :', error);
    }
  };

  const handleAnswerButtonClick = (selectedOptionIndex) => {
    const isCorrect = selectedOptionIndex === question.correctOptionIndex;
    let updatedScore = score;
    if (isCorrect) {
      updatedScore += 5 + timeLeft; // Ajouter 5 points et le temps restant en points pour une réponse correcte
      setCorrectAnswers(correctAnswers + 1);
    } else if (selectedOptionIndex !== -1) { // Ne réduire le score que si l'utilisateur a répondu
      updatedScore -= 5; // Soustraire 5 points pour une mauvaise réponse
    } else {
      updatedScore -= 10; // Soustraire 10 points si le temps est écoulé
    }
    setScore(updatedScore);
    setAnswered(true); // Marquer la question comme répondue
    setDisableButtons(true); // Désactiver les boutons de réponse pendant le délai de passage à la prochaine question
    localStorage.setItem('score', updatedScore); // Stocker le score mis à jour dans le local storage

    setTimeout(() => {
      if (questionCount < 4) { // Arrêter le quiz après 5 questions
        fetchFootballQuestion(); // Charger une nouvelle question après avoir répondu
        setQuestionCount(questionCount + 1);
        setDisableButtons(false); // Activer à nouveau les boutons de réponse
      } else {
        console.log('Score final :', score);
        setQuizComplete(true); // Marquer le quiz comme terminé après la dernière question
      }
    }, 2000); // Délai avant de passer à la prochaine question
  };

  if (quizComplete) {
    const totalQuestions = 5; // Nombre total de questions
    const accuracy = (correctAnswers / totalQuestions) * 100; // Calcul de la précision
    return (
      <div className="quiz">
        <h1>Quiz complet</h1>
        <h2>Votre score final est : {score}</h2>
        <h2>Nombre de bonnes réponses : {correctAnswers} / {totalQuestions}</h2>
        <h2>Précision : {accuracy.toFixed(2)}%</h2>
      </div>
    );
  }

  if (!question) {
    return <div>Loading...</div>;
  }

  return (
    <div className="quiz">
      <div className="quiz-content">
        <div className="question-section tertiary-bg">
          <div className="question-count white">
            Question
          </div>
          <div className="question-text">
            <h2 className="question">{question.question}</h2>
          </div>
        </div>
        <div className="answer-section">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerButtonClick(index)}
              className={answered && index === question.correctOptionIndex ? 'correct' : answered && index !== question.correctOptionIndex ? 'incorrect' : ''}
              disabled={answered || disableButtons} // Désactiver les boutons après avoir répondu ou pendant le délai de passage à la prochaine question
            >
              {option}
            </button>
          ))}
        </div>
        <div className="time-left">
          Temps restant : {timeLeft} secondes
        </div>
      </div>
    </div>
  );
}

export default Football;
