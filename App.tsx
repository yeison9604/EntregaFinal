/*import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import HomeScreen from "./src/screens/HomeScreen";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ title: "Registro" }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Inicio" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );*/

  import React, { useState, useEffect } from "react";
  import { NavigationContainer } from "@react-navigation/native";
  import { createStackNavigator, StackScreenProps } from "@react-navigation/stack";
  import { getAuth, onAuthStateChanged, User } from "firebase/auth";
  import LoginScreen from "./src/screens/LoginScreen";
  import RegisterScreen from "./src/screens/RegisterScreen";
  import HomeScreen from "./src/screens/HomeScreen";
  import RequestsScreen from "./src/screens/RequestsScreen"; 
  import ProfileScreen from "./src/screens/ProfileScreen";
  import ForgotPasswordScreen from "./src/screens/ForgotPasswordScreen";
  import CheckEmailScreen from "./src/screens/CheckEmailScreen";
  import AboutScreen from "./src/screens/AboutScreen";
  import { initializeApp } from "firebase/app";
  import { firebaseConfig } from "./src/config/firebaseConfig";
  import { AppRegistry } from "react-native";
  
  // Inicializar Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  
  
  type RootStackParamList = {
    Home: undefined;
    RequestsScreen: undefined;
    Login: undefined;
    Register: undefined;
  };
  
  const Stack = createStackNavigator<RootStackParamList>();
  
  const App = () => {
    const [user, setUser] = useState<User | null>(null);
  
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
      });
  
      return () => unsubscribe();
    }, []);
  
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {user ? (
            <>
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="RequestsScreen" component={RequestsScreen} />
              <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
              <Stack.Screen name="AboutScreen" component={AboutScreen} />
              
            </>
          ) : (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
              <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
              <Stack.Screen name="CheckEmail" component={CheckEmailScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    );
  };
  
  export default App;
  
  AppRegistry.registerComponent("main", () => App);