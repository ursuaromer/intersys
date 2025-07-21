import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  ActivityIndicator, Dimensions, Animated, Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';
import { useRouter } from 'expo-router';
const router = useRouter();


const { width } = Dimensions.get('window');

type Question = {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  image?: string;
};

const NASA_KEY = 'sEs6pVAG8JlLgfh7fzJcVUiuFgdUcYECZqqWuCeB';

const staticQuestions: Question[] = [
  {
    question: '¿Cuál es el planeta más grande del sistema solar?',
    options: ['Saturno', 'Júpiter', 'Neptuno', 'Urano'],
    correctAnswer: 1,
    explanation: 'Júpiter es el planeta más grande con gran masa.',
  },
  {
    question: '¿Cuántas lunas tiene Marte?',
    options: ['1', '2', '3', '4'],
    correctAnswer: 1,
    explanation: 'Fobos y Deimos son las dos lunas de Marte.',
  },
  {
    question: '¿Cuál es la estrella más cercana a la Tierra?',
    options: ['Proxima Centauri', 'Alpha Centauri', 'El Sol', 'Sirio'],
    correctAnswer: 2,
    explanation: 'El Sol es la estrella más cercana a la Tierra.',
  },
  {
    question: '¿Cuánto tiempo tarda la luz del Sol en llegar a la Tierra?',
    options: ['8 minutos', '1 hora', '1 día', '1 segundo'],
    correctAnswer: 0,
    explanation: 'La luz tarda 8 minutos y 20 segundos aprox.',
  },
];

const SpaceTriviaGame = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showScore, setShowScore] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const scaleAnim = useState(new Animated.Value(1))[0];
  const [correctSound, setCorrectSound] = useState<Audio.Sound | null>(null);
  const [wrongSound, setWrongSound] = useState<Audio.Sound | null>(null);
  const [finishSound, setFinishSound] = useState<Audio.Sound | null>(null);

  const loadSounds = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      // Cargar sonido de respuesta correcta
      const { sound: correctSnd } = await Audio.Sound.createAsync(
        { uri: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav' },
        { shouldPlay: false }
      );
      setCorrectSound(correctSnd);

      // Cargar sonido de respuesta incorrecta (más elegante)
      // Cargar sonido de respuesta incorrecta (nuevo enlace)
      const { sound: wrongSnd } = await Audio.Sound.createAsync(
        { uri: 'https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3' },
        { shouldPlay: false }
      );
      setWrongSound(wrongSnd);


      // Cargar sonido de resultados finales
      const { sound: finishSnd } = await Audio.Sound.createAsync(
        { uri: 'https://www.soundjay.com/misc/sounds/magic-chime-02.wav' },
        { shouldPlay: false }
      );
      setFinishSound(finishSnd);
    } catch (error) {
      console.log('Error cargando sonidos:', error);
    }
  };

  const playSound = async (type: 'correct' | 'wrong' | 'finish') => {
    try {
      let sound;
      switch (type) {
        case 'correct':
          sound = correctSound;
          break;
        case 'wrong':
          sound = wrongSound;
          break;
        case 'finish':
          sound = finishSound;
          break;
      }
      
      if (sound) {
        await sound.replayAsync();
      }
    } catch (error) {
      console.log('Error reproduciendo sonido:', error);
    }
  };

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${NASA_KEY}&count=2`);
      const data = await res.json();
      const dynamic: Question[] = data.map((item: any) => ({
        question: `¿Cuál es el título de la imagen del día mostrada?`,
        options: [item.title, 'Nebulosa del Cangrejo', 'Galaxia de Andrómeda', 'Superficie de Marte'],
        correctAnswer: 0,
        explanation: item.explanation?.slice(0, 150) + '...',
        image: item.url
      }));
      const all = [...dynamic, ...staticQuestions].sort(() => Math.random() - 0.5).slice(0, 8);
      setQuestions(all);
    } catch {
      setQuestions(staticQuestions);
    } finally {
      setCurrent(0);
      setScore(0);
      setSelected(null);
      setShowResult(false);
      setShowScore(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSounds();
    fetchQuestions();
  }, []);

  const handleAnswer = (i: number) => {
    setSelected(i);
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();

    setTimeout(() => {
      setShowResult(true);
      const isCorrect = questions[current]?.correctAnswer === i;
      
      // Reproducir sonido según si es correcto o no
      playSound(isCorrect ? 'correct' : 'wrong');
      
      if (isCorrect) {
        setScore(prev => prev + 1);
      }
    }, 300);
  };

  const nextQuestion = () => {
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
      setSelected(null);
      setShowResult(false);
    } else {
      setShowScore(true);
      // Reproducir sonido de finalización
      playSound('finish');
    }
  };

  const restart = () => {
    fetchQuestions(); // vuelve a cargar
  };

  if (loading || !questions[current]) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Cargando preguntas...</Text>
      </View>
    );
  }

  if (showScore) {
    return (
      <View style={styles.centered}>
        <Text style={styles.title}>🎉 ¡Completado!</Text>
        <Text style={styles.score}>Puntaje: {score} de {questions.length}</Text>

        <TouchableOpacity onPress={restart} style={styles.button}>
          <Text style={styles.buttonText}>🔄 Jugar de nuevo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.replace('/')}
          style={[styles.button, { backgroundColor: '#D9534F', marginTop: 10 }]}
        >
          <Text style={styles.buttonText}>Menú Principal</Text>
        </TouchableOpacity>
      </View>
    );
  }



  const q = questions[current];

  return (
    <LinearGradient colors={['#0B1426', '#1A2B4C']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.counter}>Pregunta {current + 1} de {questions.length}</Text>
        <Text style={styles.question}>{q.question}</Text>

        {q.image && <Image source={{ uri: q.image }} style={styles.image} />}

        {q.options.map((opt, i) => (
          <TouchableOpacity
            key={i}
            style={[
              styles.option,
              selected === i && styles.selected,
              showResult && i === q.correctAnswer && styles.correct,
              showResult && selected === i && i !== q.correctAnswer && styles.incorrect
            ]}
            onPress={() => !showResult && handleAnswer(i)}
            disabled={showResult}
          >
            <Text style={styles.optionText}>{opt}</Text>
          </TouchableOpacity>
        ))}

        {showResult && (
          <View style={styles.explanation}>
            <Text style={styles.explanationText}>{q.explanation}</Text>
            <TouchableOpacity style={styles.button} onPress={nextQuestion}>
              <Text style={styles.buttonText}>{current + 1 < questions.length ? 'Siguiente' : 'Ver resultados'}</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0B1426' },
  loadingText: { color: '#FFF', marginTop: 15, fontSize: 16 },
  title: { color: '#FFF', fontSize: 28, marginBottom: 20 },
  score: { color: '#4A90E2', fontSize: 22, marginBottom: 30 },
  question: { color: '#FFF', fontSize: 20, marginBottom: 20, textAlign: 'center' },
  counter: { color: '#4A90E2', fontSize: 16, marginBottom: 10, textAlign: 'center' },
  image: { width: '100%', height: 200, borderRadius: 10, marginBottom: 20 },
  option: {
    backgroundColor: '#1A2B4C',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#4A90E2'
  },
  selected: { backgroundColor: '#4A90E255' },
  correct: { backgroundColor: '#4CAF50AA' },
  incorrect: { backgroundColor: '#F44336AA' },
  optionText: { color: '#FFF', fontSize: 16, textAlign: 'center' },
  explanation: { marginTop: 20, backgroundColor: '#1A2B4C', padding: 15, borderRadius: 10 },
  explanationText: { color: '#FFF', textAlign: 'center', marginBottom: 15 },
  
  
  button: {
    backgroundColor: '#1A2B4C',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    width: '80%',
    alignSelf: 'center',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },

  buttonMenu: {
    backgroundColor: '#D9534F',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    width: '80%',
    alignSelf: 'center',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },

  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 1,
  },

});

export default SpaceTriviaGame;