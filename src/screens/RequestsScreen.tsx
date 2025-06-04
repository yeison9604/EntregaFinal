import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, TextInput, Modal } from "react-native";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { getAuth } from "firebase/auth";

const RequestsScreen = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [enSitioEnabled, setEnSitioEnabled] = useState<{ [id: string]: boolean }>({});
  const [reasonModalVisible, setReasonModalVisible] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [incompleteReason, setIncompleteReason] = useState("");

  const auth = getAuth();
  const currentUser = auth.currentUser;

  const fetchRequests = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "requests"));
      const fetched = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as any),
      }));

      // Filtra solicitudes que NO fueron creadas por el usuario actual
      const filtered = fetched.filter((req) => req.userId !== currentUser?.uid);
      setRequests(filtered);
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar las solicitudes.");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateRequestStatus = async (id: string, status: string, reason?: string) => {
    try {
      const request = requests.find((req) => req.id === id);

      // Verifica que el usuario no sea el creador
      if (request?.userId === currentUser?.uid) {
        Alert.alert("Acción no permitida", "No puedes cambiar el estado de tu propia solicitud.");
        return;
      }

      const requestRef = doc(db, "requests", id);
      const updateData: any = { status };
      if (reason) updateData.incompleteReason = reason;
      await updateDoc(requestRef, updateData);
      fetchRequests();
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar el estado.");
    }
  };

  const handleFinalizar = async (id: string) => {
    await updateRequestStatus(id, "finalizado");
  };

  const handleEnCamino = (id: string) => {
    updateRequestStatus(id, "en camino");
    setTimeout(() => {
      setEnSitioEnabled((prev) => ({ ...prev, [id]: true }));
    }, 60000);
  };

  const openIncompleteModal = (id: string) => {
    setSelectedRequestId(id);
    setReasonModalVisible(true);
  };

  const handleIncompleteSubmit = async () => {
    if (selectedRequestId) {
      await updateRequestStatus(selectedRequestId, "pendiente", incompleteReason);
      setIncompleteReason("");
      setReasonModalVisible(false);
      setSelectedRequestId(null);
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>{item.title}</Text>
        <Text>Descripción: {item.description}</Text>
        <Text>Precio: ${item.price}</Text>
        <Text>Dirección: {item.address}</Text>
        <Text>Solicitante: {item.requesterName}</Text>
        <Text>Teléfono: {item.phoneNumber}</Text>
        {item.incompleteReason && (
          <Text style={{ fontStyle: "italic", color: "gray" }}>
            Último motivo de incompleto: {item.incompleteReason}
          </Text>
        )}

        {item.status === "pendiente" && (
          <TouchableOpacity
            style={styles.buttonAccept}
            onPress={() => updateRequestStatus(item.id, "aceptada")}
          >
            <Text style={styles.buttonText}>Aceptar</Text>
          </TouchableOpacity>
        )}

        {item.status === "aceptada" && (
          <TouchableOpacity
            style={styles.buttonPrimary}
            onPress={() => handleEnCamino(item.id)}
          >
            <Text style={styles.buttonText}>En camino</Text>
          </TouchableOpacity>
        )}

        {item.status === "en camino" && enSitioEnabled[item.id] && (
          <TouchableOpacity
            style={styles.buttonPrimary}
            onPress={() => updateRequestStatus(item.id, "en sitio")}
          >
            <Text style={styles.buttonText}>En sitio</Text>
          </TouchableOpacity>
        )}

        {item.status === "en sitio" && (
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.buttonSuccess}
              onPress={() => handleFinalizar(item.id)}
            >
              <Text style={styles.buttonText}>Finalizar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonDanger}
              onPress={() => openIncompleteModal(item.id)}
            >
              <Text style={styles.buttonText}>Incompletar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={requests}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text>No hay solicitudes disponibles.</Text>}
      />

      <Modal visible={reasonModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text>¿Por qué no se completó el servicio?</Text>
            <TextInput
              style={styles.input}
              placeholder="Escribe el motivo"
              value={incompleteReason}
              onChangeText={setIncompleteReason}
            />
            <TouchableOpacity
              style={styles.buttonPrimary}
              onPress={handleIncompleteSubmit}
            >
              <Text style={styles.buttonText}>Guardar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonDanger}
              onPress={() => {
                setReasonModalVisible(false);
                setIncompleteReason("");
              }}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  card: { backgroundColor: "#f2f2f2", padding: 15, borderRadius: 10, marginBottom: 15 },
  title: { fontSize: 18, fontWeight: "bold" },
  row: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  buttonText: { color: "#fff", textAlign: "center" },
  buttonPrimary: { backgroundColor: "blue", padding: 10, borderRadius: 5, marginTop: 10 },
  buttonAccept: { backgroundColor: "#4CAF50", padding: 10, borderRadius: 5, marginTop: 10 },
  buttonSuccess: { backgroundColor: "green", padding: 10, borderRadius: 5, flex: 1, marginRight: 5 },
  buttonDanger: { backgroundColor: "red", padding: 10, borderRadius: 5, flex: 1, marginLeft: 5 },
  modalOverlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.4)" },
  modalContent: { backgroundColor: "#fff", padding: 20, borderRadius: 10, width: "80%" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginTop: 10, marginBottom: 10 },
});

export default RequestsScreen;