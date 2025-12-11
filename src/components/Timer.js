import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  AppState, 
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
        category: category || 'Belirtilmemiş', 
        distractions: distractionCount,
        isFinished: isFinished, 
      };


      saveSession(newSession); 
      
      
      alert(
        `Seans Özeti:\n` +
        `Süre: ${formattedDuration}\n` +
        `Kategori: ${newSession.category}\n` +
        `Dikkat Dağınıklığı Sayısı: ${distractionCount}`
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
  }, [isRunning, timeRemaining, category]); 

  
  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      
      
      if (
        appState.current === 'active' && 
        (nextAppState === 'background' || nextAppState === 'inactive') 
      ) {
        
        if (isRunning) {
          
          setIsRunning(false); 
          setDistractionCount(prev => prev + 1);
          
          alert("UYARI: Uygulamadan ayrıldınız. Seans duraklatıldı ve dikkat dağınıklığı kaydedildi.");
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
    
    handleStopSession(false); 
  };

 
  const startPauseText = isRunning ? 'Duraklat' : (timeRemaining === DEFAULT_TIME ? 'Başlat' : 'Devam Et');

  return (
    <View style={styles.container}>
      
      <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
      
      <Text style={styles.distractionText}>
        Dikkat Dağınıklığı Sayısı: <Text style={{ fontWeight: 'bold', color: '#ff4500' }}>{distractionCount}</Text>
      </Text>

      
      <View style={styles.buttonContainer}>
        
        <TouchableOpacity style={styles.button} onPress={handleStartPause}>
          <Text style={styles.buttonText}>{startPauseText}</Text>
        </TouchableOpacity>
        
        
        <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={handleReset}>
          <Text style={styles.buttonText}>Bitir / Sıfırla</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
  },
  timerText: {
    fontSize: 80,
    fontWeight: '300',
    color: '#1e90ff',
    marginBottom: 30,
    marginTop: 20,
  },
  distractionText: { 
    fontSize: 16,
    color: '#888',
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '80%',
    justifyContent: 'space-around',
  },
  button: {
    backgroundColor: '#32cd32',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    minWidth: 120,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  resetButton: {
    backgroundColor: '#ff4500',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Timer;