import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Timer from '../components/Timer'; 

const CATEGORIES = ["Kodlama", "Ders Çalışma", "Kitap Okuma", "Proje", "Spor"];

const AnaSayfa = () => {
  const [selectedCategory, setSelectedCategory] = useState("Kodlama");

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}> 
        <View style={styles.container}>
            <Text style={styles.header}>Odaklanma Zamanlayıcısı</Text>
            
            <View style={styles.categoryContainer}>
                <Text style={styles.subHeader}>Kategori Seçin:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollList}>
                    {CATEGORIES.map((cat, index) => (
                        <TouchableOpacity 
                            key={index} 
                            style={[
                                styles.categoryButton, 
                                selectedCategory === cat && styles.categoryButtonActive
                            ]}
                            onPress={() => setSelectedCategory(cat)}
                        >
                            <Text style={[
                                styles.categoryText,
                                selectedCategory === cat && styles.categoryTextActive
                            ]}>
                                {cat}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
            
            <View style={styles.timerContainer}>
                <Timer category={selectedCategory} />
            </View>

        </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  categoryContainer: {
    height: 80,
    width: '100%',
    paddingHorizontal: 20,
  },
  subHeader: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '600'
  },
  scrollList: {
    flexDirection: 'row',
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    height: 40,
    justifyContent: 'center'
  },
  categoryButtonActive: {
    backgroundColor: '#4F8EF7',
    borderColor: '#4F8EF7',
  },
  categoryText: {
    color: '#555',
    fontWeight: '500'
  },
  categoryTextActive: {
    color: '#fff',
    fontWeight: 'bold'
  },
  timerContainer: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  }
});

export default AnaSayfa;