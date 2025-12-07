import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';


const DEFAULT_TIME = 25 * 60; 

const Timer = () => {
  
  const [timeRemaining, setTimeRemaining] = useState(DEFAULT_TIME);
  
  const [isRunning, setIsRunning] = useState(false);

  
  const formatTime = (totalSeconds) => {
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  
  useEffect(() => {
    let interval = null;

    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prevTime => prevTime - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      
      setIsRunning(false);
      alert("Odaklanma Seansı Tamamlandı!");
  
    }

    
    return () => clearInterval(interval);
  }, [isRunning, timeRemaining]); 

  
  const handleStartPause = () => {
    setIsRunning(prev => !prev);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeRemaining(DEFAULT_TIME);
  };

  // Buton Metni
  const startPauseText = isRunning ? 'Duraklat' : (timeRemaining === DEFAULT_TIME ? 'Başlat' : 'Devam Et');

  return (
    <View style={styles.container}>
      
      <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>

      
      <View style={styles.buttonContainer}>
       
        <TouchableOpacity style={styles.button} onPress={handleStartPause}>
          <Text style={styles.buttonText}>{startPauseText}</Text>
        </TouchableOpacity>
        
        
        <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={handleReset}>
          <Text style={styles.buttonText}>Sıfırla</Text>
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