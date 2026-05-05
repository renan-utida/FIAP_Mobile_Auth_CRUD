import { useState, useCallback } from 'react';
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
  StyleSheet,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { loginUser } from '../firebase/authService';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useFocusEffect(
    useCallback(() => {
      setPassword('');
    }, [])
  );

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Atenção', 'Preencha email e senha.');
      return;
    }

    try {
      await loginUser(email.trim(), password);
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Erro ao entrar', error.message);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>

          <View style={styles.headerContainer}>
            <Text style={styles.title}>Bem-vindo</Text>
            <Text style={styles.subtitle}>Faça login para continuar</Text>
          </View>

          <View style={styles.card}>
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
              placeholder="••••••••"
              placeholderTextColor="#666"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
            />

            <TouchableOpacity style={styles.buttonPrimary} onPress={handleLogin}>
              <Text style={styles.buttonPrimaryText}>Entrar</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.buttonSecondary}
              onPress={() => navigation.navigate('Cadastro')}
            >
              <Text style={styles.buttonSecondaryText}>Criar conta</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => navigation.navigate('EsqueciSenha')}
            >
              <Text style={styles.linkText}>Esqueci minha senha</Text>
            </TouchableOpacity>
          </View>

        </View>
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
    flex: 1,
    justifyContent: 'center',
    padding: 24,
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
  },
  buttonPrimaryText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#2A2A2A',
    marginVertical: 20,
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#7C3AED',
    marginBottom: 12,
  },
  buttonSecondaryText: {
    color: '#7C3AED',
    fontSize: 16,
    fontWeight: '600',
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