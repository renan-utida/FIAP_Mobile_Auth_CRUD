import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { registerUser } from '../firebase/authService';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleRegister() {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Atenção', 'Preencha nome, email e senha.');
      return;
    }

    try {
      await registerUser(email.trim(), password);
      Alert.alert('Sucesso', 'Usuário cadastrado com sucesso.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro ao cadastrar', error.message);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Criar conta</Text>
            <Text style={styles.subtitle}>Preencha os dados para se registrar</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Nome</Text>
            <TextInput
              placeholder="Seu nome completo"
              placeholderTextColor="#666"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              placeholder="seu@email.com"
              placeholderTextColor="#666"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
            />

            <Text style={styles.label}>Senha</Text>
            <TextInput
              placeholder="Mínimo 6 caracteres"
              placeholderTextColor="#666"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
            />

            <TouchableOpacity style={styles.buttonPrimary} onPress={handleRegister}>
              <Text style={styles.buttonPrimaryText}>Cadastrar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.linkText}>Já tenho uma conta</Text>
            </TouchableOpacity>
          </View>
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
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    paddingBottom: 40,
    backgroundColor: '#0D0D0D',
  },
  headerContainer: {
    marginBottom: 32,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
  },
  card: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  label: {
    fontSize: 13,
    color: '#AAA',
    marginBottom: 6,
    marginTop: 4,
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
    marginBottom: 12,
  },
  buttonPrimaryText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkButton: {
    alignItems: 'center',
    padding: 8,
  },
  linkText: {
    color: '#888',
    fontSize: 14,
  },
});