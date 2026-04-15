import { View, Text } from 'react-native';

export default function BarcodeScannerScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      }}
    >
      <Text style={{ fontSize: 24, marginBottom: 10 }}>
        Leitor de Código de Barras
      </Text>
      <Text style={{ textAlign: 'center' }}>
        Tela criada com sucesso. No próximo passo vamos ativar a câmera.
      </Text>
    </View>
  );
}