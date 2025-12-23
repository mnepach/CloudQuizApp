import { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import questionsData from './questions.json';

export default function App() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);

  const question = questionsData[currentQuestion];
  const isMultipleChoice = Array.isArray(question.correctAnswer);

  const handleAnswer = (index) => {
    if (showExplanation) return;

    if (isMultipleChoice) {
      if (selectedAnswers.includes(index)) {
        setSelectedAnswers(selectedAnswers.filter(i => i !== index));
      } else {
        setSelectedAnswers([...selectedAnswers, index]);
      }
    } else {
      setSelectedAnswers([index]);
      checkAnswer([index]);
    }
  };

  const checkAnswer = (answers) => {
    setShowExplanation(true);
    
    let isCorrect = false;
    if (isMultipleChoice) {
      const sortedSelected = [...answers].sort();
      const sortedCorrect = [...question.correctAnswer].sort();
      isCorrect = JSON.stringify(sortedSelected) === JSON.stringify(sortedCorrect);
    } else {
      isCorrect = answers[0] === question.correctAnswer;
    }

    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const handleSubmitMultiple = () => {
    if (selectedAnswers.length === 0) return;
    checkAnswer(selectedAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < questionsData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswers([]);
      setShowExplanation(false);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowExplanation(false);
    setScore(0);
  };

  const getOptionStyle = (index) => {
    if (!showExplanation) {
      return selectedAnswers.includes(index) ? styles.optionSelected : styles.option;
    }

    const correctAnswers = isMultipleChoice ? question.correctAnswer : [question.correctAnswer];
    
    if (correctAnswers.includes(index)) {
      return styles.optionCorrect;
    }
    
    if (selectedAnswers.includes(index) && !correctAnswers.includes(index)) {
      return styles.optionWrong;
    }
    
    return styles.option;
  };

  const isCorrectAnswer = () => {
    if (isMultipleChoice) {
      const sortedSelected = [...selectedAnswers].sort();
      const sortedCorrect = [...question.correctAnswer].sort();
      return JSON.stringify(sortedSelected) === JSON.stringify(sortedCorrect);
    }
    return selectedAnswers[0] === question.correctAnswer;
  };

  if (currentQuestion >= questionsData.length) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Тест завершен!</Text>
          <Text style={styles.resultScore}>
            Ваш результат: {score} из {questionsData.length}
          </Text>
          <TouchableOpacity style={styles.resetButton} onPress={resetQuiz}>
            <Text style={styles.resetButtonText}>Начать заново</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.questionNumber}>
            Вопрос {currentQuestion + 1} из {questionsData.length}
          </Text>
          <Text style={styles.scoreText}>Правильных: {score}</Text>
        </View>

        <Text style={styles.question}>{question.question}</Text>

        {isMultipleChoice && !showExplanation && (
          <Text style={styles.multipleHint}>
            (Выберите несколько вариантов)
          </Text>
        )}

        <View style={styles.optionsContainer}>
          {question.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={getOptionStyle(index)}
              onPress={() => handleAnswer(index)}
              disabled={showExplanation}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {isMultipleChoice && !showExplanation && selectedAnswers.length > 0 && (
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmitMultiple}
          >
            <Text style={styles.submitButtonText}>Проверить ответ</Text>
          </TouchableOpacity>
        )}

        {showExplanation && (
          <View style={styles.explanationContainer}>
            <Text style={[
              styles.resultText,
              isCorrectAnswer() ? styles.correctText : styles.wrongText
            ]}>
              {isCorrectAnswer() ? '✓ Правильно!' : '✗ Неправильно'}
            </Text>
            <Text style={styles.explanationTitle}>Объяснение:</Text>
            <Text style={styles.explanationText}>{question.explanation}</Text>
            
            {currentQuestion < questionsData.length - 1 ? (
              <TouchableOpacity style={styles.nextButton} onPress={nextQuestion}>
                <Text style={styles.nextButtonText}>Следующий вопрос →</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.nextButton} onPress={resetQuiz}>
                <Text style={styles.nextButtonText}>Завершить тест</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: StatusBar.currentHeight || 0,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  questionNumber: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  scoreText: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
  },
  question: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    lineHeight: 28,
  },
  multipleHint: {
    fontSize: 14,
    color: '#FF9800',
    fontStyle: 'italic',
    marginBottom: 15,
  },
  optionsContainer: {
    marginTop: 20,
  },
  option: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  optionSelected: {
    backgroundColor: '#E3F2FD',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  optionCorrect: {
    backgroundColor: '#E8F5E9',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  optionWrong: {
    backgroundColor: '#FFEBEE',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#F44336',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  submitButton: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  explanationContainer: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  correctText: {
    color: '#4CAF50',
  },
  wrongText: {
    color: '#F44336',
  },
  explanationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  explanationText: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
    marginBottom: 20,
  },
  nextButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  resultTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  resultScore: {
    fontSize: 24,
    color: '#4CAF50',
    marginBottom: 40,
  },
  resetButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 12,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});