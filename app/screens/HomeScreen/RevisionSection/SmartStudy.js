import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

import { useSelector, useDispatch } from 'react-redux';

import { PieChart } from "react-native-gifted-charts";

import { saveUser } from '../../../../firebase/userSlice';

import styles from './styles';
import colours from '../../../config/colours';

import MultipleChoiceQ from './RevisionComponents/MultipleChoiceQ';
import WrittenQ from './RevisionComponents/WrittenQ';
import NotEnoughCards from './NotEnoughCards/NotEnoughCards.js';
import { editSet } from '../../../../firebase/setsSlice';
import QuestionFeedbackModal from './RevisionComponents/QuestionFeedbackModal';
import RoundReview from './RevisionComponents/RoundReview';

// 0 - Not Learned : 1 - Learning : 2 - Partially Learned : 3 - Learned
// 0 - multiple choice : 1 - written : 2 - written
// 2 correct - learning : 1 correct : partially learned : 2 correct learned
// 2 incorrect = -1 correct
// can go down in how much you have learnt a thing
// rounds aim to get everything to partially learnt, choosing learning to be the first to be shown
// once all are partially learnt, move onto turning them to learned

const maxQuestions = 8;

function generateIncorrectAnswers(correctAnswer, sentAllAnswers, maxIncorrectAnswers = 3) {
  const incorrectAnswers = [];
  const allAnswers = [...sentAllAnswers];
  
  const filteredAnswers = allAnswers.filter(answer => answer !== correctAnswer);
  
  while (incorrectAnswers.length < maxIncorrectAnswers) {
    const randomIndex = Math.floor(Math.random() * filteredAnswers.length);
    const randomAnswer = filteredAnswers.splice(randomIndex, 1)[0];
    incorrectAnswers.push(randomAnswer);
  }
  return incorrectAnswers;
}

function SmartStudy() {
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
      for (const card of currentSet.cards) {
        if (card.levelLearned === 1 && cardsToQuestion.length < maxQuestions) {
          cardsToQuestion.push(card);
        }
      }

      for (const card of currentSet.cards) {
        if (card.levelLearned === 0 && cardsToQuestion.length < maxQuestions) {
          cardsToQuestion.push(card);
        }
      }

      for (const card of currentSet.cards) {
        if (card.levelLearned === 2 && cardsToQuestion.length < maxQuestions) {
          cardsToQuestion.push(card);
        }
      }

      for (const card of currentSet.cards) {
        if (card.levelLearned === 3 && cardsToQuestion.length < maxQuestions) {
          cardsToQuestion.push(card);
        }
      }
      
      const questions = [];

      const allCards = [...currentSet.cards];
      allCards.shift()

      const allAnswers = allCards.map((card) => card[answerWith]);
      for (const card of cardsToQuestion) {
        const question = {
          cardId: card.id,
          question: answerWith === "definition" ? card.term : card.definition,
          answer: card[answerWith],
          questionType: card.levelLearned === 0 ? "multipleChoice" : "written",
          incorrectAnswers: card.levelLearned === 0 ? generateIncorrectAnswers(card[answerWith], allAnswers) : null,
        }
        questions.push(question);
      }
      return(questions.sort(() => Math.random() - 0.5))
    }

    const questions = useRef([]);
    const typedAnswer = useRef("");
    useEffect(() => {
      roundData.current = {
        correct: 0,
        incorrect: 0,
      };
      questions.current = generateRound();
      currentQuestion.current = questions?.current[questionNumber-1];
      typedAnswer.current = "";
      setQuestionNumber(1);
    }, [roundNumber]);

    useEffect(() => {
      currentQuestion.current = questions?.current[questionNumber-1];
      typedAnswer.current = "";
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
      setShowFeedback(true);
    }, [gotQCorrect]);

    useEffect(() => {
      if (Object.keys(finalGotQCorrect).length === 0) {
        return;
      }
      // update card stats for getting question right/wrong
      const allCards = [...currentSet.cards];
      const newCards = allCards.map((card, index) => {
        const newCard = {...card};
        if (index==0) {return card}
        if (card.id == currentQuestion.current.cardId) {
          if (finalGotQCorrect.correct) {
            roundData.current.correct += 1;
            newCard.correct += 1;
            if (newCard.totalCorrect != undefined) { newCard.totalCorrect += 1; }
            else { newCard.totalCorrect = 1;}
            newCard.incorrect = 0;
            if (newCard.correct >= 2) {
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
    }, [finalGotQCorrect]);

    useEffect(() => {
      if (finishRoundReview) {
        setShowRoundReview(false);
        setFinishRoundReview(false);
        const allCardsLearned = currentSet.cards.every((card) => card.levelLearned == 3);

        if (allCardsLearned) {
          // show that they finished the set and allow them to restart
          console.log("all cards learned")
        }
        typedAnswer.current = "";
        setRoundNumber(roundNumber + 1);
      }
    }, [finishRoundReview]);
    isSetFinished = true;
    allCards = [...currentSet.cards];
    allCards.shift()
    return (
      allCards.length >= 4 ? (
        allCards.every((card) => card.levelLearned == 3) == true ? (
          <View style={styles.restartContainer}>
            <View style={styles.restartContainer}>
              <Image
                source={require('../../../assets/DefaultSetIcon.png')}
                style={styles.image}
                resizeMode="contain"
              />
              <Text style={styles.title}>Restart Set</Text>
              <Text style={styles.description}>
                You have fully learnt this set, time to restart!
              </Text>
              <TouchableOpacity style={styles.button} onPress={()=>{
                const newCards = currentSet.cards.map((card, index) => {
                  const newCard = {...card};
                  if (index==0) {return card}
                  newCard.levelLearned = 0;
                  newCard.correct = 0;
                  newCard.incorrect = 0;
                  return newCard;
                });
                dispatch(editSet({setId: currentSet.id, editedValues: { cards: newCards }}));
                dispatch(saveUser("current"));
              }}>
                <Text style={styles.buttonText}>Restart</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
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
              />
                {currentQuestion.current.questionType === "multipleChoice" ? (
                  <MultipleChoiceQ
                    setGotQCorrect={setGotQCorrect}
                    question={currentQuestion.current.question}
                    incorrectAnswers={currentQuestion.current.incorrectAnswers}
                    answer={currentQuestion.current.answer}
                    progress={(questionNumber - 1) / questions.current.length}
                  />
                ) : (
                  <WrittenQ
                    setGotQCorrect={setGotQCorrect}
                    question={currentQuestion.current.question}
                    answer={currentQuestion.current.answer}
                    progress={(questionNumber - 1) / questions.current.length}
                    typedAnswer={typedAnswer}
                    studyMode={"SmartStudy"}
                  />
                )}
            </>)
          ) : (
            <View></View>
          )
        )
      ) : (
        <NotEnoughCards set={currentSet} minCards={4} studyType={"Smart Study"} />
      )
    )
}

export default SmartStudy;