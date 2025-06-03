import React, { useState } from "react";
import { View, TextInput, Button, Text, Alert } from "react-native";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { db } from "../config/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

const RegisterScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }

    try {
      console.log("Intentando registrar usuario:", email);
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("Usuario registrado con éxito:", user.uid);

      // Guardar usuario en Firestore con rol "user"
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: "user",
      });

      Alert.alert("Registro exitoso", "Ahora puedes iniciar sesión");
      navigation.navigate("Login");
    } catch (error: any) {
      console.error("Error al registrar:", error.message);
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View>
      <Text>Registro</Text>
      <TextInput 
        placeholder="Correo electrónico" 
        onChangeText={setEmail} 
        value={email} 
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput 
        placeholder="Contraseña" 
        secureTextEntry 
        onChangeText={setPassword} 
        value={password} 
      />
      <Button title="Registrarse" onPress={handleRegister} />
      <Text onPress={() => navigation.navigate("Login")}>¿Ya tienes cuenta? Inicia sesión</Text>
    </View>
  );
};

export default RegisterScreen;