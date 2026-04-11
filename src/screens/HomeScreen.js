import { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert, FlatList } from 'react-native';
import { createProduct, getProducts } from '../firebase/productService';

export default function HomeScreen({ navigation }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [products, setProducts] = useState([]);

  async function loadProducts() {
    try {
      const productList = await getProducts();
      setProducts(productList);
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível carregar os produtos.');
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

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
      loadProducts();
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível cadastrar o produto.');
    }
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, marginTop: 40, marginBottom: 20 }}>
        Bem-vindo!
      </Text>

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

      <Text style={{ fontSize: 20, marginTop: 30, marginBottom: 10 }}>
        Produtos cadastrados
      </Text>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text>Nenhum produto cadastrado.</Text>}
        renderItem={({ item }) => (
          <View
            style={{
              borderWidth: 1,
              borderRadius: 5,
              padding: 10,
              marginBottom: 10,
            }}
          >
            <Text>Nome: {item.name}</Text>
            <Text>Preço: {item.price}</Text>
          </View>
        )}
      />

      <View style={{ marginTop: 10 }}>
        <Button title="Sair" onPress={() => navigation.navigate('Login')} />
      </View>
    </View>
  );
}