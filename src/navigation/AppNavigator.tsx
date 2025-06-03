/*import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Screens
import HomeScreen from "../screens/HomeScreen";
import RequestsScreen from "../screens/RequestsScreen";
import RequestDetailScreen from "../screens/RequestDetailScreen";
import CreatedRequestsScreen from "../screens/CreatedRequestsScreen";
import CreateRequestScreen from "../screens/CreateRequestsScreen";

// Tipado de las rutas
export type RootStackParamList = {
  Home: undefined;
  Requests: undefined;
  RequestDetail: { requestId: string; title: string };
  CreatedRequests: undefined;
  CreateRequest: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Requests" component={RequestsScreen} />
        <Stack.Screen name="RequestDetail" component={RequestDetailScreen} />
        <Stack.Screen name="CreatedRequests" component={CreatedRequestsScreen} />
        <Stack.Screen name="CreateRequest" component={CreateRequestScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;*/

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RequestsScreen from "../screens/RequestsScreen";
import RequestDetailScreen from "../screens/RequestDetailScreen";
import CreatedRequestsScreen from "../screens/CreatedRequestsScreen";
import CreateRequestScreen from "../screens/CreateRequestsScreen";
import HomeScreen from '../screens/HomeScreen';

export type RootStackParamList = {
  Home: undefined;
  Requests: undefined;
  RequestDetail: { requestId: string; title: string };
  CreatedRequests: undefined;
  CreateRequest: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Requests" component={RequestsScreen} />
        <Stack.Screen name="RequestDetail" component={RequestDetailScreen} />
        <Stack.Screen name="CreatedRequests" component={CreatedRequestsScreen} />
        <Stack.Screen name="CreateRequest" component={CreateRequestScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;