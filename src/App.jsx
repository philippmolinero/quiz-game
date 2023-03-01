import React from 'react'
import LandingPage from '../src/components/LandingPage'
import Question from '../src/components/Question'
import Answers from '../src/components/Answers'
import { v4 as uuidv4 } from 'uuid'



function App() {

  const [game, setGame] = React.useState(false)
  const [quizState, setQuizState] = React.useState([])
  const [isChecked, setIsChecked] = React.useState(false)
  const [score, setScore] = React.useState(0)
  const [newGame, setNewGame] = React.useState(false)
  
  
  React.useEffect(() => {
     fetch("https://opentdb.com/api.php?amount=5&type=multiple")
     .then(res => res.json())
     .then(data => setQuizState(generateQuiz(data.results)))
     }, [game, newGame]) 

  const handleStart = () => {
      setGame(true)
  }
  
  function convert(str) { 
      const text = document.createElement("textarea")
      text.innerHTML = str
      return text.value
  }
  
  function generateQuiz(dataFromApi){
      const questions = dataFromApi.map(quiz => {
          return {
          questionId: uuidv4(),
          question: convert(quiz.question),
          answers: shuffle(generateAnswers(quiz))
          }
      })
      return questions
  }
  
  function generateAnswers(dataFromApi){
      const allAnswers = dataFromApi.incorrect_answers.map(item => {
          return {
              answerId: uuidv4(), 
              text: convert(item), 
              isCorrect: false, 
              isSelected: false,
          }
      })
      allAnswers.push({
              answerId: uuidv4(),
              text: convert(dataFromApi.correct_answer), 
              isCorrect: true, 
              isSelected: false,   
      })
  return allAnswers
  }
          
  function shuffle(array) {
      let currentIndex = array.length,  randomIndex
      while (currentIndex != 0) {
          // Pick a remaining element.
          randomIndex = Math.floor(Math.random() * currentIndex)
          currentIndex--
          // And swap it with the current element.
          [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
      }
  return array
  }

// id of selected question and respective answer is being passed through and the state of "isSelected" is to be changed
  function handleSelectAnswer(questionId, answerId) {   
      setQuizState(prevQuiz => prevQuiz.map(questions => {
          return questions.questionId === questionId ? 
              {
                  ...questions,
                  answers: questions.answers.map(answer => {
                  return answer.answerId === answerId ? 
                  {
                      ...answer,
                      isSelected: !answer.isSelected
                  } : 
                  {
                      ...answer,
                      isSelected: false
                  }
              })  
          } : 
          questions
      }))
  }
  
  function handleCheckAnswers(){
      setIsChecked(!isChecked)
      quizState.map(questions => {
          questions.answers.map(answers => {
              if(answers.isSelected && answers.isCorrect){
                  setScore(prevScore => prevScore + 1)
              }
          })
      })
  }
  
  
  function handlePlayAgain() {
      setNewGame(!newGame)
      setIsChecked(false)
      setScore(0)
      scrollToTop()
  }
  
  function scrollToTop() {
      window.scrollTo({top: 0, behavior: 'smooth'})
  }

  
  const renderQuiz = quizState.map(quiz => {
      return (
          <div className="question-container" key={uuidv4()}>   
              <Question 
                  questionId={quiz.questionId}
                  question={quiz.question}  
              />
              <div className="question-answers-container">
                  {quiz.answers.map(answer => {
                      return (
                         <Answers
                          key={uuidv4()}
                          answerId={answer.answerId}
                          text={answer.text}
                          isCorrect={answer.isCorrect}
                          isSelected={answer.isSelected}
                          isChecked={isChecked}
                          selectAnswer={() => handleSelectAnswer(quiz.questionId, answer.answerId)}
                         /> 
                      )
                     })
                  }
              </div>
          </div>
      )
  })
  
  
  // Temporary solution; an additional component for checking, starting a new game and showing the score is to be implemented
  const scoreElement = isChecked ? <span className="score">You scored {score}/{quizState.length} correct answers</span> : null
  
  return (
      <main>
          {
          game ? 
          <div className="quiz">
              {renderQuiz}
              {scoreElement}
              <button className="btn" onClick={isChecked ? handlePlayAgain : handleCheckAnswers}>{isChecked ? "Play again" : "Check answers"}</button>  
          </div> : 
          <LandingPage 
              onStart={handleStart}
          />
          }
          <svg className="top-right" width="194" height="197" viewBox="0 0 194 197" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M99.4095 81.3947C71.1213 50.8507 33.3179 21.7816 37.1727 -19.6933C41.4394 -65.599 75.8541 -105.359 118.419 -123.133C158.797 -139.994 206.035 -130.256 241.822 -105.149C271.947 -84.0141 272.823 -43.8756 282.141 -8.27103C292.17 30.0508 318.521 70.8106 296.501 103.779C273.538 138.159 224.991 143.432 183.931 138.768C148.318 134.723 123.751 107.677 99.4095 81.3947Z" fill="#FFFAD1"/>
          </svg>
          <svg className="bottom-left" width="148" height="118" viewBox="0 0 148 118" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M-5.55191 4.90596C35.9614 1.77498 82.2425 -9.72149 112.306 19.1094C145.581 51.0203 155.282 102.703 142.701 147.081C130.767 189.18 93.7448 220.092 51.8208 232.476C16.5281 242.902 -15.4332 218.605 -49.1007 203.738C-85.3375 187.737 -133.641 182.993 -145.741 145.239C-158.358 105.868 -132.269 64.5881 -103.064 35.3528C-77.7328 9.99541 -41.2727 7.60006 -5.55191 4.90596Z" fill="#DEEBF8"/>
          </svg>    
      </main>
  )

}

export default App
