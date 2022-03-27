import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, Text, View } from 'react-native';

// import Form from './components/Form';
import Home from './components/Home';
import Form from './components/Form';

const Stack = createStackNavigator();

// function App() {

//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="Form">

//         <Stack.Screen name="Form" component={Form} />
//         <Stack.Screen name="Home" component={Home} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

// export default App;

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ title: 'Accueil Simplon Ville' }}
        />

        <Stack.Screen
          name="Form"
          component={Form}
          options={{ title: 'Faire un signalement' }} 
          />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;