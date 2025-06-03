/*import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { collection, getDocs, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { getAuth } from "firebase/auth";

type Request = {
  id: string;
  title: string;
  description: string;
  price: number;
  status: string;
};

const RequestsScreen = () => {
  const [requests, setRequests] = useState<Request[]>([]);
const [workingRequest, setWorkingRequest] = useState<Request | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) setUserId(user.uid);

    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const q = query(collection(db, "requests"), where("status", "in", ["pendiente", "en progreso"]));
    const snapshot = await getDocs(q);
    const fetched: Request[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<Request, 'id'>),
    }));

    const enProgreso = fetched.find(req => req.status === "en progreso");
    if (enProgreso) {
      setWorkingRequest(enProgreso);
    } else {
      const pendientes = fetched.filter(req => req.status === "pendiente");
      setRequests(pendientes);
    }
  };

  const startWork = async (id: string) => {
    try {
      const ref = doc(db, "requests", id);
      await updateDoc(ref, { status: "en progreso" });
      fetchRequests();
    } catch (error) {
      Alert.alert("Error", "No se pudo iniciar el trabajo.");
    }
  };

  const finishWork = async (id: string) => {
    try {
      await deleteDoc(doc(db, "requests", id));
      Alert.alert("¡Éxito!", "Servicio finalizado.");
      setWorkingRequest(null);
      fetchRequests();
    } catch (error) {
      Alert.alert("Error", "No se pudo finalizar el servicio.");
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <Text>{item.description}</Text>
      <Text>Precio: ${item.price} COP</Text>
      <TouchableOpacity style={styles.button} onPress={() => startWork(item.id)}>
        <Text style={styles.buttonText}>Iniciar Trabajo</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {workingRequest ? (
        <View style={styles.card}>
          <Text style={styles.title}>{workingRequest.title}</Text>
          <Text>{workingRequest.description}</Text>
          <Text>Precio: ${workingRequest.price} COP</Text>
          <TouchableOpacity style={[styles.button, { backgroundColor: "green" }]} onPress={() => finishWork(workingRequest.id)}>
            <Text style={styles.buttonText}>Finalizar Servicio</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={<Text>No hay solicitudes disponibles.</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  card: { backgroundColor: "#f0f0f0", padding: 15, borderRadius: 10, marginBottom: 15 },
  title: { fontSize: 18, fontWeight: "bold" },
  button: { backgroundColor: "blue", padding: 10, marginTop: 10, borderRadius: 5 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
});

export default RequestsScreen;*/

/*import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { collection, getDocs, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { getAuth } from "firebase/auth";

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator'; // Asegúrate que ruta y nombre son correctos

type Props = NativeStackScreenProps<RootStackParamList, 'Requests'>;

type Request = {
  id: string;
  title: string;
  description: string;
  price: number;
  status: string;
};

const RequestsScreen: React.FC<Props> = ({ navigation }) => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [workingRequest, setWorkingRequest] = useState<Request | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const q = query(collection(db, "requests"), where("status", "in", ["pendiente", "en progreso"]));
    const snapshot = await getDocs(q);
    const fetched: Request[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<Request, 'id'>),
    }));

    const enProgreso = fetched.find(req => req.status === "en progreso");
    if (enProgreso) {
      setWorkingRequest(enProgreso);
      setRequests([]);
    } else {
      const pendientes = fetched.filter(req => req.status === "pendiente");
      setRequests(pendientes);
      setWorkingRequest(null);
    }
  };

  const startWork = async (id: string) => {
    try {
      const ref = doc(db, "requests", id);
      await updateDoc(ref, { status: "en progreso" });
      fetchRequests();
    } catch (error) {
      Alert.alert("Error", "No se pudo iniciar el trabajo.");
    }
  };

  const finishWork = async (id: string) => {
    try {
      await deleteDoc(doc(db, "requests", id));
      Alert.alert("¡Éxito!", "Servicio finalizado.");
      setWorkingRequest(null);
      fetchRequests();
    } catch (error) {
      Alert.alert("Error", "No se pudo finalizar el servicio.");
    }
  };

  const renderItem = ({ item }: { item: Request }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <Text>{item.description}</Text>
      <Text>Precio: ${item.price} COP</Text>
      <TouchableOpacity style={styles.button} onPress={() => startWork(item.id)}>
        <Text style={styles.buttonText}>Iniciar Trabajo</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Botón flecha para regresar *//*}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>← Volver</Text>
      </TouchableOpacity>

      {workingRequest ? (
        <View style={styles.card}>
          <Text style={styles.title}>{workingRequest.title}</Text>
          <Text>{workingRequest.description}</Text>
          <Text>Precio: ${workingRequest.price} COP</Text>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "green" }]}
            onPress={() => finishWork(workingRequest.id)}
          >
            <Text style={styles.buttonText}>Finalizar Servicio</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={<Text>No hay solicitudes disponibles.</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  backButton: {
    marginBottom: 10,
    padding: 5,
  },
  backButtonText: {
    fontSize: 18,
    color: "blue",
  },
  card: { backgroundColor: "#f0f0f0", padding: 15, borderRadius: 10, marginBottom: 15 },
  title: { fontSize: 18, fontWeight: "bold" },
  button: { backgroundColor: "blue", padding: 10, marginTop: 10, borderRadius: 5 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
});

export default RequestsScreen;*/

/*import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { collection, getDocs, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { getAuth } from "firebase/auth";

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator'; // Ajusta esta ruta si es necesario

type Props = NativeStackScreenProps<RootStackParamList, 'Requests'>;

type Request = {
  id: string;
  title: string;
  description: string;
  price: number;
  status: string;
  address?: string;
  clientName?: string;
  phone?: string;
};

const RequestsScreen: React.FC<Props> = ({ navigation }) => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [workingRequest, setWorkingRequest] = useState<Request | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const q = query(collection(db, "requests"), where("status", "in", ["pendiente", "en progreso"]));
      const snapshot = await getDocs(q);
      const fetched: Request[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Request, 'id'>),
      }));

      const enProgreso = fetched.find(req => req.status === "en progreso");
      if (enProgreso) {
        setWorkingRequest(enProgreso);
        setRequests([]);
      } else {
        const pendientes = fetched.filter(req => req.status === "pendiente");
        setRequests(pendientes);
        setWorkingRequest(null);
      }
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar las solicitudes.");
    }
  };

  const startWork = async (id: string) => {
    try {
      const ref = doc(db, "requests", id);
      await updateDoc(ref, { status: "en progreso" });
      fetchRequests();
    } catch (error) {
      Alert.alert("Error", "No se pudo iniciar el trabajo.");
    }
  };

  const finishWork = async (id: string) => {
    try {
      await deleteDoc(doc(db, "requests", id));
      Alert.alert("¡Éxito!", "Servicio finalizado.");
      setWorkingRequest(null);
      fetchRequests();
    } catch (error) {
      Alert.alert("Error", "No se pudo finalizar el servicio.");
    }
  };

  const renderItem = ({ item }: { item: Request }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <Text>{item.description}</Text>
      <Text>Precio: ${item.price} COP</Text>
      {item.address && <Text>Dirección: {item.address}</Text>}
      {item.clientName && <Text>Solicitante: {item.clientName}</Text>}
      {item.phone && <Text>Teléfono: {item.phone}</Text>}
      <TouchableOpacity style={styles.button} onPress={() => startWork(item.id)}>
        <Text style={styles.buttonText}>Iniciar Trabajo</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>← Volver</Text>
      </TouchableOpacity>

      {workingRequest ? (
        <View style={styles.card}>
          <Text style={styles.title}>{workingRequest.title}</Text>
          <Text>{workingRequest.description}</Text>
          <Text>Precio: ${workingRequest.price} COP</Text>
          {workingRequest.address && <Text>Dirección: {workingRequest.address}</Text>}
          {workingRequest.clientName && <Text>Solicitante: {workingRequest.clientName}</Text>}
          {workingRequest.phone && <Text>Teléfono: {workingRequest.phone}</Text>}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "green" }]}
            onPress={() => finishWork(workingRequest.id)}
          >
            <Text style={styles.buttonText}>Finalizar Servicio</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={<Text>No hay solicitudes disponibles.</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  backButton: {
    marginBottom: 10,
    padding: 5,
  },
  backButtonText: {
    fontSize: 18,
    color: "blue",
  },
  card: { backgroundColor: "#f0f0f0", padding: 15, borderRadius: 10, marginBottom: 15 },
  title: { fontSize: 18, fontWeight: "bold" },
  button: { backgroundColor: "blue", padding: 10, marginTop: 10, borderRadius: 5 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
});

export default RequestsScreen;*/

import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, TextInput, Modal } from "react-native";
import { collection, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

const RequestsScreen = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [enSitioEnabled, setEnSitioEnabled] = useState<{ [id: string]: boolean }>({});
  const [reasonModalVisible, setReasonModalVisible] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [incompleteReason, setIncompleteReason] = useState("");

  const fetchRequests = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "requests"));
      const fetched = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as any),
      }));
      setRequests(fetched);
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar las solicitudes.");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateRequestStatus = async (id: string, status: string, reason?: string) => {
    try {
      const requestRef = doc(db, "requests", id);
      const updateData: any = { status };
      if (reason) updateData.incompleteReason = reason;
      await updateDoc(requestRef, updateData);
      fetchRequests();
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar el estado.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "requests", id));
      fetchRequests();
    } catch (error) {
      Alert.alert("Error", "No se pudo finalizar la solicitud.");
    }
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
              onPress={() => handleDelete(item.id)}
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

      {/* Modal de motivo de incompleto */}
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