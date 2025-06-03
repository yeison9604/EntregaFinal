import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Alert } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../config/firebaseConfig";

const CompletedRequestsScreen = () => {
  const [requests, setRequests] = useState<any[]>([]);

  const fetchCompletedRequests = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const querySnapshot = await getDocs(collection(db, "requests"));
      const allRequests = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as any),
      }));

      // Mostrar solicitudes propias que estén finalizadas o incompletas
      const completed = allRequests.filter(req =>
        req.userId === user.uid && (req.status === "finalizado" || req.reason)
      );

      setRequests(completed);
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar las solicitudes completadas.");
    }
  };

  useEffect(() => {
    fetchCompletedRequests();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Solicitudes Completadas</Text>
      <FlatList
        data={requests}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.requestItem}>
            <Text style={styles.requestTitle}>{item.title}</Text>
            <Text>{item.description}</Text>
            <Text>Estado: {item.status}</Text>
            {item.reason && <Text>Motivo Incompleto: {item.reason}</Text>}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  requestItem: { padding: 15, backgroundColor: "#f0f0f0", marginVertical: 8, borderRadius: 5 },
  requestTitle: { fontSize: 18, fontWeight: "bold" },
});

export default CompletedRequestsScreen;