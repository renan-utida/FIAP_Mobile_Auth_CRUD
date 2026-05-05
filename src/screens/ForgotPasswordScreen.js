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
  StyleSheet,
} from 'react-native';
import { resetUserPassword } from '../firebase/authService';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');

  async function handleResetPassword() {
    if (!email.trim()) {
      Alert.alert('Atenção', 'Informe seu email.');
      return;
    }

    try {
      await resetUserPassword(email.trim());
      Alert.alert(
        'Email enviado',
        'Enviamos as instruções de recuperação de senha para seu email.'
      );
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro ao enviar email', error.message);
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
            <Text style={styles.title}>Recuperar senha</Text>
            <Text style={styles.subtitle}>
              Informe seu email e enviaremos as instruções de recuperação
            </Text>
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

            <TouchableOpacity style={styles.buttonPrimary} onPress={handleResetPassword}>
              <Text style={styles.buttonPrimaryText}>Enviar instruções</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.linkText}>Voltar ao login</Text>
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
    lineHeight: 22,
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