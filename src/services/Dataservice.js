import AsyncStorage from '@react-native-async-storage/async-storage';


const STORAGE_KEY = '@FocusSessions'; 


export const saveSession = async (session) => {
  try {
    
    const existingSessions = await getSessions();
    
   
    const updatedSessions = [session, ...existingSessions];
    
    
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSessions));
    
    console.log('Seans başarıyla kaydedildi.');
  } catch (e) {
    console.error('Seans kaydederken hata oluştu:', e);
  }
};


export const getSessions = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Seansları okurken hata oluştu:', e);
    return [];
  }
};


export const clearAllSessions = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
    console.log('Tüm seanslar temizlendi.');
  } catch (e) {
    console.error('Seansları temizlerken hata oluştu:', e);
  }
};


export default {
    saveSession,
    getSessions,
    clearAllSessions,
};