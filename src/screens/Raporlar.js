import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, RefreshControl } from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import { getSessions } from '../services/Dataservice';
import { calculateStats, formatDuration } from '../utils/Statistichelper';

const screenWidth = Dimensions.get('window').width;

const DAYS_OF_WEEK = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

const chartConfig = {
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#fff",
  decimalPlaces: 0, 
  color: (opacity = 1) => `rgba(0, 100, 255, ${opacity})`, 
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: {
    borderRadius: 16
  },
  propsForBackgroundLines: {
    strokeDasharray: "", 
  }
};

export default function Raporlar() {
  const [stats, setStats] = useState({
      totalToday: 0,
      totalAllTime: 0,
      totalDistractions: 0,
      categoryTotals: {},
      lastSevenDays: Array(7).fill(0),
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); 
  
  const loadData = async () => {
    setLoading(true);
    try {
        const sessions = await getSessions();
        const calculatedStats = calculateStats(sessions);
        setStats(calculatedStats);
    } catch (error) {
        console.error("Rapor verileri yüklenirken hata:", error);
    }
    setLoading(false);
  };
  
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );
  
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadData().then(() => setRefreshing(false));
  }, []);

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Rapor verileri yükleniyor...</Text>
      </View>
    );
  }
  
  const barData = {
    labels: DAYS_OF_WEEK,
    datasets: [{
      data: stats.lastSevenDays.map(s => Math.floor(s / 60)), 
    }]
  };
  
  const pieData = Object.keys(stats.categoryTotals).map((category, index) => {
    const durationInMinutes = Math.floor(stats.categoryTotals[category] / 60);
    const colors = ["#4F8EF7", "#FF7F50", "#3CB371", "#DA70D6", "#FFA07A", "#20B2AA"]; 

    return {
      name: category,
      population: durationInMinutes,
      color: colors[index % colors.length],
      legendFontColor: "#7F7F7F",
      legendFontSize: 13
    };
  }).filter(data => data.population > 0); 

  return (
    <SafeAreaView style={{flex: 1}}>
        <ScrollView 
            style={styles.scrollContainer} 
            contentContainerStyle={styles.contentContainer}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
        >
            <Text style={styles.title}>📈 Odaklanma Raporu</Text>
            
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Genel İstatistikler</Text>
                <View style={styles.statsBox}>
                    <Text style={styles.statText}>Bugün Toplam: <Text style={styles.valueText}>{formatDuration(stats.totalToday)}</Text></Text>
                    <Text style={styles.statText}>Tüm Zamanlar: <Text style={styles.valueText}>{formatDuration(stats.totalAllTime)}</Text></Text>
                    <Text style={styles.statText}>Toplam Dikkat Dağınıklığı: <Text style={styles.valueText}>{stats.totalDistractions}</Text></Text>
                </View>
            </View>

           
            {stats.totalAllTime > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Son 7 Günlük Süreler (dk)</Text>
                    <BarChart
                        data={barData}
                        width={screenWidth - 40}
                        height={220}
                        yAxisLabel=""
                        yAxisSuffix=" dk"
                        chartConfig={chartConfig}
                        style={styles.chart}
                        verticalLabelRotation={0}
                        fromZero={true}
                        showBarTops={false}
                        showValuesOnTopOfBars={true} 
                    />
                </View>
            )}

            
            {stats.totalAllTime > 0 && pieData.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Kategorilere Göre Dağılım</Text>
                    <PieChart
                        data={pieData}
                        width={screenWidth}
                        height={220}
                        chartConfig={chartConfig}
                        accessor={"population"} 
                        backgroundColor={"transparent"}
                        paddingLeft={"15"}
                        center={[0, 0]}
                        
                    />
                </View>
            )}
            
            {stats.totalAllTime === 0 && !loading && (
                 <Text style={styles.noDataText}>Henüz kaydedilmiş bir seansınız bulunmamaktadır.</Text>
            )}
            
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
        paddingBottom: 50
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginVertical: 15,
        color: '#2c3e50',
    },
    section: {
        width: '100%',
        marginBottom: 20,
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 15,
        color: '#34495e',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 5
    },
    statsBox: {
        alignItems: 'flex-start',
    },
    statText: {
        fontSize: 16,
        marginBottom: 10,
        color: '#555',
    },
    valueText: {
        fontWeight: 'bold',
        color: '#2980b9',
    },
    chart: {
        marginVertical: 8,
        borderRadius: 16,
    },
    noDataText: {
        marginTop: 50,
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
    }
});