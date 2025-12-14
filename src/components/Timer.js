import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  AppState, 
  Alert,
  Modal,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { saveSession } from '../services/Dataservice'; 

const Timer = ({ category }) => { 
  
  const DEFAULT_TIME = 25 * 60; 

  const [timeRemaining, setTimeRemaining] = useState(DEFAULT_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [distractionCount, setDistractionCount] = useState(0); 
  const [modalVisible, setModalVisible] = useState(false); 
  const [lastSessionData, setLastSessionData] = useState(null);

  const appState = useRef(AppState.currentState); 

  const formatTime = (totalSeconds) => {
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  };


  const progressPercent = (timeRemaining / DEFAULT_TIME) * 100;
  
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
      
      
      setLastSessionData({
        duration: formattedDuration,
        category: newSession.category,
        distractions: distractionCount,
        isFinished: isFinished
      });
      setModalVisible(true);
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

  
  const timerColor = timeRemaining < 60 ? '#e74c3c' : '#2c3e50';

  return (
    <View style={styles.container}>
      
      
      <View style={[styles.timerCircle, { borderColor: isRunning ? '#4F8EF7' : '#e0e0e0' }]}>
        <Text style={[styles.timerText, { color: timerColor }]}>
            {formatTime(timeRemaining)}
        </Text>
        <Text style={styles.categoryLabel}>{category}</Text>
        
       
        <View style={styles.progressBarContainer}>
            <View style={[styles.progressBarFill, { width: `${progressPercent}%`, backgroundColor: timerColor }]} />
        </View>
      </View>
      
      <View style={styles.distractionContainer}>
        <Ionicons name="eye-off-outline" size={20} color="#888" />
        <Text style={styles.distractionText}>
             Dikkat Dağınıklığı: <Text style={styles.distractionCount}>{distractionCount}</Text>
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
            style={[styles.button, isRunning ? styles.pauseButton : styles.startButton]} 
            onPress={handleStartPause}
        >
          <Ionicons name={isRunning ? "pause" : "play"} size={24} color="#fff" />
          <Text style={styles.buttonText}>{isRunning ? 'Duraklat' : 'Başlat'}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={handleReset}>
          <Ionicons name="stop" size={24} color="#fff" />
          <Text style={styles.buttonText}>Bitir</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
            <View style={styles.modalView}>
                <Ionicons 
                    name={lastSessionData?.isFinished ? "checkmark-circle" : "flag"} 
                    size={60} 
                    color={lastSessionData?.isFinished ? "#2ecc71" : "#f1c40f"} 
                />
                <Text style={styles.modalTitle}>
                    {lastSessionData?.isFinished ? "Tebrikler! 🎉" : "Seans Sonlandırıldı"}
                </Text>
                
                <View style={styles.modalInfoContainer}>
                    <Text style={styles.modalInfoText}>⏱ Süre: {lastSessionData?.duration}</Text>
                    <Text style={styles.modalInfoText}>📂 Kategori: {lastSessionData?.category}</Text>
                    <Text style={styles.modalInfoText}>👀 Dikkat Dağınıklığı: {lastSessionData?.distractions}</Text>
                </View>

                <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => setModalVisible(false)}
                >
                    <Text style={styles.modalButtonText}>Tamam</Text>
                </TouchableOpacity>
            </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
  },
  timerCircle: {
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
    backgroundColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  timerText: {
    fontSize: 65,
    fontWeight: '300',
    marginBottom: 5,
  },
  categoryLabel: {
    fontSize: 20,
    color: '#95a5a6',
    fontWeight: '600',
    marginBottom: 15,
  },
  progressBarContainer: {
    width: '60%',
    height: 6,
    backgroundColor: '#ecf0f1',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  distractionContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 25,
      backgroundColor: '#f8f9fa',
      padding: 8,
      borderRadius: 20,
      paddingHorizontal: 15
  },
  distractionText: { 
    fontSize: 16,
    color: '#7f8c8d',
    marginLeft: 8
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
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    minWidth: 140,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  startButton: {
    backgroundColor: '#3498db',
  },
  pauseButton: {
      backgroundColor: '#f39c12'
  },
  resetButton: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },

  modalOverlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.5)"
  },
  modalView: {
      margin: 20,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
          width: 0,
          height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      width: '80%'
  },
  modalTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      marginVertical: 15,
      color: '#333'
  },
  modalInfoContainer: {
      width: '100%',
      marginBottom: 20,
  },
  modalInfoText: {
      fontSize: 16,
      color: '#555',
      marginBottom: 5,
      textAlign: 'center'
  },
  modalButton: {
      backgroundColor: "#2196F3",
      borderRadius: 20,
      padding: 10,
      elevation: 2,
      paddingHorizontal: 30
  },
  modalButtonText: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center"
  }
});

export default Timer;