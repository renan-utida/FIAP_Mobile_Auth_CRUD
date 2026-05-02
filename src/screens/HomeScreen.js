import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  ScrollView,
} from "react-native";
import {
  createProduct,
  getProducts,
  deleteProduct,
  updateProduct,
} from "../firebase/productService";

function formatPrice(value) {
  const onlyNumbers = value.replace(/\D/g, "");
  const cents = parseInt(onlyNumbers || "0", 10);
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function parsePriceToSave(formatted) {
  return formatted.replace(/[R$\s.]/g, "").replace(",", ".");
}

export default function HomeScreen({ navigation, route }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [barcode, setBarcode] = useState("");
  const [products, setProducts] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);

  async function loadProducts() {
    try {
      const productList = await getProducts();
      setProducts(productList);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível carregar os produtos.");
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (route.params?.scannedBarcode) {
      setBarcode(String(route.params.scannedBarcode));
    }
    if (route.params?.savedName) {
      setName(route.params.savedName);
    }
    if (route.params?.savedPrice) {
      setPrice(route.params.savedPrice);
    }
    if (route.params?.savedEditingId) {
      setEditingProductId(route.params.savedEditingId);
    }
  }, [route.params]);

  function clearForm() {
    setName("");
    setPrice("");
    setBarcode("");
    setEditingProductId(null);
  }

  function handlePriceChange(value) {
    setPrice(formatPrice(value));
  }

  async function handleSaveProduct() {
    if (!name.trim() || !price.trim()) {
      Alert.alert("Atenção", "Preencha nome e preço do produto.");
      return;
    }

    const productData = {
      name: name.trim(),
      price: parsePriceToSave(price),
      barcode: barcode ? String(barcode).trim() : "",
    };

    try {
      if (editingProductId) {
        await updateProduct(editingProductId, productData);
        Alert.alert("Sucesso", "Produto atualizado com sucesso!");
      } else {
        await createProduct(productData);
        Alert.alert("Sucesso", "Produto cadastrado com sucesso!");
      }

      clearForm();
      await loadProducts();
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível salvar o produto.");
    }
  }

  function handleEditProduct(product) {
    setName(product.name || "");
    setPrice(
      product.price
        ? formatPrice(String(Math.round(parseFloat(product.price) * 100)))
        : ""
    );
    setBarcode(product.barcode || "");
    setEditingProductId(product.id);
  }

  function handleCancelEdit() {
    clearForm();
  }

  async function handleDeleteProduct(productId) {
    Alert.alert(
      "Excluir produto",
      "Tem certeza que deseja excluir este produto?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteProduct(productId);

              if (editingProductId === productId) {
                clearForm();
              }

              Alert.alert("Sucesso", "Produto excluído com sucesso!");
              await loadProducts();
            } catch (error) {
              console.error(error);
              Alert.alert("Erro", "Não foi possível excluir o produto.");
            }
          },
        },
      ]
    );
  }

  function handleOpenScanner() {
    navigation.navigate("BarcodeScanner", {
      savedName: name,
      savedPrice: price,
      savedEditingId: editingProductId || "",
    });
  }

  function formatDisplayPrice(rawPrice) {
    if (!rawPrice) return "Não informado";
    const number = parseFloat(rawPrice);
    if (isNaN(number)) return rawPrice;
    return number.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={{ fontSize: 24, marginTop: 40, marginBottom: 20 }}>
            Bem-vindo!
          </Text>

          <View style={{ marginBottom: 20 }}>
            <Button title="Ler código de barras" onPress={handleOpenScanner} />
          </View>

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
            placeholder="Preço (R$)"
            value={price}
            onChangeText={handlePriceChange}
            keyboardType="numeric"
            style={{
              borderWidth: 1,
              marginBottom: 10,
              padding: 10,
              borderRadius: 5,
            }}
          />

          <TextInput
            placeholder="Código de barras"
            value={barcode}
            onChangeText={setBarcode}
            style={{
              borderWidth: 1,
              marginBottom: 20,
              padding: 10,
              borderRadius: 5,
            }}
          />

          <Button
            title={editingProductId ? "Atualizar produto" : "Cadastrar produto"}
            onPress={handleSaveProduct}
          />

          {editingProductId && (
            <View style={{ marginTop: 10 }}>
              <Button title="Cancelar edição" onPress={handleCancelEdit} />
            </View>
          )}

          <Text style={{ fontSize: 20, marginTop: 30, marginBottom: 10 }}>
            Produtos cadastrados
          </Text>

          <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
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
                <Text>Preço: {formatDisplayPrice(item.price)}</Text>
                <Text>
                  Código de barras: {item.barcode || "Não informado"}
                </Text>

                <View style={{ marginTop: 10 }}>
                  <Button
                    title="Editar"
                    onPress={() => handleEditProduct(item)}
                  />
                </View>

                <View style={{ marginTop: 10 }}>
                  <Button
                    title="Excluir"
                    onPress={() => handleDeleteProduct(item.id)}
                  />
                </View>
              </View>
            )}
          />

          <View style={{ marginTop: 20 }}>
            <Button
              title="Sair"
              onPress={() => navigation.navigate("Login")}
            />
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}