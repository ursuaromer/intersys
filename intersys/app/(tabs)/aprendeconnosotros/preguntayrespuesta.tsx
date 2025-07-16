import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Dimensions,
  Animated,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

/**
 * Componente principal del juego de trivia espacial
 * Utiliza la NASA API para obtener datos actualizados sobre el espacio
 */
const SpaceTriviaGame = () => {
  // Estados principales del juego
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [nasaData, setNasaData] = useState(null);
  
  // Animaciones
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(1);

  // Configuración de la API de NASA
  const NASA_API_KEY = 'sEs6pVAG8JlLgfh7fzJcVUiuFgdUcYECZqqWuCeB';
  const NASA_BASE_URL = 'https://api.nasa.gov';

  /**
   * Obtiene datos de la NASA API para crear preguntas dinámicas
   * Utiliza diferentes endpoints para variedad de contenido
   */
  const fetchNASAData = async () => {
    try {
      setLoading(true);
      
      // Obtener datos de APOD (Astronomy Picture of the Day)
      const apodResponse = await fetch(
        `${NASA_BASE_URL}/planetary/apod?api_key=${NASA_API_KEY}&count=3`
      );
      const apodData = await apodResponse.json();
      
      // Obtener datos de asteroides cercanos
      const today = new Date().toISOString().split('T')[0];
      const asteroidResponse = await fetch(
        `${NASA_BASE_URL}/neo/rest/v1/feed?start_date=${today}&end_date=${today}&api_key=${NASA_API_KEY}`
      );
      const asteroidData = await asteroidResponse.json();
      
      // Obtener datos de Mars Rover
      const marsResponse = await fetch(
        `${NASA_BASE_URL}/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&api_key=${NASA_API_KEY}`
      );
      const marsData = await marsResponse.json();
      
      setNasaData({
        apod: apodData,
        asteroids: asteroidData,
        mars: marsData
      });
      
      generateQuestions(apodData, asteroidData, marsData);
    } catch (error) {
      console.error('Error fetching NASA data:', error);
      generateStaticQuestions();
    } finally {
      setLoading(false);
    }
  };

  /**
   * Genera preguntas basadas en datos de la NASA API
   * Combina datos en tiempo real con preguntas estáticas
   */
  const generateQuestions = (apodData, asteroidData, marsData) => {
    const dynamicQuestions = [];
    
    // Preguntas basadas en APOD
    if (apodData && apodData.length > 0) {
      apodData.forEach((item, index) => {
        if (index < 2) { // Límite de 2 preguntas APOD
          dynamicQuestions.push({
            question: `¿Cuál es el título de la imagen astronómica del día mostrada?`,
            options: [
              item.title,
              "Nebulosa del Cangrejo",
              "Galaxia de Andrómeda",
              "Superficie de Marte"
            ],
            correctAnswer: 0,
            explanation: item.explanation?.substring(0, 200) + "...",
            image: item.url
          });
        }
      });
    }
    
    // Preguntas estáticas combinadas con dinámicas
    const staticQuestions = [
      {
        question: "¿Cuál es el planeta más grande del sistema solar?",
        options: ["Saturno", "Júpiter", "Neptuno", "Urano"],
        correctAnswer: 1,
        explanation: "Júpiter es el planeta más grande del sistema solar, con una masa mayor que todos los demás planetas combinados."
      },
      {
        question: "¿Cuántas lunas tiene Marte?",
        options: ["1", "2", "3", "4"],
        correctAnswer: 1,
        explanation: "Marte tiene dos lunas pequeñas llamadas Fobos y Deimos, descubiertas en 1877."
      },
      {
        question: "¿Cuál es la estrella más cercana a la Tierra?",
        options: ["Proxima Centauri", "Alpha Centauri", "El Sol", "Sirio"],
        correctAnswer: 2,
        explanation: "El Sol es la estrella más cercana a la Tierra, ubicada a aproximadamente 150 millones de kilómetros."
      },
      {
        question: "¿Cuánto tiempo tarda la luz del Sol en llegar a la Tierra?",
        options: ["8 minutos", "1 hora", "1 día", "1 segundo"],
        correctAnswer: 0,
        explanation: "La luz del Sol tarda aproximadamente 8 minutos y 20 segundos en llegar a la Tierra."
      },
      {
        question: "¿Cuál es la galaxia más cercana a la Vía Láctea?",
        options: ["Galaxia de Andrómeda", "Galaxia del Triángulo", "Nubes de Magallanes", "Galaxia Elíptica"],
        correctAnswer: 2,
        explanation: "Las Nubes de Magallanes son las galaxias más cercanas a la Vía Láctea, aunque Andrómeda es la galaxia espiral más cercana."
      }
    ];
    
    // Combinar preguntas dinámicas y estáticas
    const allQuestions = [...dynamicQuestions, ...staticQuestions];
    
    // Mezclar preguntas aleatoriamente
    const shuffledQuestions = allQuestions.sort(() => Math.random() - 0.5);
    
    setQuestions(shuffledQuestions.slice(0, 10)); // Límite de 10 preguntas
  };

  /**
   * Genera preguntas estáticas en caso de error con la API
   */
  const generateStaticQuestions = () => {
    const staticQuestions = [
      {
        question: "¿Cuál es el planeta más grande del sistema solar?",
        options: ["Saturno", "Júpiter", "Neptuno", "Urano"],
        correctAnswer: 1,
        explanation: "Júpiter es el planeta más grande del sistema solar."
      },
      {
        question: "¿Cuántas lunas tiene Marte?",
        options: ["1", "2", "3", "4"],
        correctAnswer: 1,
        explanation: "Marte tiene dos lunas: Fobos y Deimos."
      },
      {
        question: "¿Cuál es la estrella más cercana a la Tierra?",
        options: ["Proxima Centauri", "Alpha Centauri", "El Sol", "Sirio"],
        correctAnswer: 2,
        explanation: "El Sol es la estrella más cercana a la Tierra."
      },
      {
        question: "¿Cuánto tiempo tarda la luz del Sol en llegar a la Tierra?",
        options: ["8 minutos", "1 hora", "1 día", "1 segundo"],
        correctAnswer: 0,
        explanation: "La luz del Sol tarda aproximadamente 8 minutos en llegar a la Tierra."
      },
      {
        question: "¿Cuál es la velocidad de la luz?",
        options: ["300,000 km/s", "150,000 km/s", "450,000 km/s", "100,000 km/s"],
        correctAnswer: 0,
        explanation: "La velocidad de la luz es aproximadamente 300,000 kilómetros por segundo."
      }
    ];
    
    setQuestions(staticQuestions);
  };

  /**
   * Maneja la selección de respuesta del usuario
   * Incluye animaciones y feedback visual
   */
  const handleAnswerSelection = (selectedAnswerIndex) => {
    setSelectedAnswer(selectedAnswerIndex);
    
    // Animación de escala al seleccionar
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Mostrar resultado después de un breve delay
    setTimeout(() => {
      setShowResult(true);
      if (selectedAnswerIndex === questions[currentQuestion].correctAnswer) {
        setScore(score + 1);
      }
    }, 500);
  };

  /**
   * Avanza a la siguiente pregunta o muestra el resultado final
   */
  const handleNextQuestion = () => {
    const nextQuestion = currentQuestion + 1;
    
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
      setSelectedAnswer(null);
      setShowResult(false);
      
      // Animación de fade para transición
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      setShowScore(true);
    }
  };

  /**
   * Reinicia el juego desde el principio
   */
  const resetGame = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setSelectedAnswer(null);
    setShowResult(false);
    fetchNASAData(); // Obtener nuevos datos para preguntas frescas
  };

  // Efecto para cargar datos iniciales
  useEffect(() => {
    fetchNASAData();
  }, []);

  // Efecto para animaciones
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [currentQuestion]);

  /**
   * Componente de loading con animación
   */
  const LoadingScreen = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#4A90E2" />
      <Text style={styles.loadingText}>Cargando datos del espacio...</Text>
    </View>
  );

  /**
   * Componente de pantalla de resultados final
   */
  const ScoreScreen = () => (
    <View style={styles.scoreContainer}>
      <Text style={styles.scoreTitle}>🚀 ¡Juego Completado! 🚀</Text>
      <Text style={styles.scoreText}>
        Tu puntuación: {score} de {questions.length}
      </Text>
      <Text style={styles.scorePercentage}>
        {Math.round((score / questions.length) * 100)}% Correcto
      </Text>
      
      <TouchableOpacity style={styles.restartButton} onPress={resetGame}>
        <Text style={styles.restartButtonText}>Jugar de Nuevo</Text>
      </TouchableOpacity>
    </View>
  );

  // Mostrar loading si está cargando
  if (loading) {
    return <LoadingScreen />;
  }

  // Mostrar pantalla de puntuación si el juego terminó
  if (showScore) {
    return <ScoreScreen />;
  }

  // Pantalla principal del juego
  return (
    <LinearGradient
      colors={['#0B1426', '#1A2B4C', '#2D4A73']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header con progreso */}
        <View style={styles.header}>
          <Text style={styles.questionCounter}>
            Pregunta {currentQuestion + 1} de {questions.length}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${((currentQuestion + 1) / questions.length) * 100}%` }
              ]}
            />
          </View>
          <Text style={styles.score}>Puntuación: {score}</Text>
        </View>

        {/* Imagen de la NASA si está disponible */}
        {questions[currentQuestion]?.image && (
          <Image
            source={{ uri: questions[currentQuestion].image }}
            style={styles.nasaImage}
          />
        )}

        {/* Pregunta actual */}
        <Animated.View style={[styles.questionContainer, { opacity: fadeAnim }]}>
          <Text style={styles.questionText}>
            {questions[currentQuestion]?.question}
          </Text>
        </Animated.View>

        {/* Opciones de respuesta */}
        <View style={styles.answersContainer}>
          {questions[currentQuestion]?.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.answerButton,
                selectedAnswer === index && styles.selectedAnswer,
                showResult && index === questions[currentQuestion].correctAnswer && styles.correctAnswer,
                showResult && selectedAnswer === index && index !== questions[currentQuestion].correctAnswer && styles.incorrectAnswer,
              ]}
              onPress={() => !showResult && handleAnswerSelection(index)}
              disabled={showResult}
            >
              <Text style={[
                styles.answerText,
                selectedAnswer === index && styles.selectedAnswerText,
                showResult && index === questions[currentQuestion].correctAnswer && styles.correctAnswerText,
              ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Explicación y botón siguiente */}
        {showResult && (
          <Animated.View style={[styles.resultContainer, { opacity: fadeAnim }]}>
            <Text style={styles.explanationText}>
              {questions[currentQuestion]?.explanation}
            </Text>
            <TouchableOpacity style={styles.nextButton} onPress={handleNextQuestion}>
              <Text style={styles.nextButtonText}>
                {currentQuestion + 1 < questions.length ? 'Siguiente Pregunta' : 'Ver Resultados'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </ScrollView>
    </LinearGradient>
  );
};

// Estilos para el modo oscuro espacial
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0B1426',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 18,
    marginTop: 20,
    fontWeight: '600',
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  questionCounter: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#2D4A73',
    borderRadius: 4,
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4A90E2',
    borderRadius: 4,
  },
  score: {
    color: '#4A90E2',
    fontSize: 18,
    fontWeight: 'bold',
  },
  nasaImage: {
    width: '100%',
    height: 200,
    borderRadius: 15,
    marginBottom: 20,
  },
  questionContainer: {
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#4A90E2',
  },
  questionText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 28,
  },
  answersContainer: {
    marginBottom: 20,
  },
  answerButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2D4A73',
  },
  selectedAnswer: {
    backgroundColor: 'rgba(74, 144, 226, 0.3)',
    borderColor: '#4A90E2',
  },
  correctAnswer: {
    backgroundColor: 'rgba(76, 175, 80, 0.3)',
    borderColor: '#4CAF50',
  },
  incorrectAnswer: {
    backgroundColor: 'rgba(244, 67, 54, 0.3)',
    borderColor: '#F44336',
  },
  answerText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  selectedAnswerText: {
    color: '#4A90E2',
    fontWeight: '600',
  },
  correctAnswerText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  resultContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    padding: 20,
    marginTop: 20,
  },
  explanationText: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  nextButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  scoreContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0B1426',
    padding: 20,
  },
  scoreTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  scoreText: {
    color: '#4A90E2',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 10,
  },
  scorePercentage: {
    color: '#FFFFFF',
    fontSize: 20,
    marginBottom: 40,
  },
  restartButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    padding: 15,
    paddingHorizontal: 30,
  },
  restartButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default SpaceTriviaGame;     