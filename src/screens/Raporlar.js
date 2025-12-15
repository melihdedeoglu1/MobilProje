import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, RefreshControl } from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; 

import { getSessions } from '../services/Dataservice';
import { calculateStats, formatDuration } from '../utils/Statistichelper';

const screenWidth = Dimensions.get('window').width;

export default function Raporlar() {
  const [stats, setStats] = useState({
      totalToday: 0,
      totalAllTime: 0,
      totalDistractions: 0,
      categoryTotals: {},
      lastSevenDays: Array(7).fill(0),
  });
  const [lastSession, setLastSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); 
  
  const loadData = async () => {
    setLoading(true);
    try {
        const sessions = await getSessions();

        const calculatedStats = calculateStats(sessions);
        setStats(calculatedStats);

        if (sessions && sessions.length > 0) {
            setLastSession(sessions[0]);
        } else {
            setLastSession(null);
        }

    } catch (error) {
        console.error("Hata:", error);
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

  const maxValueInSeconds = Math.max(...stats.lastSevenDays);
  const useSeconds = maxValueInSeconds < 180 && maxValueInSeconds > 0;
  const chartUnit = useSeconds ? " sn" : " dk";

  const chartData = stats.lastSevenDays.map(s => {
      if (s === 0) return 0;
      return useSeconds ? s : parseFloat((s / 60).toFixed(1)); 
  });

  const barData = {
    labels: ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"],
    datasets: [{ data: chartData }]
  };

  const pieDataRaw = Object.keys(stats.categoryTotals).map((category, index) => {
    const totalSeconds = stats.categoryTotals[category];
    const colors = ["#4F8EF7", "#FF7F50", "#2ecc71", "#9b59b6", "#f1c40f", "#34495e"]; 
    
    return {
      name: category,
      population: totalSeconds,
      color: colors[index % colors.length],
      legendFontColor: "#7F7F7F",
      legendFontSize: 12
    };
  }).filter(data => data.population > 0);

  const totalDuration = pieDataRaw.reduce((acc, curr) => acc + curr.population, 0);

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: useSeconds ? 0 : 1, 
    color: (opacity = 1) => `rgba(79, 142, 247, ${opacity})`, 
    labelColor: (opacity = 1) => `rgba(0, 0, 0, 0.6)`,
    style: { borderRadius: 16 },
    barPercentage: 0.6, 
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#f4f6f8'}}>
        <ScrollView 
            style={styles.scrollContainer} 
            contentContainerStyle={styles.contentContainer}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
        >
            <View style={styles.headerContainer}>
                <Text style={styles.title}>📊 Performans Raporu</Text>
            </View>

            {lastSession && (
                <View style={[styles.card, styles.lastSessionCard]}>
                    <View style={styles.cardHeader}>
                         <Ionicons name="time-outline" size={22} color="#fff" />
                         <Text style={[styles.cardTitle, {color: '#fff'}]}>Son Seans Özeti</Text>
                    </View>
                    <View style={styles.lastSessionInfo}>
                        <View>
                            <Text style={styles.lastSessionLabel}>Kategori</Text>
                            <Text style={styles.lastSessionValue}>{lastSession.category}</Text>
                        </View>
                        <View style={{alignItems: 'flex-end'}}>
                            <Text style={styles.lastSessionLabel}>Süre</Text>
                            <Text style={styles.lastSessionValue}>{formatDuration(lastSession.duration)}</Text>
                        </View>
                    </View>
                    <Text style={styles.lastSessionDate}>
                        {new Date(lastSession.date).toLocaleString('tr-TR')}
                    </Text>
                </View>
            )}

            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Ionicons name="stats-chart" size={20} color="#4F8EF7" />
                    <Text style={styles.cardTitle}>Genel Durum</Text>
                </View>
                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Bugün</Text>
                        <Text style={styles.statValue}>{formatDuration(stats.totalToday)}</Text>
                    </View>
                    <View style={styles.separator} />
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Toplam</Text>
                        <Text style={styles.statValue}>{formatDuration(stats.totalAllTime)}</Text>
                    </View>
                    <View style={styles.separator} />
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Dikkat Dağ.</Text>
                        <Text style={[styles.statValue, {color: '#e74c3c'}]}>{stats.totalDistractions}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Ionicons name="calendar" size={20} color="#4F8EF7" />
                    <Text style={styles.cardTitle}>Son 7 Gün ({useSeconds ? 'Saniye' : 'Dakika'})</Text>
                </View>
                {stats.totalAllTime > 0 ? (
                    <BarChart
                        data={barData}
                        width={screenWidth - 60} 
                        height={220}
                        yAxisLabel=""
                        yAxisSuffix={chartUnit} 
                        chartConfig={chartConfig}
                        style={styles.chart}
                        showValuesOnTopOfBars={true} 
                        fromZero={true}
                    />
                ) : (
                    <Text style={styles.noDataText}>Veri bulunamadı.</Text>
                )}
            </View>

            {stats.totalAllTime > 0 && pieDataRaw.length > 0 && (
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="pie-chart" size={20} color="#4F8EF7" />
                        <Text style={styles.cardTitle}>Kategori Dağılımı</Text>
                    </View>
                    
                    <View style={{alignItems: 'center'}}>
                        <PieChart
                            data={pieDataRaw}
                            width={screenWidth - 60}
                            height={200}
                            chartConfig={chartConfig}
                            accessor={"population"} 
                            backgroundColor={"transparent"}
                            paddingLeft={"0"}
                            center={[screenWidth / 4.5, 0]} 
                            absolute={false}
                            hasLegend={false} 
                        />
                    </View>

                    <View style={styles.customLegendContainer}>
                        {pieDataRaw.map((item, index) => {
                            const percent = ((item.population / totalDuration) * 100).toFixed(0);
                            const durationText = useSeconds 
                                ? `${item.population} sn` 
                                : `${(item.population / 60).toFixed(1)} dk`;

                            return (
                                <View key={index} style={styles.legendItem}>
                                    <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                                    <View style={styles.legendTextContainer}>
                                        <Text style={styles.legendTitle}>
                                            %{percent} {item.name}
                                        </Text>
                                        <Text style={styles.legendSubtitle}>
                                            ({durationText})
                                        </Text>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                </View>
            )}
            
            <View style={{height: 30}} />
        </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    scrollContainer: { flex: 1 },
    contentContainer: { padding: 20 },
    headerContainer: { marginBottom: 15 },
    title: { fontSize: 26, fontWeight: 'bold', color: '#2c3e50' },
    
    card: {
        backgroundColor: '#fff', borderRadius: 16, padding: 15, marginBottom: 20,
        shadowColor: "#000", shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1, shadowRadius: 8, elevation: 5,
    },
    lastSessionCard: {
        backgroundColor: '#4F8EF7',
    },
    lastSessionInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        marginBottom: 10
    },
    lastSessionLabel: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
        marginBottom: 2
    },
    lastSessionValue: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold'
    },
    lastSessionDate: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 11,
        textAlign: 'right',
        fontStyle: 'italic'
    },

    cardHeader: {
        flexDirection: 'row', alignItems: 'center', marginBottom: 15,
        borderBottomWidth: 1, borderBottomColor: '#f0f0f0', paddingBottom: 10,
    },
    cardTitle: { fontSize: 18, fontWeight: '600', color: '#34495e', marginLeft: 10 },

    statsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    statItem: { alignItems: 'center', flex: 1 },
    separator: { width: 1, height: '80%', backgroundColor: '#eee' },
    statLabel: { fontSize: 12, color: '#95a5a6', marginBottom: 5, textTransform: 'uppercase' },
    statValue: { fontSize: 18, fontWeight: 'bold', color: '#2c3e50' },
    
    chart: { borderRadius: 16, marginVertical: 8 },
    noDataText: { textAlign: 'center', color: '#95a5a6', marginVertical: 20 },

    customLegendContainer: {
        marginTop: 10,
        flexDirection: 'column',
        width: '100%',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        width: '100%',
    },
    colorDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 10,
    },
    legendTextContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1,
        flexWrap: 'wrap' 
    },
    legendTitle: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
    legendSubtitle: {
        fontSize: 14,
        color: '#7f8c8d',
        marginLeft: 5
    }
});