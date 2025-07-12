import React from "react"
import { clsx } from "clsx"
import { languages } from "./languages"
import { getFarewellText } from "./utilis"
import { randomWord } from "./utilis"
import Confetti from "react-confetti"

export default function App() {

  //State Values
  const [currentWord, setCurrentWord] = React.useState(() => randomWord())
  const [guessedLetters, setGuessedLetters] = React.useState([])

  //Derived Values
  const noGuessesLeft = languages.length - 1
  const wrongGuessesCount = guessedLetters.filter(letter =>
    !currentWord.includes(letter)).length

  const isGameWon =
    currentWord.split("").every(letter => guessedLetters.includes(letter))
  const isGameLost = wrongGuessesCount >= noGuessesLeft;
  const isGameOver = isGameWon || isGameLost
  const lastGuessedLetter = guessedLetters[guessedLetters.length - 1]
  const isLastGuessIncorrect = lastGuessedLetter && !currentWord.includes(lastGuessedLetter)

  console.log(isGameOver)

  //Static Values
  const alphabet = "abcdefghijklmnopqrstuvwxyz"

  function addGuessedLetter(letter) {
    setGuessedLetters(prevLetters =>
      prevLetters.includes(letter) ?
        prevLetters :
        [...prevLetters, letter]
    )
  } 
  
  function startNewGame() {
    setCurrentWord(randomWord())
    setGuessedLetters([])
  }

  const keyboardElements = alphabet.split("").map((item, index) => {
    const isGuessed = guessedLetters.includes(item)
    const isCorrect = isGuessed && currentWord.includes(item)
    const isWrong = isGuessed && !currentWord.includes(item)
    
    const className = clsx({
      correct: isCorrect,
      wrong: isWrong
    })

    return (
      <button className={className}
        key={index}
        disabled={isGameOver}
        aria-disabled={guessedLetters.includes(item)}
        aria-label={`Letter ${item}`}
        onClick={() => addGuessedLetter(item)}
      >
        {item.toUpperCase()}
      </button>
    )
  }
  )

  const languageElements = languages.map((item, index) => {
    const isLanguageLost = index < wrongGuessesCount
    const styles = {
      backgroundColor: item.backgroundColor,
      color: item.color
    }
    const className = clsx("chips", isLanguageLost && "lost")
    return (
      <div className={className}
        style={styles}
        key={item.name}
      >
        {item.name}
      </div>
    )
  })

  const letterElements = currentWord.split("").map((letter, index) => {
    const shouldRevealLetter = isGameLost || guessedLetters.includes(letter)
    const letterClassName = clsx("letter",{
      "missed-letter": isGameLost && !guessedLetters.includes(letter) 
    }) 
    return (
      <span className={letterClassName} Key={index}>
      {shouldRevealLetter ? letter.toUpperCase() : " "}
    </span>
    )
  })

  const gameStatusClass = clsx("game-status", {
    won: isGameWon, 
    lost: isGameLost,
    farewell: !isGameOver && isLastGuessIncorrect
  })


  function renderGameStatus() {
    if (!isGameOver && isLastGuessIncorrect) {
      return (
        <p className="farewell-message">
          {getFarewellText(languages[wrongGuessesCount - 1].name)}
        </p>
      )
    }

    if (isGameWon) {
      return (
        <>
          You win!<br></br>
          <span>Well done!🎉</span>
        </>
      )
    } 
    
    if (isGameLost) {
      return (
        <>
          Game Over!<br></br>
          <span>You lose! Better start learning Assembly😭</span>
        </>
      )
    }
  }


  return (
    <main>
      {
        isGameWon && <Confetti recycle={false} numberOfPieces={1000}/>
      }
      <header>
        <h1>Assembly: Endgame</h1>
        <p>Guess the word within 8 attempts to keep the programming
          <br></br>world safe from the Assembly!!</p>
      </header>

      <section className= {gameStatusClass} aria-live="polite" role="status">
        {renderGameStatus()}
      </section>

      <section className="langauge-chips">
        {languageElements}
      </section>

      <section className="word">
        {letterElements}
      </section>

      {/* Combined visually-hidden aria-live for status update*/}
      <section className="sr-only" aria-live="polite" role="status">
        <p>
          {currentWord.includes(lastGuessedLetter)?
              `Correct! The letter ${lastGuessedLetter} is in the word` :
              `Sorry, the letter ${lastGuessedLetter} is not in the word`
          } 
          You have {noGuessesLeft} attempts left.
        </p>
        <p>Current word: {currentWord.split("").map(letter =>
          guessedLetters.includes(letter) ? letter + "." : "blank.")
          .join("")
        }</p>
      </section>

      <section className="keyboard">
        {keyboardElements}
      </section>


      {isGameOver
        &&
        <section className="new-game">
          <button onClick={startNewGame} className="new-game-button">New Game</button>
        </section>
      }
    </main>
  )
}


/* Project Planning: 
  Questions to ask yourself before writingany code:

  1) What are the main containers of elements I need in this app?

  2) What values will need to be saved in state vs
    what values can be derived from the state?

  3) How will the user interact with the app? What events do I 
    need ot handle?
*/


  