import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

function Football() {
  const initialScore = parseInt(localStorage.getItem('score')) || 0;
  const [question, setQuestion] = useState(null);
  const [quizComplete, setQuizComplete] = useState(false);
  const [score, setScore] = useState(initialScore);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [questionCount, setQuestionCount] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [disableButtons, setDisableButtons] = useState(false);

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
      handleAnswerButtonClick(-1);
    }
    return () => clearTimeout(timer);
  }, [timeLeft, quizComplete, answered]);

  const fetchFootballQuestion = async () => {
    try {
      const response = await axios.get('http://localhost:8000/questions/football/random');
      setQuestion(response.data);
      setTimeLeft(10);
      setAnswered(false);
      setDisableButtons(false);
    } catch (error) {
      console.error('Erreur lors de la récupération de la question de football :', error);
    }
  };

  const handleAnswerButtonClick = async (selectedOptionIndex) => {
    const isCorrect = selectedOptionIndex === question.correctOptionIndex;
    let updatedScore = score;
    if (isCorrect) {
      updatedScore += 5 + timeLeft;
      setCorrectAnswers(correctAnswers + 1);
    } else if (selectedOptionIndex !== -1) {
      updatedScore -= 5;
    } else {
      updatedScore -= 10;
    }
    setScore(updatedScore);
    setAnswered(true);
    setDisableButtons(true);
    localStorage.setItem('score', updatedScore);
    
    try {
      const token = localStorage.getItem('token');
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;
      const response = await axios.post('http://localhost:8000/update-score', { userId: userId, newScore: updatedScore });
      console.log('Score mis à jour côté serveur:', response.data);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du score côté serveur:', error);
    }

    setTimeout(() => {
      if (questionCount < 4) {
        fetchFootballQuestion();
        setQuestionCount(questionCount + 1);
        setDisableButtons(false);
      } else {
        console.log('Score final :', score);
        setQuizComplete(true);
      }
    }, 2000);
  };

  if (quizComplete) {
    return (
      <div className="quiz">
      <div className="quiz-content">
        <div className="question-section tertiary-bg">
          <div className="question-text">
            <h2 className="question">Quiz complet</h2>
          </div>
        </div>
        <div className="answer-section" style={{ opacity: quizComplete ? 1 : 0, transition: 'opacity 1s ease' }}>
          <button style={{ textAlign: 'center', cursor: 'default' }}><strong>Votre score global est : {score}</strong></button>
          <button style={{ textAlign: 'center', cursor: 'default' }}><strong>Nombre de bonnes réponses : {correctAnswers} / 5</strong></button>
          <button style={{ textAlign: 'center', cursor: 'default' }}><strong>Précision : {((correctAnswers / 5) * 100).toFixed(2)}%</strong></button>
        </div>
      </div>
    </div>
    );
  }

  if (!question) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="quiz">
      <div className="quiz-content">
        <div className="question-section tertiary-bg">
          <div className="question-count white">Question</div>
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
              disabled={answered || disableButtons}
            >
              {option}
            </button>
          ))}
        </div>
        <div className="time-left">Temps restant : {timeLeft} secondes</div>
      </div>
    </div>
  );
}

export default Football;
