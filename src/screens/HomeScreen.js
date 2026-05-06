import { useEffect, useState, useRef } from "react";
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

  const scrollViewRef = useRef(null);
  const formYRef = useRef(0);

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

    // Scroll automático até o formulário
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: formYRef.current - 10, animated: true });
    }, 100);
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
      {/* Header  */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerGreeting}>Bem-vindo!</Text>
          <Text style={styles.headerTitle}>Meus Produtos</Text>
        </View>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          {/* Card */}
          <View
            style={styles.card}
            onLayout={(e) => {
              formYRef.current = e.nativeEvent.layout.y;
            }}
          >
            <Text style={styles.cardTitle}>
              {editingProductId ? "Editar produto" : "Novo produto"}
            </Text>

            {/* Scanner */}
            <TouchableOpacity
              style={styles.scannerButton}
              onPress={handleOpenScanner}
            >
              <Text style={styles.scannerButtonText}>📷  Ler código de barras</Text>
            </TouchableOpacity>

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

            <TouchableOpacity
              style={styles.buttonPrimary}
              onPress={handleSaveProduct}
            >
              <Text style={styles.buttonPrimaryText}>
                {editingProductId ? "Atualizar produto" : "Cadastrar produto"}
              </Text>
            </TouchableOpacity>

            {editingProductId && (
              <TouchableOpacity
                style={styles.buttonCancel}
                onPress={handleCancelEdit}
              >
                <Text style={styles.buttonCancelText}>Cancelar edição</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Produtos cadastrados</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{products.length}</Text>
            </View>
          </View>

          <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Nenhum produto cadastrado.</Text>
            }
            renderItem={({ item }) => (
              <View style={styles.productCard}>

                {/* Info do produto */}
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{item.name}</Text>
                  <Text style={styles.productPrice}>
                    {formatDisplayPrice(item.price)}
                  </Text>
                  <Text style={styles.productBarcode}>
                    🔖 {item.barcode || "Sem código de barras"}
                  </Text>
                </View>

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
                    <Text style={styles.deleteButtonText}>✕</Text>
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

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0D0D0D',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1E1E1E',
  },
  headerGreeting: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 22,
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

  container: {
    padding: 16,
    paddingBottom: 70,
    backgroundColor: '#0D0D0D',
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

  scannerButton: {
    backgroundColor: '#7C3AED',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  scannerButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
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

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  badge: {
    backgroundColor: '#7C3AED',
    borderRadius: 12,
    paddingHorizontal: 9,
    paddingVertical: 3,
    minWidth: 26,
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: 'bold',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productInfo: {
    flex: 1,
    marginRight: 10,
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
  },
  productActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  editButton: {
    backgroundColor: '#242424',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
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
    backgroundColor: '#242424',
    borderRadius: 8,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  deleteButtonText: {
    color: '#EF4444',
    fontWeight: 'bold',
    fontSize: 15,
  },
});