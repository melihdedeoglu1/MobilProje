import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  AppState, 
  Alert
} from 'react-native';
import { saveSession } from '../services/Dataservice'; 

const Timer = ({ category }) => { 
  
  const DEFAULT_TIME = 25 * 60; 

  const [timeRemaining, setTimeRemaining] = useState(DEFAULT_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [distractionCount, setDistractionCount] = useState(0); 
  
  const appState = useRef(AppState.currentState); 

  const formatTime = (totalSeconds) => {
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  };
  
  const handleStopSession = (isFinished = false) => {
    setIsRunning(false);
    
    
    if (timeRemaining < DEFAULT_TIME) {
      const sessionDuration = DEFAULT_TIME - timeRemaining; 
      const formattedDuration = formatTime(sessionDuration);

      const newSession = {
        id: Date.now(),
        date: new Date().toISOString(),
        duration: sessionDuration, 
        category: category || 'Genel', 
        distractions: distractionCount,
        isFinished: isFinished, 
      };

      saveSession(newSession); 
      
      Alert.alert(
        "Seans Tamamlandı",
        `Süre: ${formattedDuration}\nKategori: ${newSession.category}\nDikkat Dağınıklığı: ${distractionCount}`,
        [{ text: "Tamam" }]
      );
    }

    setTimeRemaining(DEFAULT_TIME);
    setDistractionCount(0);
  };

  useEffect(() => {
    let interval = null;
    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prevTime => prevTime - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      handleStopSession(true); 
    }
    return () => clearInterval(interval);
  }, [isRunning, timeRemaining]); 

  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (
        appState.current === 'active' && 
        (nextAppState === 'background' || nextAppState === 'inactive') 
      ) {
        if (isRunning) {
          setIsRunning(false); 
          setDistractionCount(prev => prev + 1);
        }
      }
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      subscription.remove();
    };
  }, [isRunning]); 

  const handleStartPause = () => {
    setIsRunning(prev => !prev);
  };

  const handleReset = () => {
    Alert.alert(
        "Seansı Bitir", 
        "Seansı sonlandırmak ve kaydetmek istiyor musunuz?",
        [
            { text: "Vazgeç", style: "cancel" },
            { text: "Bitir", onPress: () => handleStopSession(false) }
        ]
    );
  };

  const startPauseText = isRunning ? 'Duraklat ⏸' : (timeRemaining === DEFAULT_TIME ? 'Başlat ▶️' : 'Devam Et ▶️');

  return (
    <View style={styles.container}>

      <View style={styles.timerCircle}>
        <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
        <Text style={styles.categoryLabel}>{category}</Text>
      </View>
      
      <Text style={styles.distractionText}>
        Dikkat Dağınıklığı: <Text style={styles.distractionCount}>{distractionCount}</Text>
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
            style={[styles.button, isRunning ? styles.pauseButton : styles.startButton]} 
            onPress={handleStartPause}
        >
          <Text style={styles.buttonText}>{startPauseText}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={handleReset}>
          <Text style={styles.buttonText}>Bitir ⏹</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
  },
  timerCircle: {
    width: 250,
    height: 250,
    borderRadius: 125,
    borderWidth: 5,
    borderColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
    backgroundColor: '#fafafa'
  },
  timerText: {
    fontSize: 60,
    fontWeight: '200',
    color: '#2c3e50',
  },
  categoryLabel: {
    fontSize: 18,
    color: '#7f8c8d',
    marginTop: 5,
    fontWeight: '500'
  },
  distractionText: { 
    fontSize: 16,
    color: '#888',
    marginBottom: 20,
  },
  distractionCount: {
    fontWeight: 'bold', 
    color: '#e74c3c',
    fontSize: 18
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-around',
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
    minWidth: 130,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  startButton: {
    backgroundColor: '#2ecc71',
  },
  pauseButton: {
      backgroundColor: '#f1c40f'
  },
  resetButton: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Timer;