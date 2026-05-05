import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
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
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteProduct(productId);
              if (editingProductId === productId) clearForm();
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
      style={styles.keyboardView}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Produtos</Text>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.logoutText}>Sair</Text>
            </TouchableOpacity>
          </View>

          {/* Botão Scanner */}
          <TouchableOpacity style={styles.scannerButton} onPress={handleOpenScanner}>
            <Text style={styles.scannerButtonText}>📷  Ler código de barras</Text>
          </TouchableOpacity>

          {/* Formulário */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              {editingProductId ? "Editar produto" : "Novo produto"}
            </Text>

            <Text style={styles.label}>Nome</Text>
            <TextInput
              placeholder="Nome do produto"
              placeholderTextColor="#666"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />

            <Text style={styles.label}>Preço</Text>
            <TextInput
              placeholder="R$ 0,00"
              placeholderTextColor="#666"
              value={price}
              onChangeText={handlePriceChange}
              keyboardType="numeric"
              style={styles.input}
            />

            <Text style={styles.label}>Código de barras</Text>
            <TextInput
              placeholder="Leia ou digite o código"
              placeholderTextColor="#666"
              value={barcode}
              onChangeText={setBarcode}
              style={styles.input}
            />

            <TouchableOpacity style={styles.buttonPrimary} onPress={handleSaveProduct}>
              <Text style={styles.buttonPrimaryText}>
                {editingProductId ? "Atualizar produto" : "Cadastrar produto"}
              </Text>
            </TouchableOpacity>

            {editingProductId && (
              <TouchableOpacity style={styles.buttonCancel} onPress={handleCancelEdit}>
                <Text style={styles.buttonCancelText}>Cancelar edição</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Lista */}
          <Text style={styles.sectionTitle}>Produtos cadastrados</Text>

          <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Nenhum produto cadastrado.</Text>
            }
            renderItem={({ item }) => (
              <View style={styles.productCard}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>
                  {formatDisplayPrice(item.price)}
                </Text>
                <Text style={styles.productBarcode}>
                  🔖 {item.barcode || "Sem código de barras"}
                </Text>

                <View style={styles.productActions}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleEditProduct(item)}
                  >
                    <Text style={styles.editButtonText}>Editar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteProduct(item.id)}
                  >
                    <Text style={styles.deleteButtonText}>Excluir</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#0D0D0D',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  logoutButton: {
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  logoutText: {
    color: '#888',
    fontSize: 14,
    fontWeight: '600',
  },
  scannerButton: {
    backgroundColor: '#7C3AED',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  scannerButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    marginBottom: 28,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    color: '#AAA',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  input: {
    backgroundColor: '#242424',
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    color: '#FFF',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  buttonPrimary: {
    backgroundColor: '#7C3AED',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonPrimaryText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonCancel: {
    backgroundColor: 'transparent',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#444',
  },
  buttonCancelText: {
    color: '#888',
    fontSize: 15,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 14,
  },
  emptyText: {
    color: '#555',
    fontSize: 15,
    textAlign: 'center',
    paddingVertical: 20,
  },
  productCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  productName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7C3AED',
    marginBottom: 6,
  },
  productBarcode: {
    fontSize: 13,
    color: '#666',
    marginBottom: 14,
  },
  productActions: {
    flexDirection: 'row',
    gap: 10,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#242424',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#7C3AED',
  },
  editButtonText: {
    color: '#7C3AED',
    fontWeight: '600',
    fontSize: 14,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#242424',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  deleteButtonText: {
    color: '#EF4444',
    fontWeight: '600',
    fontSize: 14,
  },
});