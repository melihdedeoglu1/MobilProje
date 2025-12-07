import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import Timer from '../components/Timer'; 

const AnaSayfa = () => {
  return (
    
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}> 
        <View style={styles.container}>
            <Text style={styles.header}>🧠 Odaklanma Zamanlayıcısı</Text>
            
            
            <Text style={styles.categoryInfo}>Kategori: Kodlama (Şimdilik Sabit)</Text>
            
            
            <Timer />

            

        </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  categoryInfo: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  }
});

export default AnaSayfa;