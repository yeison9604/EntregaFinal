import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Alert } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

const CompletedRequestsScreen = () => {
  const [completedRequests, setCompletedRequests] = useState<any[]>([]);

  const fetchCompletedRequests = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "requests"));
      const fetched = querySnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...(doc.data() as any),
        }))
        .filter((item) => item.status === "finalizado");

      setCompletedRequests(fetched);
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar las solicitudes finalizadas.");
    }
  };

  useEffect(() => {
    fetchCompletedRequests();
  }, []);

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <Text>Descripción: {item.description}</Text>
      <Text>Precio: ${item.price}</Text>
      <Text>Dirección: {item.address}</Text>
      <Text>Solicitante: {item.requesterName}</Text>
      <Text>Teléfono: {item.phoneNumber}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={completedRequests}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text>No hay solicitudes finalizadas.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  card: { backgroundColor: "#e6ffe6", padding: 15, borderRadius: 10, marginBottom: 15 },
  title: { fontSize: 18, fontWeight: "bold" },
});

export default CompletedRequestsScreen;