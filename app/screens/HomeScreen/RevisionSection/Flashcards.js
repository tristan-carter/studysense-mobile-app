import React, { useEffect, useState, useRef } from 'react';
import { View } from 'react-native';

import { useSelector, useDispatch } from 'react-redux';
import { saveUser } from '../../../../firebase/userSlice';

import styles from './styles';
import colours from '../../../config/colours';
import FlashcardQ from './RevisionComponents/FlashcardQ';

import MultipleChoiceQ from './RevisionComponents/MultipleChoiceQ';
import WrittenQ from './RevisionComponents/WrittenQ';
import NotEnoughCards from './NotEnoughCards/NotEnoughCards.js';
import { editSet } from '../../../../firebase/setsSlice';
import QuestionFeedbackModal from './RevisionComponents/QuestionFeedbackModal';
import RoundReview from './RevisionComponents/RoundReview';

const maxQuestions = 20;

function Flashcards({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const currentFolderId = user.currentFolder;
  const currentSetId = user.currentSet;
  var currentSet = null;
  if (currentFolderId!=null) {
    currentSet = user.data.folders.filter((folder) => folder.id === currentFolderId)[0].sets.filter((set) => set.id === currentSetId)[0];
  }
  else {
    currentSet = user.data.sets.filter((set) => set.id === currentSetId)[0];
  }

  const [roundNumber, setRoundNumber] = useState(1);
  const [questionNumber, setQuestionNumber] = useState(1);

  const generateRound = () => {
    const possibleAnswerWiths = [];
    if (currentSet.smartStudyOptions.answerWithTerm) {possibleAnswerWiths.push("term")};
    if (currentSet.smartStudyOptions.answerWithDefinition) {possibleAnswerWiths.push("definition")};
    const answerWith = possibleAnswerWiths[Math.floor(Math.random() * possibleAnswerWiths.length)];

    const cardsToQuestion = []
    const allCards = [...currentSet.cards];
    allCards.shift()
    for (let i = 0; i < maxQuestions; i++) {
      if (allCards.length == 0) {break;}
      const randomCardIndex = Math.floor(Math.random() * allCards.length);
      const randomCard = allCards[randomCardIndex];
      allCards.splice(randomCardIndex, 1);
      cardsToQuestion.push(randomCard);
    }
    
    const questions = [];
    for (const card of cardsToQuestion) {
      const question = {
        cardId: card.id,
        question: answerWith === "definition" ? card.term : card.definition,
        answer: card[answerWith],
        questionType: "written",
      }
      questions.push(question);
    }
    return(questions.sort(() => Math.random() - 0.5))
  }

  const questions = useRef([]);
  useEffect(() => {
    roundData.current = {
      correct: 0,
      incorrect: 0,
    };
    questions.current = generateRound();
    currentQuestion.current = questions?.current[questionNumber-1];
    setQuestionNumber(1);
  }, [roundNumber]);

  useEffect(() => {
    currentQuestion.current = questions?.current[questionNumber-1];
    setGotQCorrect({});
  }, [questionNumber]);

  const currentQuestion = useRef(null);
  const [gotQCorrect, setGotQCorrect] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [showRoundReview, setShowRoundReview] = useState(false);
  const [finalGotQCorrect, setFinalGotQCorrect] = useState({});
  const [finishRoundReview, setFinishRoundReview] = useState(false);
  const roundData = useRef({
    correct: 0,
    incorrect: 0,
  });

  useEffect(() => {
    if (Object.keys(gotQCorrect).length === 0) {
      return;
    }
    // display whether they got it right/wrong and allow them to change whether they got the question right/wrong
    //setShowFeedback(true);

    // update card stats for getting question right/wrong
    const allCards = [...currentSet.cards];
    const newCards = allCards.map((card, index) => {
      const newCard = {...card};
      if (index==0) {return card}
      if (card.id == currentQuestion.current.cardId) {
        if (gotQCorrect.correct) {
          roundData.current.correct += 1;
          newCard.correct += 1;
          if (newCard.totalCorrect != undefined) { newCard.totalCorrect += 1; }
          else { newCard.totalCorrect = 1;}
          newCard.incorrect = 0;
          if (newCard.correct >= 1) {
            newCard.levelLearned = Math.min(newCard.levelLearned + 1, 3);
            newCard.correct = 0;
          }
        } else {
          roundData.current.incorrect += 1;
          newCard.incorrect += 1;
          if (newCard.totalIncorrect != undefined) { newCard.totalIncorrect += 1; }
          else { newCard.totalIncorrect = 1;}
          newCard.correct = 0;
          if (newCard.incorrect >= 2) {
            newCard.correct = Math.max(newCard.correct - 1, 0);
            newCard.incorrect = 0;
            if (newCard.levelLearned > 0) {
              newCard.levelLearned = Math.max(newCard.levelLearned - 1, 0);
            }
          }
        }
      }
      return newCard;
    });
    dispatch(editSet({setId: currentSet.id, editedValues: { cards: newCards }}));
    if (questionNumber < questions.current.length) {
      setQuestionNumber(questionNumber + 1);
    } else {
      // saves current user data after each round
      dispatch(saveUser("current"));
      setShowRoundReview(true);
    }
  }, [gotQCorrect]);

  useEffect(() => {
    if (finishRoundReview) {
      setShowRoundReview(false);
      setFinishRoundReview(false);
      const allCardsLearned = currentSet.cards.every((card) => card.levelLearned == 3);

      if (allCardsLearned) {
        // show that they finished the set and allow them to restart
        console.log("all cards learned")
      }
      setRoundNumber(roundNumber + 1);
    }
  }, [finishRoundReview]);
  const allCards = currentSet ? [...currentSet.cards] : [];
  allCards.shift()
  return (
    allCards.length >= 1 ? (
      currentQuestion.current ? (
        showRoundReview ? (
        <RoundReview
          setFinishRoundReview={setFinishRoundReview}
          roundData={roundData.current}
          buttonText={"Next Round"}
        />
        )
        : (<>
            <QuestionFeedbackModal
              showFeedback={showFeedback}
              setShowFeedback={setShowFeedback}
              setFinalGotQCorrect={setFinalGotQCorrect}
              gotQCorrect={gotQCorrect}
              question={currentQuestion.current}
              isFlashcardFeedback={true}
            />
            <FlashcardQ
              setGotQCorrect={setGotQCorrect}
              gotQCorrect={gotQCorrect}
              question={currentQuestion.current.question}
              answer={currentQuestion.current.answer}
              progress={(questionNumber - 1) / questions.current.length}
            />
        </>)
      ) : (
        <View></View>
      )
    ) : (
      <NotEnoughCards set={currentSet} minCards={1} studyType={"Flashcards"} />
    )
  )
}

export default Flashcards;