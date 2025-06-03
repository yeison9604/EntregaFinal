import React from 'react';
import { View, Text } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

// Definir el tipo del Stack Navigator
type RootStackParamList = {
  Requests: undefined;
  RequestDetail: { requestId: string; title: string };
};

// Tipar las props de RequestDetailScreen
type Props = StackScreenProps<RootStackParamList, 'RequestDetail'>;

const RequestDetailScreen: React.FC<Props> = ({ route }) => {
  const { requestId, title } = route.params;  // ✅ Ahora TypeScript sabe qué datos tiene

  return (
    <View>
      <Text>Detalles de la Solicitud</Text>
      <Text>ID: {requestId}</Text>
      <Text>Título: {title}</Text>
    </View>
  );
};

export default RequestDetailScreen;