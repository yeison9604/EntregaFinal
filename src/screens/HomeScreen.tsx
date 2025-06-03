/*import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";

const HomeScreen = () => {
  useEffect(() => {
    console.log("HomeScreen se está renderizando...");
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido a la App 🚀</Text>
      <Text style={styles.subtitle}>Aquí puedes gestionar tus servicios</Text>
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
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "gray",
    marginBottom: 20,
  },
});

export default HomeScreen;*/

/*import React, { useState, useEffect } from "react";
import { View, Text, Button, TextInput, FlatList, Modal, Alert, StyleSheet, TouchableOpacity } from "react-native";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { getAuth, signOut } from "firebase/auth";

const HomeScreen = ({ navigation }: any) => {
  const [requests, setRequests] = useState<{ id: string; title: string; description: string; price: number }[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRequest, setEditingRequest] = useState<{ id: string; title: string; description: string; price: number } | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setUserId(user.uid);
    }

    const fetchRequests = async () => {
      const querySnapshot = await getDocs(collection(db, "requests"));
      const fetchedRequests = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as { id: string; title: string; description: string; price: number }[];

      setRequests(fetchedRequests);
    };

    fetchRequests();
  }, []);

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      Alert.alert("Sesión cerrada", "Has cerrado sesión correctamente.");
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Error", "No se pudo cerrar sesión.");
    }
  };

  const handleCreateRequest = async () => {
    if (!newTitle || !newDescription || !newPrice) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }
  
    const priceValue = parseFloat(newPrice);
    if (isNaN(priceValue) || priceValue <= 0) {
      Alert.alert("Error", "El precio debe ser un número válido.");
      return;
    }
  
    try {
      const docRef = await addDoc(collection(db, "requests"), {
        title: newTitle,
        description: newDescription,
        price: priceValue,
        userId,
        status: "pendiente", // 👈 Esta línea es la clave
      });
  
      setRequests((prevRequests) => [
        ...prevRequests,
        {
          id: docRef.id,
          title: newTitle,
          description: newDescription,
          price: priceValue,
          status: "pendiente", // 👈 También aquí
        },
      ]);
  
      setModalVisible(false);
      setNewTitle("");
      setNewDescription("");
      setNewPrice("");
      Alert.alert("Éxito", "Solicitud creada correctamente.");
    } catch (error) {
      console.error("Error al crear solicitud:", error);
      Alert.alert("Error", "No se pudo crear la solicitud.");
    }
  };

  const handleDeleteRequest = async (id: string) => {
    try {
      await deleteDoc(doc(db, "requests", id));
      setRequests((prevRequests) => prevRequests.filter((req) => req.id !== id));
      Alert.alert("Éxito", "Solicitud eliminada correctamente.");
    } catch (error) {
      Alert.alert("Error", "No se pudo eliminar la solicitud.");
    }
  };

  const handleEditRequest = async () => {
    if (!editingRequest) return;

    const priceValue = parseFloat(newPrice);
    if (isNaN(priceValue) || priceValue <= 0) {
      Alert.alert("Error", "El precio debe ser un número válido.");
      return;
    }

    try {
      const requestRef = doc(db, "requests", editingRequest.id);
      await updateDoc(requestRef, {
        title: newTitle,
        description: newDescription,
        price: priceValue,
      });

      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req.id === editingRequest.id ? { ...req, title: newTitle, description: newDescription, price: priceValue } : req
        )
      );

      setModalVisible(false);
      setEditingRequest(null);
      setNewTitle("");
      setNewDescription("");
      setNewPrice("");
      Alert.alert("Éxito", "Solicitud actualizada correctamente.");
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar la solicitud.");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Cerrar Sesión</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Solicitudes</Text>

      <FlatList
        data={requests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.requestItem}>
            <Text style={styles.requestTitle}>{item.title}</Text>
            <Text>{item.description}</Text>
            <Text>Precio: ${item.price} COP</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.editButton} onPress={() => {
                setEditingRequest(item);
                setNewTitle(item.title);
                setNewDescription(item.description);
                setNewPrice(item.price.toString());
                setModalVisible(true);
              }}>
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteRequest(item.id)}>
                <Text style={styles.buttonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <Button title="Trabajar" onPress={() => navigation.navigate("RequestsScreen")} />
      <Button title="Crear Solicitud" onPress={() => {
        setEditingRequest(null);
        setNewTitle("");
        setNewDescription("");
        setNewPrice("");
        setModalVisible(true);
      }} />

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput style={styles.input} placeholder="Título" value={newTitle} onChangeText={setNewTitle} />
            <TextInput style={styles.input} placeholder="Descripción" value={newDescription} onChangeText={setNewDescription} />
            <TextInput style={styles.input} placeholder="Precio (COP)" value={newPrice} onChangeText={setNewPrice} keyboardType="numeric" />
            <Button title={editingRequest ? "Actualizar" : "Guardar"} onPress={editingRequest ? handleEditRequest : handleCreateRequest} />
            <Button title="Cancelar" color="red" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  logoutButton: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "red",
    padding: 10,
    borderRadius: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  requestItem: {
    padding: 15,
    backgroundColor: "#f9f9f9",
    marginVertical: 8,
    borderRadius: 5,
  },
  requestTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  editButton: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo oscuro para modal
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5, // Sombra en Android
    shadowColor: "#000", // Sombra en iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default HomeScreen;*/

/*import React, { useState, useEffect } from "react";
import { View, Text, Button, TextInput, FlatList, Modal, Alert, StyleSheet, TouchableOpacity } from "react-native";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { getAuth, signOut } from "firebase/auth";

const HomeScreen = ({ navigation }: any) => {
  const [requests, setRequests] = useState<{ id: string; title: string; description: string; price: number }[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRequest, setEditingRequest] = useState<{ id: string; title: string; description: string; price: number } | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Extraemos fetchRequests para poder llamarlo en useEffect y en botón actualizar
  const fetchRequests = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "requests"));
      const fetchedRequests = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as { id: string; title: string; description: string; price: number }[];
      setRequests(fetchedRequests);
    } catch (error) {
      Alert.alert("Error", "No se pudo cargar las solicitudes.");
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setUserId(user.uid);
    }

    fetchRequests();
  }, []);

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      Alert.alert("Sesión cerrada", "Has cerrado sesión correctamente.");
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Error", "No se pudo cerrar sesión.");
    }
  };

  const handleCreateRequest = async () => {
    if (!newTitle || !newDescription || !newPrice) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }

    const priceValue = parseFloat(newPrice);
    if (isNaN(priceValue) || priceValue <= 0) {
      Alert.alert("Error", "El precio debe ser un número válido.");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "requests"), {
        title: newTitle,
        description: newDescription,
        price: priceValue,
        userId,
        status: "pendiente",
      });

      setRequests((prevRequests) => [
        ...prevRequests,
        {
          id: docRef.id,
          title: newTitle,
          description: newDescription,
          price: priceValue,
          status: "pendiente",
        },
      ]);

      setModalVisible(false);
      setNewTitle("");
      setNewDescription("");
      setNewPrice("");
      Alert.alert("Éxito", "Solicitud creada correctamente.");
    } catch (error) {
      console.error("Error al crear solicitud:", error);
      Alert.alert("Error", "No se pudo crear la solicitud.");
    }
  };

  const handleDeleteRequest = async (id: string) => {
    try {
      await deleteDoc(doc(db, "requests", id));
      setRequests((prevRequests) => prevRequests.filter((req) => req.id !== id));
      Alert.alert("Éxito", "Solicitud eliminada correctamente.");
    } catch (error) {
      Alert.alert("Error", "No se pudo eliminar la solicitud.");
    }
  };

  const handleEditRequest = async () => {
    if (!editingRequest) return;

    const priceValue = parseFloat(newPrice);
    if (isNaN(priceValue) || priceValue <= 0) {
      Alert.alert("Error", "El precio debe ser un número válido.");
      return;
    }

    try {
      const requestRef = doc(db, "requests", editingRequest.id);
      await updateDoc(requestRef, {
        title: newTitle,
        description: newDescription,
        price: priceValue,
      });

      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req.id === editingRequest.id ? { ...req, title: newTitle, description: newDescription, price: priceValue } : req
        )
      );

      setModalVisible(false);
      setEditingRequest(null);
      setNewTitle("");
      setNewDescription("");
      setNewPrice("");
      Alert.alert("Éxito", "Solicitud actualizada correctamente.");
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar la solicitud.");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Cerrar Sesión</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Solicitudes</Text>

      {/* Botón para actualizar la lista *//*}
      <Button title="Actualizar" onPress={fetchRequests} />

      <FlatList
        data={requests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.requestItem}>
            <Text style={styles.requestTitle}>{item.title}</Text>
            <Text>{item.description}</Text>
            <Text>Precio: ${item.price} COP</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => {
                  setEditingRequest(item);
                  setNewTitle(item.title);
                  setNewDescription(item.description);
                  setNewPrice(item.price.toString());
                  setModalVisible(true);
                }}
              >
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteRequest(item.id)}>
                <Text style={styles.buttonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <Button title="Trabajar" onPress={() => navigation.navigate("RequestsScreen")} />
      <Button
        title="Crear Solicitud"
        onPress={() => {
          setEditingRequest(null);
          setNewTitle("");
          setNewDescription("");
          setNewPrice("");
          setModalVisible(true);
        }}
      />

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput style={styles.input} placeholder="Título" value={newTitle} onChangeText={setNewTitle} />
            <TextInput style={styles.input} placeholder="Descripción" value={newDescription} onChangeText={setNewDescription} />
            <TextInput
              style={styles.input}
              placeholder="Precio (COP)"
              value={newPrice}
              onChangeText={setNewPrice}
              keyboardType="numeric"
            />
            <Button title={editingRequest ? "Actualizar" : "Guardar"} onPress={editingRequest ? handleEditRequest : handleCreateRequest} />
            <Button title="Cancelar" color="red" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  logoutButton: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "red",
    padding: 10,
    borderRadius: 50,
    zIndex: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  requestItem: {
    padding: 15,
    backgroundColor: "#f9f9f9",
    marginVertical: 8,
    borderRadius: 5,
  },
  requestTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  editButton: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo oscuro para modal
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5, // Sombra en Android
    shadowColor: "#000", // Sombra en iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default HomeScreen;*/

/*import React, { useState, useEffect } from "react";
import { View, Text, Button, TextInput, FlatList, Modal, Alert, StyleSheet, TouchableOpacity } from "react-native";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { getAuth, signOut } from "firebase/auth";

const HomeScreen = ({ navigation }: any) => {
  const [requests, setRequests] = useState<
    {
      id: string;
      title: string;
      description: string;
      price: number;
      address?: string;
      requesterName?: string;
      phoneNumber?: string;
    }[]
  >([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newRequesterName, setNewRequesterName] = useState("");
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRequest, setEditingRequest] = useState<
    {
      id: string;
      title: string;
      description: string;
      price: number;
      address?: string;
      requesterName?: string;
      phoneNumber?: string;
    } | null
  >(null);
  const [userId, setUserId] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "requests"));
      const fetchedRequests = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as {
        id: string;
        title: string;
        description: string;
        price: number;
        address?: string;
        requesterName?: string;
        phoneNumber?: string;
      }[];
      setRequests(fetchedRequests);
    } catch (error) {
      Alert.alert("Error", "No se pudo cargar las solicitudes.");
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setUserId(user.uid);
    }
    fetchRequests();
  }, []);

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      Alert.alert("Sesión cerrada", "Has cerrado sesión correctamente.");
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Error", "No se pudo cerrar sesión.");
    }
  };

  const validatePhoneNumber = (phone: string) => {
    // Validación básica, se puede mejorar
    const phoneRegex = /^\+?\d{7,15}$/;
    return phoneRegex.test(phone);
  };

  const handleCreateRequest = async () => {
    if (!newTitle || !newDescription || !newPrice || !newAddress || !newRequesterName || !newPhoneNumber) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }

    const priceValue = parseFloat(newPrice);
    if (isNaN(priceValue) || priceValue <= 0) {
      Alert.alert("Error", "El precio debe ser un número válido.");
      return;
    }

    if (!validatePhoneNumber(newPhoneNumber)) {
      Alert.alert("Error", "Número telefónico no válido.");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "requests"), {
        title: newTitle,
        description: newDescription,
        price: priceValue,
        address: newAddress,
        requesterName: newRequesterName,
        phoneNumber: newPhoneNumber,
        userId,
        status: "pendiente",
      });

      setRequests(prevRequests => [
        ...prevRequests,
        {
          id: docRef.id,
          title: newTitle,
          description: newDescription,
          price: priceValue,
          address: newAddress,
          requesterName: newRequesterName,
          phoneNumber: newPhoneNumber,
          status: "pendiente",
        },
      ]);

      setModalVisible(false);
      setNewTitle("");
      setNewDescription("");
      setNewPrice("");
      setNewAddress("");
      setNewRequesterName("");
      setNewPhoneNumber("");
      Alert.alert("Éxito", "Solicitud creada correctamente.");
    } catch (error) {
      console.error("Error al crear solicitud:", error);
      Alert.alert("Error", "No se pudo crear la solicitud.");
    }
  };

  const handleDeleteRequest = async (id: string) => {
    try {
      await deleteDoc(doc(db, "requests", id));
      setRequests(prevRequests => prevRequests.filter(req => req.id !== id));
      Alert.alert("Éxito", "Solicitud eliminada correctamente.");
    } catch (error) {
      Alert.alert("Error", "No se pudo eliminar la solicitud.");
    }
  };

  const handleEditRequest = async () => {
    if (!editingRequest) return;

    if (!newTitle || !newDescription || !newPrice || !newAddress || !newRequesterName || !newPhoneNumber) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }

    const priceValue = parseFloat(newPrice);
    if (isNaN(priceValue) || priceValue <= 0) {
      Alert.alert("Error", "El precio debe ser un número válido.");
      return;
    }

    if (!validatePhoneNumber(newPhoneNumber)) {
      Alert.alert("Error", "Número telefónico no válido.");
      return;
    }

    try {
      const requestRef = doc(db, "requests", editingRequest.id);
      await updateDoc(requestRef, {
        title: newTitle,
        description: newDescription,
        price: priceValue,
        address: newAddress,
        requesterName: newRequesterName,
        phoneNumber: newPhoneNumber,
      });

      setRequests(prevRequests =>
        prevRequests.map(req =>
          req.id === editingRequest.id
            ? {
                ...req,
                title: newTitle,
                description: newDescription,
                price: priceValue,
                address: newAddress,
                requesterName: newRequesterName,
                phoneNumber: newPhoneNumber,
              }
            : req
        )
      );

      setModalVisible(false);
      setEditingRequest(null);
      setNewTitle("");
      setNewDescription("");
      setNewPrice("");
      setNewAddress("");
      setNewRequesterName("");
      setNewPhoneNumber("");
      Alert.alert("Éxito", "Solicitud actualizada correctamente.");
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar la solicitud.");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Cerrar Sesión</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Solicitudes</Text>

      <Button title="Actualizar" onPress={fetchRequests} />

      <FlatList
        data={requests}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.requestItem}>
            <Text style={styles.requestTitle}>{item.title}</Text>
            <Text>{item.description}</Text>
            <Text>Precio: ${item.price} COP</Text>
            <Text>Dirección: {item.address}</Text>
            <Text>Solicitante: {item.requesterName}</Text>
            <Text>Teléfono: {item.phoneNumber}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => {
                  setEditingRequest(item);
                  setNewTitle(item.title);
                  setNewDescription(item.description);
                  setNewPrice(item.price.toString());
                  setNewAddress(item.address || "");
                  setNewRequesterName(item.requesterName || "");
                  setNewPhoneNumber(item.phoneNumber || "");
                  setModalVisible(true);
                }}
              >
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteRequest(item.id)}>
                <Text style={styles.buttonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <Button
        title="Trabajar"
        onPress={() => navigation.navigate("RequestsScreen")}
      />
      <Button
        title="Crear Solicitud"
        onPress={() => {
          setEditingRequest(null);
          setNewTitle("");
          setNewDescription("");
          setNewPrice("");
          setNewAddress("");
          setNewRequesterName("");
          setNewPhoneNumber("");
          setModalVisible(true);
        }}
      />

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput style={styles.input} placeholder="Título" value={newTitle} onChangeText={setNewTitle} />
            <TextInput style={styles.input} placeholder="Descripción" value={newDescription} onChangeText={setNewDescription} />
            <TextInput
              style={styles.input}
              placeholder="Precio (COP)"
              value={newPrice}
              onChangeText={setNewPrice}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Dirección"
              value={newAddress}
              onChangeText={setNewAddress}
            />
            <TextInput
              style={styles.input}
              placeholder="Nombre del solicitante"
              value={newRequesterName}
              onChangeText={setNewRequesterName}
            />
            <TextInput
              style={styles.input}
              placeholder="Número telefónico"
              value={newPhoneNumber}
              onChangeText={setNewPhoneNumber}
              keyboardType="phone-pad"
            />
            <Button
              title={editingRequest ? "Actualizar" : "Guardar"}
              onPress={editingRequest ? handleEditRequest : handleCreateRequest}
            />
            <Button title="Cancelar" color="red" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  // ... (mismos estilos que tenías antes)
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  logoutButton: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "red",
    padding: 10,
    borderRadius: 50,
    zIndex: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  requestItem: {
    padding: 15,
    backgroundColor: "#f9f9f9",
    marginVertical: 8,
    borderRadius: 5,
  },
  requestTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  editButton: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default HomeScreen;*/

/*import React, { useState, useEffect } from "react";
import {
  View, Text, Button, TextInput, FlatList, Modal, Alert,
  StyleSheet, TouchableOpacity
} from "react-native";
import {
  collection, addDoc, getDocs, updateDoc, deleteDoc, doc
} from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { getAuth, signOut } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";

const HomeScreen = ({ navigation }: any) => {
  const [requests, setRequests] = useState<any[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newRequesterName, setNewRequesterName] = useState("");
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [editingRequest, setEditingRequest] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
  
      if (!user) return;
  
      const querySnapshot = await getDocs(collection(db, "requests"));
      const fetchedRequests = querySnapshot.docs
  .map(doc => ({ id: doc.id, ...(doc.data() as any) }))
  .filter(request => request.userId === user.uid);
  
      setRequests(fetchedRequests);
    } catch (error) {
      Alert.alert("Error", "No se pudo cargar las solicitudes.");
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setUserId(user.uid);
    }
    fetchRequests();
  }, []);

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      Alert.alert("Sesión cerrada", "Has cerrado sesión correctamente.");
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Error", "No se pudo cerrar sesión.");
    }
  };

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^\+?\d{7,15}$/;
    return phoneRegex.test(phone);
  };

  const handleCreateRequest = async () => {
    if (!newTitle || !newDescription || !newPrice || !newAddress || !newRequesterName || !newPhoneNumber) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }

    const priceValue = parseFloat(newPrice);
    if (isNaN(priceValue) || priceValue <= 0) {
      Alert.alert("Error", "El precio debe ser un número válido.");
      return;
    }

    if (!validatePhoneNumber(newPhoneNumber)) {
      Alert.alert("Error", "Número telefónico no válido.");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "requests"), {
        title: newTitle,
        description: newDescription,
        price: priceValue,
        address: newAddress,
        requesterName: newRequesterName,
        phoneNumber: newPhoneNumber,
        userId,
        status: "pendiente",
      });

      setRequests(prev => [
        ...prev,
        {
          id: docRef.id,
          title: newTitle,
          description: newDescription,
          price: priceValue,
          address: newAddress,
          requesterName: newRequesterName,
          phoneNumber: newPhoneNumber,
          status: "pendiente",
        },
      ]);

      setModalVisible(false);
      setNewTitle("");
      setNewDescription("");
      setNewPrice("");
      setNewAddress("");
      setNewRequesterName("");
      setNewPhoneNumber("");
      Alert.alert("Éxito", "Solicitud creada correctamente.");
    } catch (error) {
      console.error("Error al crear solicitud:", error);
      Alert.alert("Error", "No se pudo crear la solicitud.");
    }
  };

  const handleDeleteRequest = async (id: string) => {
    try {
      await deleteDoc(doc(db, "requests", id));
      setRequests(prev => prev.filter(req => req.id !== id));
      Alert.alert("Éxito", "Solicitud eliminada correctamente.");
    } catch (error) {
      Alert.alert("Error", "No se pudo eliminar la solicitud.");
    }
  };

  const handleEditRequest = async () => {
    if (!editingRequest) return;

    if (!newTitle || !newDescription || !newPrice || !newAddress || !newRequesterName || !newPhoneNumber) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }

    const priceValue = parseFloat(newPrice);
    if (isNaN(priceValue) || priceValue <= 0) {
      Alert.alert("Error", "El precio debe ser un número válido.");
      return;
    }

    if (!validatePhoneNumber(newPhoneNumber)) {
      Alert.alert("Error", "Número telefónico no válido.");
      return;
    }

    try {
      const requestRef = doc(db, "requests", editingRequest.id);
      await updateDoc(requestRef, {
        title: newTitle,
        description: newDescription,
        price: priceValue,
        address: newAddress,
        requesterName: newRequesterName,
        phoneNumber: newPhoneNumber,
      });

      setRequests(prev =>
        prev.map(req =>
          req.id === editingRequest.id
            ? { ...req, title: newTitle, description: newDescription, price: priceValue, address: newAddress, requesterName: newRequesterName, phoneNumber: newPhoneNumber }
            : req
        )
      );

      setModalVisible(false);
      setEditingRequest(null);
      setNewTitle("");
      setNewDescription("");
      setNewPrice("");
      setNewAddress("");
      setNewRequesterName("");
      setNewPhoneNumber("");
      Alert.alert("Éxito", "Solicitud actualizada correctamente.");
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar la solicitud.");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.menuButton} onPress={() => setMenuVisible(true)}>
        <Ionicons name="menu" size={28} color="white" />
      </TouchableOpacity>

      <Text style={styles.title}>Solicitudes</Text>

      <Button title="Actualizar" onPress={fetchRequests} />

      <FlatList
        data={requests}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.requestItem}>
            <Text style={styles.requestTitle}>{item.title}</Text>
            <Text>{item.description}</Text>
            <Text>Precio: ${item.price} COP</Text>
            <Text>Dirección: {item.address}</Text>
            <Text>Solicitante: {item.requesterName}</Text>
            <Text>Teléfono: {item.phoneNumber}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => {
                  setEditingRequest(item);
                  setNewTitle(item.title);
                  setNewDescription(item.description);
                  setNewPrice(item.price.toString());
                  setNewAddress(item.address || "");
                  setNewRequesterName(item.requesterName || "");
                  setNewPhoneNumber(item.phoneNumber || "");
                  setModalVisible(true);
                }}
              >
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteRequest(item.id)}>
                <Text style={styles.buttonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <Button
        title="Crear Solicitud"
        onPress={() => {
          setEditingRequest(null);
          setNewTitle("");
          setNewDescription("");
          setNewPrice("");
          setNewAddress("");
          setNewRequesterName("");
          setNewPhoneNumber("");
          setModalVisible(true);
        }}
      />

      {/* MODAL DE CREACIÓN/EDICIÓN *//*}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput style={styles.input} placeholder="Título" value={newTitle} onChangeText={setNewTitle} />
            <TextInput style={styles.input} placeholder="Descripción" value={newDescription} onChangeText={setNewDescription} />
            <TextInput style={styles.input} placeholder="Precio (COP)" value={newPrice} onChangeText={setNewPrice} keyboardType="numeric" />
            <TextInput style={styles.input} placeholder="Dirección" value={newAddress} onChangeText={setNewAddress} />
            <TextInput style={styles.input} placeholder="Nombre del solicitante" value={newRequesterName} onChangeText={setNewRequesterName} />
            <TextInput style={styles.input} placeholder="Número telefónico" value={newPhoneNumber} onChangeText={setNewPhoneNumber} keyboardType="phone-pad" />
            <Button title={editingRequest ? "Actualizar" : "Guardar"} onPress={editingRequest ? handleEditRequest : handleCreateRequest} />
            <Button title="Cancelar" color="red" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>

      
      <Modal visible={menuVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.menuOverlay} onPress={() => setMenuVisible(false)}>
          <View style={styles.menuContainer}>
            <Button
            title="Ver Perfil"
            onPress={() => {
            setMenuVisible(false);
            navigation.navigate("ProfileScreen"); // ✅ Navega correctamente
            }}
            />
            <Button title="Información de la app" onPress={() => { setMenuVisible(false); Alert.alert("Info", "App creada por ti 😄"); }} />
            <Button title="Trabajar" onPress={() => { setMenuVisible(false); navigation.navigate("RequestsScreen"); }} />
            <Button title="Cerrar Sesión" color="red" onPress={handleLogout} />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  requestItem: { padding: 15, backgroundColor: "#f9f9f9", marginVertical: 8, borderRadius: 5 },
  requestTitle: { fontSize: 18, fontWeight: "bold" },
  buttonContainer: { flexDirection: "row", marginTop: 10 },
  editButton: { backgroundColor: "blue", padding: 10, borderRadius: 5, marginRight: 10 },
  deleteButton: { backgroundColor: "red", padding: 10, borderRadius: 5 },
  buttonText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)" },
  modalContent: { width: "80%", backgroundColor: "white", padding: 20, borderRadius: 10, elevation: 5 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10, borderRadius: 5 },
  menuButton: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "black",
    padding: 10,
    borderRadius: 25,
    zIndex: 10,
  },
  menuOverlay: { flex: 1, justifyContent: "flex-start", alignItems: "flex-end", paddingTop: 90, paddingRight: 20, backgroundColor: "rgba(0,0,0,0.3)" },
  menuContainer: {
    width: 200,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    elevation: 10,
  },
});

export default HomeScreen;*/

/*import React, { useState, useEffect } from "react";
import {
  View, Text, Button, TextInput, FlatList, Modal, Alert,
  StyleSheet, TouchableOpacity
} from "react-native";
import {
  collection, addDoc, getDocs, updateDoc, deleteDoc, doc
} from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { getAuth, signOut } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";

const HomeScreen = ({ navigation }: any) => {
  const [requests, setRequests] = useState<any[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newRequesterName, setNewRequesterName] = useState("");
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [editingRequest, setEditingRequest] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) return;

      const querySnapshot = await getDocs(collection(db, "requests"));
      const fetchedRequests = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...(doc.data() as any) }))
        .filter(request => request.userId === user.uid);

      setRequests(fetchedRequests);
    } catch (error) {
      Alert.alert("Error", "No se pudo cargar las solicitudes.");
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setUserId(user.uid);
    }
    fetchRequests();
  }, []);

  // --- Estados y sus transiciones ---

  // Cambiar estado a "en camino" y guardar timestamp
  const handleSetEnCamino = async (request: any) => {
    try {
      const requestRef = doc(db, "requests", request.id);
      const timestamp = Date.now();
      await updateDoc(requestRef, {
        status: "en camino",
        enCaminoTimestamp: timestamp,
      });

      setRequests(prev =>
        prev.map(r =>
          r.id === request.id ? { ...r, status: "en camino", enCaminoTimestamp: timestamp } : r
        )
      );
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar el estado a 'En Camino'.");
    }
  };

  // Cambiar estado a "en sitio" solo si pasó 1 minuto
  const handleSetEnSitio = async (request: any) => {
    try {
      const requestRef = doc(db, "requests", request.id);
      await updateDoc(requestRef, {
        status: "en sitio",
      });

      setRequests(prev =>
        prev.map(r =>
          r.id === request.id ? { ...r, status: "en sitio" } : r
        )
      );
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar el estado a 'En Sitio'.");
    }
  };

  // Verifica si pasó 1 minuto desde enCaminoTimestamp
  const canSetEnSitio = (request: any) => {
    if (!request.enCaminoTimestamp) return false;
    const now = Date.now();
    const elapsed = now - request.enCaminoTimestamp;
    return elapsed >= 60000; // 60 segundos
  };

  // Validaciones y creación/edición/eliminación siguen igual
  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      Alert.alert("Sesión cerrada", "Has cerrado sesión correctamente.");
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Error", "No se pudo cerrar sesión.");
    }
  };

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^\+?\d{7,15}$/;
    return phoneRegex.test(phone);
  };

  const handleCreateRequest = async () => {
    if (!newTitle || !newDescription || !newPrice || !newAddress || !newRequesterName || !newPhoneNumber) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }

    const priceValue = parseFloat(newPrice);
    if (isNaN(priceValue) || priceValue <= 0) {
      Alert.alert("Error", "El precio debe ser un número válido.");
      return;
    }

    if (!validatePhoneNumber(newPhoneNumber)) {
      Alert.alert("Error", "Número telefónico no válido.");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "requests"), {
        title: newTitle,
        description: newDescription,
        price: priceValue,
        address: newAddress,
        requesterName: newRequesterName,
        phoneNumber: newPhoneNumber,
        userId,
        status: "pendiente",
        enCaminoTimestamp: null,
      });

      setRequests(prev => [
        ...prev,
        {
          id: docRef.id,
          title: newTitle,
          description: newDescription,
          price: priceValue,
          address: newAddress,
          requesterName: newRequesterName,
          phoneNumber: newPhoneNumber,
          status: "pendiente",
          enCaminoTimestamp: null,
        },
      ]);

      setModalVisible(false);
      setNewTitle("");
      setNewDescription("");
      setNewPrice("");
      setNewAddress("");
      setNewRequesterName("");
      setNewPhoneNumber("");
      Alert.alert("Éxito", "Solicitud creada correctamente.");
    } catch (error) {
      console.error("Error al crear solicitud:", error);
      Alert.alert("Error", "No se pudo crear la solicitud.");
    }
  };

  const handleDeleteRequest = async (id: string) => {
    try {
      await deleteDoc(doc(db, "requests", id));
      setRequests(prev => prev.filter(req => req.id !== id));
      Alert.alert("Éxito", "Solicitud eliminada correctamente.");
    } catch (error) {
      Alert.alert("Error", "No se pudo eliminar la solicitud.");
    }
  };

  const handleEditRequest = async () => {
    if (!editingRequest) return;

    if (!newTitle || !newDescription || !newPrice || !newAddress || !newRequesterName || !newPhoneNumber) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }

    const priceValue = parseFloat(newPrice);
    if (isNaN(priceValue) || priceValue <= 0) {
      Alert.alert("Error", "El precio debe ser un número válido.");
      return;
    }

    if (!validatePhoneNumber(newPhoneNumber)) {
      Alert.alert("Error", "Número telefónico no válido.");
      return;
    }

    try {
      const requestRef = doc(db, "requests", editingRequest.id);
      await updateDoc(requestRef, {
        title: newTitle,
        description: newDescription,
        price: priceValue,
        address: newAddress,
        requesterName: newRequesterName,
        phoneNumber: newPhoneNumber,
      });

      setRequests(prev =>
        prev.map(req =>
          req.id === editingRequest.id
            ? { ...req, title: newTitle, description: newDescription, price: priceValue, address: newAddress, requesterName: newRequesterName, phoneNumber: newPhoneNumber }
            : req
        )
      );

      setModalVisible(false);
      setEditingRequest(null);
      setNewTitle("");
      setNewDescription("");
      setNewPrice("");
      setNewAddress("");
      setNewRequesterName("");
      setNewPhoneNumber("");
      Alert.alert("Éxito", "Solicitud actualizada correctamente.");
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar la solicitud.");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.menuButton} onPress={() => setMenuVisible(true)}>
        <Ionicons name="menu" size={28} color="white" />
      </TouchableOpacity>

      <Text style={styles.title}>Solicitudes</Text>

      <Button title="Actualizar" onPress={fetchRequests} />

      <FlatList
        data={requests}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.requestItem}>
            <Text style={styles.requestTitle}>{item.title}</Text>
            <Text>{item.description}</Text>
            <Text>Precio: ${item.price} COP</Text>
            <Text>Dirección: {item.address}</Text>
            <Text>Solicitante: {item.requesterName}</Text>
            <Text>Teléfono: {item.phoneNumber}</Text>
            <Text style={{ marginTop: 5, fontWeight: "bold" }}>Estado: {item.status}</Text>

            {/* Botón para cambiar a "En Camino" *//*}
            {item.status === "pendiente" && (
              <Button title="Iniciar Trabajo (En Camino)" onPress={() => handleSetEnCamino(item)} />
            )}

            {/* Botón para cambiar a "En Sitio", habilitado solo después de 1 minuto *//*}
            {item.status === "en camino" && (
              <>
                <Button
                  title="Marcar En Sitio"
                  onPress={() => handleSetEnSitio(item)}
                  disabled={!canSetEnSitio(item)}
                />
                {!canSetEnSitio(item) && (
                  <Text style={{ color: "gray", marginTop: 5 }}>
                    El botón se habilitará en{" "}
                    {Math.ceil((60000 - (Date.now() - (item.enCaminoTimestamp || 0))) / 1000)} segundos.
                  </Text>
                )}
              </>
            )}

            {/* Botones editar y eliminar *//*}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => {
                  setEditingRequest(item);
                  setNewTitle(item.title);
                  setNewDescription(item.description);
                  setNewPrice(item.price.toString());
                  setNewAddress(item.address || "");
                  setNewRequesterName(item.requesterName || "");
                  setNewPhoneNumber(item.phoneNumber || "");
                  setModalVisible(true);
                }}
              >
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteRequest(item.id)}>
                <Text style={styles.buttonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Modal para crear o editar solicitud *//*}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalBackground}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>
              {editingRequest ? "Editar Solicitud" : "Nueva Solicitud"}
            </Text>
            <TextInput
              placeholder="Título"
              style={styles.input}
              value={newTitle}
              onChangeText={setNewTitle}
            />
            <TextInput
              placeholder="Descripción"
              style={styles.input}
              value={newDescription}
              onChangeText={setNewDescription}
            />
            <TextInput
              placeholder="Precio"
              style={styles.input}
              value={newPrice}
              onChangeText={setNewPrice}
              keyboardType="numeric"
            />
            <TextInput
              placeholder="Dirección"
              style={styles.input}
              value={newAddress}
              onChangeText={setNewAddress}
            />
            <TextInput
              placeholder="Nombre del Solicitante"
              style={styles.input}
              value={newRequesterName}
              onChangeText={setNewRequesterName}
            />
            <TextInput
              placeholder="Número Telefónico"
              style={styles.input}
              value={newPhoneNumber}
              onChangeText={setNewPhoneNumber}
              keyboardType="phone-pad"
            />

            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
              <Button
                title="Cancelar"
                onPress={() => {
                  setModalVisible(false);
                  setEditingRequest(null);
                  setNewTitle("");
                  setNewDescription("");
                  setNewPrice("");
                  setNewAddress("");
                  setNewRequesterName("");
                  setNewPhoneNumber("");
                }}
              />
              <Button
                title={editingRequest ? "Guardar Cambios" : "Crear Solicitud"}
                onPress={editingRequest ? handleEditRequest : handleCreateRequest}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal menú *//*}
      <Modal animationType="slide" transparent={true} visible={menuVisible}>
        <View style={styles.menuModalBackground}>
          <View style={styles.menuModalView}>
            <Button
              title="Cerrar Menú"
              onPress={() => setMenuVisible(false)}
            />
            <Button
              title="Crear Nueva Solicitud"
              onPress={() => {
                setModalVisible(true);
                setMenuVisible(false);
              }}
            />
            <Button
              title="Cerrar Sesión"
              onPress={handleLogout}
              color="red"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  menuButton: {
    position: "absolute",
    top: 30,
    left: 20,
    backgroundColor: "#007AFF",
    padding: 8,
    borderRadius: 20,
    zIndex: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  requestItem: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 8,
    marginVertical: 6,
  },
  requestTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-around",
  },
  editButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginVertical: 6,
  },
  menuModalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-start",
  },
  menuModalView: {
    backgroundColor: "white",
    padding: 20,
    paddingTop: 40,
    elevation: 10,
  },
});

export default HomeScreen;*/

/*import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  FlatList,
  Modal,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { getAuth, signOut } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";

const HomeScreen = ({ navigation }: any) => {
  const [requests, setRequests] = useState<any[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newRequesterName, setNewRequesterName] = useState("");
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [modalVisible, setModalVisible] = useState(false); // Para crear/editar
  const [menuVisible, setMenuVisible] = useState(false); // Menú principal
  const [workModalVisible, setWorkModalVisible] = useState(false); // Modal "Trabajar"
  const [editingRequest, setEditingRequest] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setUserId(user.uid);
    }
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) return;

      const querySnapshot = await getDocs(collection(db, "requests"));
      const fetchedRequests = querySnapshot.docs
        .map((doc) => ({ id: doc.id, ...(doc.data() as any) }))
        .filter((request) => request.userId === user.uid);

      setRequests(fetchedRequests);
    } catch (error) {
      Alert.alert("Error", "No se pudo cargar las solicitudes.");
    }
  };

  // --- Funciones para cambiar estados ---

  const handleSetEnCamino = async (request: any) => {
    try {
      const requestRef = doc(db, "requests", request.id);
      const timestamp = Date.now();
      await updateDoc(requestRef, {
        status: "en camino",
        enCaminoTimestamp: timestamp,
      });

      setRequests((prev) =>
        prev.map((r) =>
          r.id === request.id
            ? { ...r, status: "en camino", enCaminoTimestamp: timestamp }
            : r
        )
      );
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar el estado a 'En Camino'.");
    }
  };

  const handleSetEnSitio = async (request: any) => {
    try {
      const requestRef = doc(db, "requests", request.id);
      await updateDoc(requestRef, {
        status: "en sitio",
      });

      setRequests((prev) =>
        prev.map((r) => (r.id === request.id ? { ...r, status: "en sitio" } : r))
      );
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar el estado a 'En Sitio'.");
    }
  };

  const canSetEnSitio = (request: any) => {
    if (!request.enCaminoTimestamp) return false;
    const now = Date.now();
    const elapsed = now - request.enCaminoTimestamp;
    return elapsed >= 60000; // 1 minuto
  };

  // --- Otras funciones (crear, editar, eliminar, logout) ---

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      Alert.alert("Sesión cerrada", "Has cerrado sesión correctamente.");
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Error", "No se pudo cerrar sesión.");
    }
  };

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^\+?\d{7,15}$/;
    return phoneRegex.test(phone);
  };

  const handleCreateRequest = async () => {
    if (
      !newTitle ||
      !newDescription ||
      !newPrice ||
      !newAddress ||
      !newRequesterName ||
      !newPhoneNumber
    ) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }

    const priceValue = parseFloat(newPrice);
    if (isNaN(priceValue) || priceValue <= 0) {
      Alert.alert("Error", "El precio debe ser un número válido.");
      return;
    }

    if (!validatePhoneNumber(newPhoneNumber)) {
      Alert.alert("Error", "Número telefónico no válido.");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "requests"), {
        title: newTitle,
        description: newDescription,
        price: priceValue,
        address: newAddress,
        requesterName: newRequesterName,
        phoneNumber: newPhoneNumber,
        userId,
        status: "pendiente",
        enCaminoTimestamp: null,
      });

      setRequests((prev) => [
        ...prev,
        {
          id: docRef.id,
          title: newTitle,
          description: newDescription,
          price: priceValue,
          address: newAddress,
          requesterName: newRequesterName,
          phoneNumber: newPhoneNumber,
          status: "pendiente",
          enCaminoTimestamp: null,
        },
      ]);

      setModalVisible(false);
      setNewTitle("");
      setNewDescription("");
      setNewPrice("");
      setNewAddress("");
      setNewRequesterName("");
      setNewPhoneNumber("");
      Alert.alert("Éxito", "Solicitud creada correctamente.");
    } catch (error) {
      Alert.alert("Error", "No se pudo crear la solicitud.");
    }
  };

  const handleDeleteRequest = async (id: string) => {
    try {
      await deleteDoc(doc(db, "requests", id));
      setRequests((prev) => prev.filter((req) => req.id !== id));
      Alert.alert("Éxito", "Solicitud eliminada correctamente.");
    } catch (error) {
      Alert.alert("Error", "No se pudo eliminar la solicitud.");
    }
  };

  const handleEditRequest = async () => {
    if (!editingRequest) return;

    if (
      !newTitle ||
      !newDescription ||
      !newPrice ||
      !newAddress ||
      !newRequesterName ||
      !newPhoneNumber
    ) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }

    const priceValue = parseFloat(newPrice);
    if (isNaN(priceValue) || priceValue <= 0) {
      Alert.alert("Error", "El precio debe ser un número válido.");
      return;
    }

    if (!validatePhoneNumber(newPhoneNumber)) {
      Alert.alert("Error", "Número telefónico no válido.");
      return;
    }

    try {
      const requestRef = doc(db, "requests", editingRequest.id);
      await updateDoc(requestRef, {
        title: newTitle,
        description: newDescription,
        price: priceValue,
        address: newAddress,
        requesterName: newRequesterName,
        phoneNumber: newPhoneNumber,
      });

      setRequests((prev) =>
        prev.map((req) =>
          req.id === editingRequest.id
            ? {
                ...req,
                title: newTitle,
                description: newDescription,
                price: priceValue,
                address: newAddress,
                requesterName: newRequesterName,
                phoneNumber: newPhoneNumber,
              }
            : req
        )
      );

      setModalVisible(false);
      setEditingRequest(null);
      setNewTitle("");
      setNewDescription("");
      setNewPrice("");
      setNewAddress("");
      setNewRequesterName("");
      setNewPhoneNumber("");
      Alert.alert("Éxito", "Solicitud actualizada correctamente.");
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar la solicitud.");
    }
  };

  // --- Renderizado ---

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => setMenuVisible(true)}
      >
        <Ionicons name="menu" size={28} color="white" />
      </TouchableOpacity>

      <Text style={styles.title}>Solicitudes</Text>

      <Button title="Actualizar" onPress={fetchRequests} />

      <FlatList
        data={requests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.requestItem}>
            <Text style={styles.requestTitle}>{item.title}</Text>
            <Text>{item.description}</Text>
            <Text>Precio: ${item.price} COP</Text>
            <Text>Dirección: {item.address}</Text>
            <Text>Solicitante: {item.requesterName}</Text>
            <Text>Teléfono: {item.phoneNumber}</Text>
            <Text style={{ marginTop: 5, fontWeight: "bold" }}>
              Estado: {item.status}
            </Text>

            
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => {
                  setEditingRequest(item);
                  setNewTitle(item.title);
                  setNewDescription(item.description);
                  setNewPrice(item.price.toString());
                  setNewAddress(item.address || "");
                  setNewRequesterName(item.requesterName || "");
                  setNewPhoneNumber(item.phoneNumber || "");
                  setModalVisible(true);
                }}
              >
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteRequest(item.id)}
              >
                <Text style={styles.buttonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalBackground}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>
              {editingRequest ? "Editar Solicitud" : "Nueva Solicitud"}
            </Text>
            <TextInput
              placeholder="Título"
              style={styles.input}
              value={newTitle}
              onChangeText={setNewTitle}
            />
            <TextInput
              placeholder="Descripción"
              style={styles.input}
              value={newDescription}
              onChangeText={setNewDescription}
            />
            <TextInput
              placeholder="Precio"
              style={styles.input}
              value={newPrice}
              onChangeText={setNewPrice}
              keyboardType="numeric"
            />
            <TextInput
              placeholder="Dirección"
              style={styles.input}
              value={newAddress}
              onChangeText={setNewAddress}
            />
            <TextInput
              placeholder="Nombre del Solicitante"
              style={styles.input}
              value={newRequesterName}
              onChangeText={setNewRequesterName}
            />
            <TextInput
              placeholder="Número Telefónico"
              style={styles.input}
              value={newPhoneNumber}
              onChangeText={setNewPhoneNumber}
              keyboardType="phone-pad"
            />

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 10,
              }}
            >
              <Button
                title="Cancelar"
                onPress={() => {
                  setModalVisible(false);
                  setEditingRequest(null);
                  setNewTitle("");
                  setNewDescription("");
                  setNewPrice("");
                  setNewAddress("");
                  setNewRequesterName("");
                  setNewPhoneNumber("");
                }}
              />
              <Button
                title={editingRequest ? "Guardar Cambios" : "Crear Solicitud"}
                onPress={editingRequest ? handleEditRequest : handleCreateRequest}
              />
            </View>
          </View>
        </View>
      </Modal>

      
      <Modal animationType="slide" transparent={true} visible={menuVisible}>
        <View style={styles.menuModalBackground}>
          <View style={styles.menuModalView}>
            <Button title="Cerrar Menú" onPress={() => setMenuVisible(false)} />
            <Button
              title="Crear Nueva Solicitud"
              onPress={() => {
                setModalVisible(true);
                setMenuVisible(false);
              }}
            />
            <Button
              title="Trabajar"
              onPress={() => {
                setWorkModalVisible(true);
                setMenuVisible(false);
              }}
            />
            <Button title="Cerrar Sesión" onPress={handleLogout} color="red" />
          </View>
        </View>
      </Modal>

      
      <Modal animationType="slide" transparent={true} visible={workModalVisible}>
        <View style={styles.modalBackground}>
          <View style={[styles.modalView, { maxHeight: "80%" }]}>
            <Text style={styles.modalTitle}>Trabajar Solicitudes</Text>

            <FlatList
              data={requests}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                const now = Date.now();
                const elapsed = item.enCaminoTimestamp
                  ? now - item.enCaminoTimestamp
                  : 0;
                const timeLeft = Math.max(0, 60000 - elapsed);

                return (
                  <View
                    style={[
                      styles.requestItem,
                      { backgroundColor: "#e8f0fe", marginVertical: 8 },
                    ]}
                  >
                    <Text style={styles.requestTitle}>{item.title}</Text>
                    <Text>Estado: {item.status}</Text>

                    {item.status === "pendiente" && (
                      <Button
                        title="Marcar En Camino"
                        onPress={() => handleSetEnCamino(item)}
                      />
                    )}

                    {item.status === "en camino" && (
                      <>
                        <Button
                          title={
                            canSetEnSitio(item)
                              ? "Marcar En Sitio"
                              : `Espera ${Math.ceil(timeLeft / 1000)}s`
                          }
                          disabled={!canSetEnSitio(item)}
                          onPress={() => handleSetEnSitio(item)}
                        />
                      </>
                    )}

                    {item.status === "en sitio" && (
                      <Text style={{ fontWeight: "bold", color: "green" }}>
                        Ya estás en sitio
                      </Text>
                    )}
                  </View>
                );
              }}
            />

            <Button
              title="Cerrar"
              onPress={() => setWorkModalVisible(false)}
              color="#007AFF"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  menuButton: {
    position: "absolute",
    top: 30,
    left: 20,
    backgroundColor: "#007AFF",
    padding: 8,
    borderRadius: 20,
    zIndex: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  requestItem: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 8,
    marginVertical: 6,
  },
  requestTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-around",
  },
  editButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginVertical: 6,
  },
  menuModalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-start",
  },
  menuModalView: {
    backgroundColor: "white",
    padding: 20,
    paddingTop: 40,
    elevation: 10,
  },
});

export default HomeScreen;*/

/*import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  FlatList,
  Modal,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { getAuth, signOut } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";

const HomeScreen = ({ navigation }: any) => {
  const [requests, setRequests] = useState<any[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newRequesterName, setNewRequesterName] = useState("");
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [modalVisible, setModalVisible] = useState(false); // Crear/editar solicitud
  const [menuVisible, setMenuVisible] = useState(false); // Menú principal
  const [workModalVisible, setWorkModalVisible] = useState(false); // Modal trabajar
  const [incompleteModalVisible, setIncompleteModalVisible] = useState(false); // Modal motivo incompleto
  const [incompleteReason, setIncompleteReason] = useState("");
  const [incompleteRequest, setIncompleteRequest] = useState<any>(null);
  const [editingRequest, setEditingRequest] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setUserId(user.uid);
    }
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) return;

      const querySnapshot = await getDocs(collection(db, "requests"));
      const fetchedRequests = querySnapshot.docs
        .map((doc) => ({ id: doc.id, ...(doc.data() as any) }))
        .filter((request) => request.userId === user.uid);

      setRequests(fetchedRequests);
    } catch (error) {
      Alert.alert("Error", "No se pudo cargar las solicitudes.");
    }
  };

  // --- Cambiar estados ---

  const handleSetEnCamino = async (request: any) => {
    try {
      const requestRef = doc(db, "requests", request.id);
      const timestamp = Date.now();
      await updateDoc(requestRef, {
        status: "en camino",
        enCaminoTimestamp: timestamp,
      });

      setRequests((prev) =>
        prev.map((r) =>
          r.id === request.id
            ? { ...r, status: "en camino", enCaminoTimestamp: timestamp }
            : r
        )
      );
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar el estado a 'En Camino'.");
    }
  };

  const handleSetEnSitio = async (request: any) => {
    try {
      const requestRef = doc(db, "requests", request.id);
      await updateDoc(requestRef, {
        status: "en sitio",
      });

      setRequests((prev) =>
        prev.map((r) => (r.id === request.id ? { ...r, status: "en sitio" } : r))
      );
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar el estado a 'En Sitio'.");
    }
  };

  const canSetEnSitio = (request: any) => {
    if (!request.enCaminoTimestamp) return false;
    const now = Date.now();
    const elapsed = now - request.enCaminoTimestamp;
    return elapsed >= 60000; // 1 minuto
  };

  // --- Finalizar solicitud (Eliminar) ---

  const handleFinalizarSolicitud = async (requestId: string) => {
    try {
      await deleteDoc(doc(db, "requests", requestId));
      setRequests((prev) => prev.filter((req) => req.id !== requestId));
      Alert.alert("Éxito", "Solicitud finalizada y eliminada.");
    } catch (error) {
      Alert.alert("Error", "No se pudo eliminar la solicitud.");
    }
  };

  // --- Marcar como incompleto (abrir modal) ---

  const abrirModalIncompleto = (request: any) => {
    setIncompleteRequest(request);
    setIncompleteReason("");
    setIncompleteModalVisible(true);
  };

  // --- Guardar motivo incompleto y regresar a pendiente ---

  const guardarMotivoIncompleto = async () => {
    if (!incompleteReason.trim()) {
      Alert.alert("Error", "Debe ingresar un motivo para marcar incompleto.");
      return;
    }
    try {
      if (!incompleteRequest) return;

      const requestRef = doc(db, "requests", incompleteRequest.id);
      await updateDoc(requestRef, {
        status: "pendiente",
        incompleteReason: incompleteReason.trim(),
        enCaminoTimestamp: null,
      });

      setRequests((prev) =>
        prev.map((req) =>
          req.id === incompleteRequest.id
            ? {
                ...req,
                status: "pendiente",
                incompleteReason: incompleteReason.trim(),
                enCaminoTimestamp: null,
              }
            : req
        )
      );

      setIncompleteModalVisible(false);
      setIncompleteRequest(null);
      setIncompleteReason("");
      Alert.alert("Éxito", "Solicitud marcada como incompleta y pendiente.");
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar la solicitud.");
    }
  };

  // --- Otras funciones (crear, editar, eliminar, logout, validar teléfono) ---

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      Alert.alert("Sesión cerrada", "Has cerrado sesión correctamente.");
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Error", "No se pudo cerrar sesión.");
    }
  };

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^\+?\d{7,15}$/;
    return phoneRegex.test(phone);
  };

  const handleCreateRequest = async () => {
    if (
      !newTitle ||
      !newDescription ||
      !newPrice ||
      !newAddress ||
      !newRequesterName ||
      !newPhoneNumber
    ) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }

    const priceValue = parseFloat(newPrice);
    if (isNaN(priceValue) || priceValue <= 0) {
      Alert.alert("Error", "El precio debe ser un número válido.");
      return;
    }

    if (!validatePhoneNumber(newPhoneNumber)) {
      Alert.alert("Error", "Número telefónico no válido.");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "requests"), {
        title: newTitle,
        description: newDescription,
        price: priceValue,
        address: newAddress,
        requesterName: newRequesterName,
        phoneNumber: newPhoneNumber,
        userId,
        status: "pendiente",
        enCaminoTimestamp: null,
        incompleteReason: "",
      });

      setRequests((prev) => [
        ...prev,
        {
          id: docRef.id,
          title: newTitle,
          description: newDescription,
          price: priceValue,
          address: newAddress,
          requesterName: newRequesterName,
          phoneNumber: newPhoneNumber,
          status: "pendiente",
          enCaminoTimestamp: null,
          incompleteReason: "",
        },
      ]);

      setModalVisible(false);
      setNewTitle("");
      setNewDescription("");
      setNewPrice("");
      setNewAddress("");
      setNewRequesterName("");
      setNewPhoneNumber("");
      Alert.alert("Éxito", "Solicitud creada correctamente.");
    } catch (error) {
      Alert.alert("Error", "No se pudo crear la solicitud.");
    }
  };

  const handleDeleteRequest = async (id: string) => {
    try {
      await deleteDoc(doc(db, "requests", id));
      setRequests((prev) => prev.filter((req) => req.id !== id));
      Alert.alert("Éxito", "Solicitud eliminada correctamente.");
    } catch (error) {
      Alert.alert("Error", "No se pudo eliminar la solicitud.");
    }
  };

  const handleEditRequest = async () => {
    if (!editingRequest) return;

    if (
      !newTitle ||
      !newDescription ||
      !newPrice ||
      !newAddress ||
      !newRequesterName ||
      !newPhoneNumber
    ) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }

    const priceValue = parseFloat(newPrice);
    if (isNaN(priceValue) || priceValue <= 0) {
      Alert.alert("Error", "El precio debe ser un número válido.");
      return;
    }

    if (!validatePhoneNumber(newPhoneNumber)) {
      Alert.alert("Error", "Número telefónico no válido.");
      return;
    }

    try {
      const requestRef = doc(db, "requests", editingRequest.id);
      await updateDoc(requestRef, {
        title: newTitle,
        description: newDescription,
        price: priceValue,
        address: newAddress,
        requesterName: newRequesterName,
        phoneNumber: newPhoneNumber,
      });

      setRequests((prev) =>
        prev.map((req) =>
          req.id === editingRequest.id
            ? {
                ...req,
                title: newTitle,
                description: newDescription,
                price: priceValue,
                address: newAddress,
                requesterName: newRequesterName,
                phoneNumber: newPhoneNumber,
              }
            : req
        )
      );

      setModalVisible(false);
      setEditingRequest(null);
      setNewTitle("");
      setNewDescription("");
      setNewPrice("");
      setNewAddress("");
      setNewRequesterName("");
      setNewPhoneNumber("");
      Alert.alert("Éxito", "Solicitud actualizada correctamente.");
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar la solicitud.");
    }
  };

  // --- Renderizado principal ---

  return (
    <View style={styles.container}>
      {/* Botón menú *//*}
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => setMenuVisible(true)}
      >
        <Ionicons name="menu" size={30} color="white" />
      </TouchableOpacity>

      <Text style={styles.title}>Solicitudes</Text>

      {/* Lista principal *//*}
      <FlatList
        data={requests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.requestItem}>
            <Text style={styles.requestTitle}>{item.title}</Text>
            <Text>Estado: {item.status}</Text>
            {item.incompleteReason ? (
              <Text style={{ color: "red" }}>
                Motivo incompleto: {item.incompleteReason}
              </Text>
            ) : null}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => {
                  setEditingRequest(item);
                  setNewTitle(item.title);
                  setNewDescription(item.description);
                  setNewPrice(item.price.toString());
                  setNewAddress(item.address);
                  setNewRequesterName(item.requesterName);
                  setNewPhoneNumber(item.phoneNumber);
                  setModalVisible(true);
                }}
              >
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() =>
                  Alert.alert(
                    "Confirmar",
                    "¿Eliminar esta solicitud?",
                    [
                      { text: "Cancelar" },
                      {
                        text: "Eliminar",
                        style: "destructive",
                        onPress: () => handleDeleteRequest(item.id),
                      },
                    ],
                    { cancelable: true }
                  )
                }
              >
                <Text style={styles.buttonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Modal menú *//*}
      <Modal animationType="slide" transparent={true} visible={menuVisible}>
        <View style={styles.menuModalBackground}>
          <View style={styles.menuModalView}>
            <Button
              title="Crear Nueva Solicitud"
              onPress={() => {
                setModalVisible(true);
                setMenuVisible(false);
              }}
            />
            <Button
              title="Trabajar"
              onPress={() => {
                setWorkModalVisible(true);
                setMenuVisible(false);
              }}
            />
            <Button title="Cerrar Sesión" onPress={handleLogout} color="red" />
          </View>
        </View>
      </Modal>

      {/* Modal para crear/editar solicitud *//*}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalBackground}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>
              {editingRequest ? "Editar Solicitud" : "Nueva Solicitud"}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Título"
              value={newTitle}
              onChangeText={setNewTitle}
            />
            <TextInput
              style={styles.input}
              placeholder="Descripción"
              value={newDescription}
              onChangeText={setNewDescription}
              multiline
            />
            <TextInput
              style={styles.input}
              placeholder="Precio"
              value={newPrice}
              onChangeText={setNewPrice}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Dirección"
              value={newAddress}
              onChangeText={setNewAddress}
            />
            <TextInput
              style={styles.input}
              placeholder="Nombre solicitante"
              value={newRequesterName}
              onChangeText={setNewRequesterName}
            />
            <TextInput
              style={styles.input}
              placeholder="Número telefónico"
              value={newPhoneNumber}
              onChangeText={setNewPhoneNumber}
              keyboardType="phone-pad"
            />

            <Button
              title={editingRequest ? "Guardar Cambios" : "Crear Solicitud"}
              onPress={editingRequest ? handleEditRequest : handleCreateRequest}
            />
            <Button
              title="Cancelar"
              onPress={() => {
                setModalVisible(false);
                setEditingRequest(null);
                setNewTitle("");
                setNewDescription("");
                setNewPrice("");
                setNewAddress("");
                setNewRequesterName("");
                setNewPhoneNumber("");
              }}
              color="red"
            />
          </View>
        </View>
      </Modal>

      {/* Modal trabajar solicitudes *//*}
      <Modal animationType="slide" transparent={true} visible={workModalVisible}>
        <View style={styles.modalBackground}>
          <View style={[styles.modalView, { maxHeight: "80%" }]}>
            <Text style={styles.modalTitle}>Trabajar Solicitudes</Text>

            <FlatList
              data={requests}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                const now = Date.now();
                const elapsed = item.enCaminoTimestamp
                  ? now - item.enCaminoTimestamp
                  : 0;
                const timeLeft = Math.max(0, 60000 - elapsed);

                return (
                  <View
                    style={[
                      styles.requestItem,
                      { backgroundColor: "#e8f0fe", marginVertical: 8 },
                    ]}
                  >
                    <Text style={styles.requestTitle}>{item.title}</Text>
                    <Text>Estado: {item.status}</Text>
                    {item.incompleteReason ? (
                      <Text style={{ color: "red" }}>
                        Motivo incompleto: {item.incompleteReason}
                      </Text>
                    ) : null}

                    {item.status === "pendiente" && (
                      <Button
                        title="Marcar En Camino"
                        onPress={() => handleSetEnCamino(item)}
                      />
                    )}

                    {item.status === "en camino" && (
                      <>
                        <Button
                          title={
                            canSetEnSitio(item)
                              ? "Marcar En Sitio"
                              : `Espera ${Math.ceil(timeLeft / 1000)}s`
                          }
                          disabled={!canSetEnSitio(item)}
                          onPress={() => handleSetEnSitio(item)}
                        />
                      </>
                    )}

                    {item.status === "en sitio" && (
                      <>
                        <Button
                          title="Finalizado"
                          onPress={() =>
                            Alert.alert(
                              "Confirmar",
                              "¿Finalizar y eliminar esta solicitud?",
                              [
                                { text: "Cancelar" },
                                {
                                  text: "Finalizar",
                                  onPress: () => handleFinalizarSolicitud(item.id),
                                  style: "destructive",
                                },
                              ]
                            )
                          }
                          color="green"
                        />
                        <Button
                          title="Incompleto"
                          onPress={() => abrirModalIncompleto(item)}
                          color="#FFA500"
                        />
                      </>
                    )}
                  </View>
                );
              }}
            />

            <Button
              title="Cerrar"
              onPress={() => setWorkModalVisible(false)}
              color="#007AFF"
            />
          </View>
        </View>
      </Modal>

      {/* Modal motivo incompleto *//*}
      <Modal
        animationType="slide"
        transparent={true}
        visible={incompleteModalVisible}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Motivo de servicio incompleto</Text>
            <TextInput
              style={[styles.input, { height: 80 }]}
              placeholder="Describe el motivo por el que no se completó el servicio"
              value={incompleteReason}
              onChangeText={setIncompleteReason}
              multiline
            />
            <Button title="Guardar" onPress={guardarMotivoIncompleto} />
            <Button
              title="Cancelar"
              color="red"
              onPress={() => {
                setIncompleteModalVisible(false);
                setIncompleteRequest(null);
                setIncompleteReason("");
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  menuButton: {
    position: "absolute",
    top: 30,
    left: 20,
    backgroundColor: "#007AFF",
    padding: 8,
    borderRadius: 20,
    zIndex: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  requestItem: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 8,
    marginVertical: 6,
  },
  requestTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-around",
  },
  editButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginVertical: 6,
  },
  menuModalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-start",
  },
  menuModalView: {
    backgroundColor: "white",
    padding: 20,
    paddingTop: 40,
    elevation: 10,
  },
});

export default HomeScreen;*/

import React, { useState, useEffect } from "react";
import {
  View, Text, Button, TextInput, FlatList, Modal, Alert,
  StyleSheet, TouchableOpacity
} from "react-native";
import {
  collection, addDoc, getDocs, updateDoc, deleteDoc, doc
} from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { getAuth, signOut } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";

const HomeScreen = ({ navigation }: any) => {
  const [requests, setRequests] = useState<any[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newRequesterName, setNewRequesterName] = useState("");
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [editingRequest, setEditingRequest] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isWorkingMode, setIsWorkingMode] = useState(false);
  const [incompleteReason, setIncompleteReason] = useState("");
  const [buttonsState, setButtonsState] = useState<{ [key: string]: string }>({});

  const fetchRequests = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const querySnapshot = await getDocs(collection(db, "requests"));
      const fetchedRequests = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...(doc.data() as any) }));

      const filtered = isWorkingMode ? fetchedRequests : fetchedRequests.filter(req => req.userId === user.uid);

      setRequests(filtered);
      const states: { [key: string]: string } = {};
      filtered.forEach(req => {
        states[req.id] = req.status;
      });
      setButtonsState(states);
    } catch (error) {
      Alert.alert("Error", "No se pudo cargar las solicitudes.");
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setUserId(user.uid);
    }
    fetchRequests();
  }, [isWorkingMode]);

  const updateRequestStatus = async (id: string, newStatus: string, extraData = {}) => {
    const requestRef = doc(db, "requests", id);
    await updateDoc(requestRef, { status: newStatus, ...extraData });
    fetchRequests();
  };

  const handleStatusAdvance = async (id: string, status: string) => {
    if (status === "pendiente") {
      updateRequestStatus(id, "aceptado");
    } else if (status === "aceptado") {
      updateRequestStatus(id, "en camino");
      setTimeout(() => {
        updateRequestStatus(id, "en sitio");
      }, 60000);
    }
  };

  const handleFinalize = async (id: string) => {
    await updateRequestStatus(id, "finalizado");
    fetchRequests();
    Alert.alert("Finalizado", "Solicitud marcada como finalizada.");
  };

  const handleIncomplete = async (id: string) => {
    if (!incompleteReason.trim()) {
      Alert.alert("Error", "Debes escribir el motivo de la incompletitud.");
      return;
    }
    await updateRequestStatus(id, "pendiente", { reason: incompleteReason });
    setIncompleteReason("");
  };

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      Alert.alert("Sesión cerrada", "Has cerrado sesión correctamente.");
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Error", "No se pudo cerrar sesión.");
    }
  };

  const handleCreateRequest = async () => {
    if (!newTitle || !newDescription || !newPrice || !newAddress || !newRequesterName || !newPhoneNumber) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }

    const priceValue = parseFloat(newPrice);
    if (isNaN(priceValue) || priceValue <= 0) {
      Alert.alert("Error", "El precio debe ser un número válido.");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "requests"), {
        title: newTitle,
        description: newDescription,
        price: priceValue,
        address: newAddress,
        requesterName: newRequesterName,
        phoneNumber: newPhoneNumber,
        userId,
        status: "pendiente",
      });

      fetchRequests();
      setModalVisible(false);
      setNewTitle("");
      setNewDescription("");
      setNewPrice("");
      setNewAddress("");
      setNewRequesterName("");
      setNewPhoneNumber("");
      Alert.alert("Éxito", "Solicitud creada correctamente.");
    } catch (error) {
      Alert.alert("Error", "No se pudo crear la solicitud.");
    }
  };

  const handleDeleteRequest = async (id: string) => {
    try {
      await deleteDoc(doc(db, "requests", id));
      fetchRequests();
      Alert.alert("Éxito", "Solicitud eliminada correctamente.");
    } catch (error) {
      Alert.alert("Error", "No se pudo eliminar la solicitud.");
    }
  };

  const handleEditRequest = async () => {
    if (!editingRequest) return;

    const priceValue = parseFloat(newPrice);
    if (isNaN(priceValue) || priceValue <= 0) {
      Alert.alert("Error", "El precio debe ser un número válido.");
      return;
    }

    try {
      const requestRef = doc(db, "requests", editingRequest.id);
      await updateDoc(requestRef, {
        title: newTitle,
        description: newDescription,
        price: priceValue,
        address: newAddress,
        requesterName: newRequesterName,
        phoneNumber: newPhoneNumber,
      });

      fetchRequests();
      setModalVisible(false);
      setEditingRequest(null);
      setNewTitle("");
      setNewDescription("");
      setNewPrice("");
      setNewAddress("");
      setNewRequesterName("");
      setNewPhoneNumber("");
      Alert.alert("Éxito", "Solicitud actualizada correctamente.");
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar la solicitud.");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.menuButton} onPress={() => setMenuVisible(true)}>
        <Ionicons name="menu" size={28} color="white" />
      </TouchableOpacity>

      <Text style={styles.title}>Solicitudes</Text>

      <Button title="Actualizar" onPress={fetchRequests} />

      <FlatList
        data={requests}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.requestItem}>
            <Text style={styles.requestTitle}>{item.title}</Text>
            <Text>{item.description}</Text>
            <Text>Precio: ${item.price} COP</Text>
            <Text>Dirección: {item.address}</Text>
            <Text>Solicitante: {item.requesterName}</Text>
            <Text>Teléfono: {item.phoneNumber}</Text>
            <Text>Estado: {item.status}</Text>
            {item.reason && <Text>Motivo Incompleto: {item.reason}</Text>}

            {!isWorkingMode && item.userId === userId && (
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => {
                    setEditingRequest(item);
                    setNewTitle(item.title);
                    setNewDescription(item.description);
                    setNewPrice(item.price.toString());
                    setNewAddress(item.address || "");
                    setNewRequesterName(item.requesterName || "");
                    setNewPhoneNumber(item.phoneNumber || "");
                    setModalVisible(true);
                  }}
                >
                  <Text style={styles.buttonText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteRequest(item.id)}>
                  <Text style={styles.buttonText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            )}

            {isWorkingMode && (
              <View style={{ marginTop: 10 }}>
                {buttonsState[item.id] === "pendiente" && (
                  <Button title="Aceptar" onPress={() => handleStatusAdvance(item.id, "pendiente")} />
                )}
                {buttonsState[item.id] === "aceptado" && (
                  <Button title="En camino" onPress={() => handleStatusAdvance(item.id, "aceptado")} />
                )}
                {buttonsState[item.id] === "en camino" && (
                  <Text>Esperando 1 minuto para habilitar "En sitio"...</Text>
                )}
                {buttonsState[item.id] === "en sitio" && (
                  <View>
                    <Button title="Finalizado" onPress={() => handleFinalize(item.id)} />
                    <TextInput
                      placeholder="Motivo si no se completó"
                      style={styles.input}
                      value={incompleteReason}
                      onChangeText={setIncompleteReason}
                    />
                    <Button title="Incompleto" color="orange" onPress={() => handleIncomplete(item.id)} />
                  </View>
                )}
              </View>
            )}
          </View>
        )}
      />

      {!isWorkingMode && (
        <Button
          title="Crear Solicitud"
          onPress={() => {
            setEditingRequest(null);
            setNewTitle("");
            setNewDescription("");
            setNewPrice("");
            setNewAddress("");
            setNewRequesterName("");
            setNewPhoneNumber("");
            setModalVisible(true);
          }}
        />
      )}

      {/* MODAL DE CREACIÓN/EDICIÓN */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput style={styles.input} placeholder="Título" value={newTitle} onChangeText={setNewTitle} />
            <TextInput style={styles.input} placeholder="Descripción" value={newDescription} onChangeText={setNewDescription} />
            <TextInput style={styles.input} placeholder="Precio (COP)" value={newPrice} onChangeText={setNewPrice} keyboardType="numeric" />
            <TextInput style={styles.input} placeholder="Dirección" value={newAddress} onChangeText={setNewAddress} />
            <TextInput style={styles.input} placeholder="Nombre del solicitante" value={newRequesterName} onChangeText={setNewRequesterName} />
            <TextInput style={styles.input} placeholder="Número telefónico" value={newPhoneNumber} onChangeText={setNewPhoneNumber} keyboardType="phone-pad" />
            <Button title={editingRequest ? "Actualizar" : "Guardar"} onPress={editingRequest ? handleEditRequest : handleCreateRequest} />
            <Button title="Cancelar" color="red" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>

      {/* MENU MODAL */}
      <Modal visible={menuVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.menuOverlay} onPress={() => setMenuVisible(false)}>
          <View style={styles.menuContainer}>
            <Button title="Ver Perfil" onPress={() => { setMenuVisible(false); navigation.navigate("ProfileScreen"); }} />
            <Button title="Información de la app" onPress={() => { setMenuVisible(false); Alert.alert("Info", "App creada por ti 😄"); }} />
            <Button title="Trabajar" onPress={() => { setMenuVisible(false); setIsWorkingMode(true); }} />
            <Button title="Dejar de trabajar" onPress={() => { setMenuVisible(false); setIsWorkingMode(false); }} />
            <Button title="Solicitudes Completadas" onPress={() => {setMenuVisible(false); navigation.navigate("CompletedRequests"); }} />
            <Button title="Cerrar Sesión" color="red" onPress={handleLogout} />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  requestItem: { padding: 15, backgroundColor: "#f9f9f9", marginVertical: 8, borderRadius: 5 },
  requestTitle: { fontSize: 18, fontWeight: "bold" },
  buttonContainer: { flexDirection: "row", marginTop: 10 },
  editButton: { backgroundColor: "blue", padding: 10, borderRadius: 5, marginRight: 10 },
  deleteButton: { backgroundColor: "red", padding: 10, borderRadius: 5 },
  buttonText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)" },
  modalContent: { width: "80%", backgroundColor: "white", padding: 20, borderRadius: 10, elevation: 5 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10, borderRadius: 5 },
  menuButton: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "black",
    padding: 10,
    borderRadius: 25,
    zIndex: 10,
  },
  menuOverlay: { flex: 1, justifyContent: "flex-start", alignItems: "flex-end", paddingTop: 90, paddingRight: 20, backgroundColor: "rgba(0,0,0,0.3)" },
  menuContainer: { width: 200, backgroundColor: "#fff", borderRadius: 10, padding: 10, elevation: 10 },
});

export default HomeScreen;