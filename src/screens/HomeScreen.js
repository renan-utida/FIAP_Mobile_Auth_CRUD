import { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { createProduct } from '../firebase/productService';

export default function HomeScreen({ navigation }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  async function handleAddProduct() {
    if (!name.trim() || !price.trim()) {
      Alert.alert('Atenção', 'Preencha nome e preço do produto.');
      return;
    }

    try {
      await createProduct({
        name: name.trim(),
        price: price.trim(),
      });
      Alert.alert('Sucesso', 'Produto cadastrado com sucesso!');
      setName('');
      setPrice('');
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível cadastrar o produto.');
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Bem-vindo!</Text>

      <TextInput
        placeholder="Nome do produto"
        value={name}
        onChangeText={setName}
        style={{
          borderWidth: 1,
          marginBottom: 10,
          padding: 10,
          borderRadius: 5,
        }}
      />

      <TextInput
        placeholder="Preço"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        style={{
          borderWidth: 1,
          marginBottom: 20,
          padding: 10,
          borderRadius: 5,
        }}
      />

      <Button title="Cadastrar produto" onPress={handleAddProduct} />

      <View style={{ marginTop: 20 }}>
        <Button title="Sair" onPress={() => navigation.navigate('Login')} />
      </View>
    </View>
  );
}