import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const CheckEmailScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verifica tu correo</Text>
      <Text style={styles.message}>
        Hemos enviado un enlace a tu correo electrónico. Sigue las instrucciones allí para restablecer tu contraseña.
      </Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Login")}>
        <Text style={styles.buttonText}>Volver al inicio de sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#111827",
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: "#4b5563",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#4f46e5",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default CheckEmailScreen;