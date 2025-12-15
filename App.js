import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; 


import AnaSayfa from './src/screens/Anasayfa'; 
import Raporlar from './src/screens/Raporlar';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    
    <NavigationContainer>
    
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            
            
            if (route.name === 'Zamanlayıcı') {
              iconName = focused ? 'timer' : 'timer-outline';
            } else if (route.name === 'İstatistikler') {
              iconName = focused ? 'bar-chart' : 'bar-chart-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato', 
          tabBarInactiveTintColor: 'gray',  
          headerShown: true, 
        })}
      >
       
        <Tab.Screen 
          name="Zamanlayıcı" 
          component={AnaSayfa}
          options={{ title: 'Zamanlayıcı Ekranı' }} 
        />
        
       
        <Tab.Screen 
          name="İstatistikler" 
          component={Raporlar} 
          options={{ title: 'Raporlar Ekranı' }}
        />
        
      </Tab.Navigator>
    </NavigationContainer>
  );
}

