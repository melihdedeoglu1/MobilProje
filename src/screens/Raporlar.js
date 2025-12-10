import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit'; 
import { SafeAreaView } from 'react-native-safe-area-context';


const screenWidth = Dimensions.get('window').width;


const chartConfig = {
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#fff",
  decimalPlaces: 0, 
  color: (opacity = 1) => `rgba(0, 100, 255, ${opacity})`, 
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: {
    borderRadius: 16
  }
};


const barData = {
  labels: ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"],
  datasets: [{
    data: [120, 45, 28, 80, 99, 43, 65] 
  }]
};

const pieData = [
  { name: "Kodlama", population: 50, color: "#4F8EF7", legendFontColor: "#7F7F7F", legendFontSize: 15 },
  { name: "Ders Çalışma", population: 30, color: "#FF7F50", legendFontColor: "#7F7F7F", legendFontSize: 15 },
  { name: "Proje", population: 20, color: "#3CB371", legendFontColor: "#7F7F7F", legendFontSize: 15 }
];


export default function Raporlar() {
  
  const [totalToday, setTotalToday] = useState('0 dk');
  const [totalAllTime, setTotalAllTime] = useState('0 dk');
  const [totalDistractions, setTotalDistractions] = useState(0);

  
  return (
    <SafeAreaView style={{flex: 1}}>
        <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer}>
            
            <Text style={styles.title}>📈 Odaklanma Raporu</Text>
            
            
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Genel İstatistikler</Text>
                <View style={styles.statsBox}>
                    <Text style={styles.statText}>Bugün Toplam Odaklanma Süresi: <Text style={styles.valueText}>{totalToday}</Text> [cite: 28]</Text>
                    <Text style={styles.statText}>Tüm Zamanların Toplam Odaklanma Süresi: <Text style={styles.valueText}>{totalAllTime}</Text> [cite: 30]</Text>
                    <Text style={styles.statText}>Toplam Dikkat Dağınıklığı Sayısı: <Text style={styles.valueText}>{totalDistractions}</Text> [cite: 31]</Text>
                </View>
            </View>

            
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Son 7 Günlük Odaklanma Süreleri (dk) [cite: 34]</Text>
                <BarChart
                    data={barData}
                    width={screenWidth - 40} 
                    height={220}
                    chartConfig={chartConfig}
                    style={styles.chart}
                    verticalLabelRotation={30}
                />
            </View>

            
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Kategorilere Göre Dağılım [cite: 35]</Text>
                <PieChart
                    data={pieData}
                    width={screenWidth}
                    height={220}
                    chartConfig={chartConfig}
                    accessor={"population"} 
                    backgroundColor={"transparent"}
                    paddingLeft={"15"}
                    center={[10, 0]}
                    absolute 
                />
            </View>
            
        </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
        backgroundColor: '#f8f8f8', 
    },
    contentContainer: {
        padding: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginVertical: 20,
        color: '#2c3e50',
    },
    section: {
        width: '100%',
        marginBottom: 20,
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 10,
        color: '#34495e',
    },
    statsBox: {
        alignItems: 'flex-start',
    },
    statText: {
        fontSize: 16,
        marginBottom: 8,
        color: '#555',
    },
    valueText: {
        fontWeight: 'bold',
        color: '#2980b9',
    },
    chart: {
        marginVertical: 8,
        borderRadius: 10,
    }
});