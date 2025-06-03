import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { db } from '../config/firebaseConfig';
import { collection, onSnapshot } from 'firebase/firestore';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'CreatedRequests'>;

type Request = {
  id: string;
  title: string;
};

const CreatedRequestsScreen: React.FC<Props> = ({ navigation, route }) => {
  const [requests, setRequests] = useState<Request[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'requests'), (snapshot) => {
      setRequests(
        snapshot.docs.map(doc => {
          const data = doc.data() as { title?: string };
          return { id: doc.id, title: data.title ?? 'Sin título' };
        })
      );
    });

    return unsubscribe;
  }, []);

  return (
    <View>
      <Text>Solicitudes Creadas</Text>
      <FlatList
        data={requests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderBottomWidth: 1 }}>
            <Text>{item.title}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default CreatedRequestsScreen;