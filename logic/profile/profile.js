// App Requires
const config = require('../../config')
const sort = require('../../utils/sort/sort')

calculateMatchingPercentageBetweenProfiles = (profileA, profileB) => {
  if (!profileA || !profileB || profileA.id === profileB.id) {
    return
  }

  if (!profileA.answers || !profileA.answers.length) {
    return
  }

  if (!profileB.answers || !profileB.answers.length) {
    return
  }

  let s = 0
  let profileAAnswers = sort.mergeSort(profileA.answers, answersCompareFn)
  let profileBAnswers = sort.mergeSort(profileB.answers, answersCompareFn)
  let profileAAnswersIndex = 0
  let profileBAnswersIndex = 0

  let profileABaseImportancePoints = 0
  let profileAImportancePoints = 0
  let profileBBaseImportancePoints = 0
  let profileBImportancePoints = 0

  while (profileAAnswersIndex < profileAAnswers.length - 1 && profileBAnswersIndex < profileBAnswers.length - 1) {
    let profileAQuestion = profileAAnswers[profileAAnswersIndex]
    let profileBQuestion = profileBAnswers[profileBAnswersIndex]

    if (profileAQuestion.questionId === profileBQuestion.questionId) {
      profileABaseImportancePoints += config.importanceLevelPoints[profileAQuestion.importance]
      profileBBaseImportancePoints += config.importanceLevelPoints[profileBQuestion.importance]
      s += 1

      if (isAcceptableAnswer(profileAQuestion.acceptableAnswers, profileBQuestion.answer)) {
        profileAImportancePoints += config.importanceLevelPoints[profileAQuestion.importance]
      }

      if (isAcceptableAnswer(profileBQuestion.acceptableAnswers, profileAQuestion.answer)) {
        profileBImportancePoints += config.importanceLevelPoints[profileBQuestion.importance]
      }

      profileAAnswersIndex += 1
      profileBAnswersIndex += 1
    } else if (profileAQuestion.questionId < profileBQuestion.questionId) {
      profileAAnswersIndex += 1
    } else {
      profileBAnswersIndex += 1
    }
  }

  let profileAMatchSatisfaction = profileAImportancePoints / profileABaseImportancePoints
  let profileBMatchSatisfaction = profileBImportancePoints / profileBBaseImportancePoints
  let marginError = 1 / s

  let trueMatch = Math.sqrt(profileAMatchSatisfaction * profileBMatchSatisfaction) - marginError

  if (trueMatch < 0) { trueMatch = 0 }

  trueMatch = trueMatch.toFixed(2)

  return trueMatch
}

isAcceptableAnswer = (acceptableAnswersArr, answerId) => {
  return acceptableAnswersArr.includes(answerId) && acceptableAnswersArr.length < config.maximumAcceptableAnswers
}

answersCompareFn = (answerA, answerB) => answerA.questionId < answerB.questionId

module.exports = { calculateMatchingPercentageBetweenProfiles }
