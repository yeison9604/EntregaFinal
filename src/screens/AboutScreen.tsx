import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";

const AboutScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Información de la Aplicación</Text>
      <Text style={styles.text}>Nombre: Servicios Limpieza y Jardinería</Text>
      <Text style={styles.text}>Versión: 1.0.0</Text>
      <Text style={styles.text}>Desarrollador: [Tu nombre o equipo]</Text>
      <Text style={styles.text}>Contacto: contacto@ejemplo.com</Text>
      <Button title="Volver" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  text: { fontSize: 16, marginBottom: 10 },
});

export default AboutScreen;