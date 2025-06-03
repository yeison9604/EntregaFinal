import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { getAuth } from "firebase/auth";

const ProfileScreen = ({ navigation }: any) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const auth = getAuth();
    setUser(auth.currentUser);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi Perfil</Text>
      {user ? (
        <>
          <Text style={styles.text}>Correo: {user.email}</Text>
          <Text style={styles.text}>ID de Usuario: {user.uid}</Text>
        </>
      ) : (
        <Text style={styles.text}>Cargando usuario...</Text>
      )}
      <Button title="Volver" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  text: { fontSize: 16, marginBottom: 10 },
});

export default ProfileScreen;