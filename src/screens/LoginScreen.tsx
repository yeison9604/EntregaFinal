import React, { useState } from "react";
import { View, TextInput, Button, Text, Alert, StyleSheet } from "react-native";
import { loginUser } from "../services/authService";

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await loginUser(email, password);
      Alert.alert("Inicio de sesión exitoso", "Bienvenido a la app");
      navigation.navigate("Home");
    } catch (error: any) {
      console.log("Firebase Error:", error); // 👈 Muestra el error en la consola
      if (error.code === "auth/user-not-found") {
        Alert.alert("Error", "El correo ingresado no está registrado.");
      } else if (error.code === "auth/wrong-password") {
        Alert.alert("Error", "Contraseña incorrecta. Inténtalo de nuevo.");
      } else if (error.code === "auth/invalid-email") {
        Alert.alert("Error", "El correo ingresado no es válido.");
      } else {
        Alert.alert("Error", error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />
      <Button title="Iniciar Sesión" onPress={handleLogin} />
      <Text style={styles.link} onPress={() => navigation.navigate("Register")}>
        ¿No tienes cuenta? Regístrate
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },
  link: {
    marginTop: 10,
    color: "blue",
    textDecorationLine: "underline",
  },
});

export default LoginScreen;