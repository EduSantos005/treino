import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../src/contexts/ThemeContext';

export default function SettingsScreen() {
  const router = useRouter();
  const { theme, setTheme, colors, isDark, restTime, setRestTime } = useTheme();
  const [showRestTimeModal, setShowRestTimeModal] = useState(false);
  const [tempRestTime, setTempRestTime] = useState(restTime.toString());

  const themeOptions: Array<{ value: 'light' | 'dark' | 'auto'; label: string }> = [
    { value: 'light', label: 'Claro' },
    { value: 'dark', label: 'Escuro' },
    { value: 'auto', label: 'Automático' },
  ];

  const handleSaveRestTime = () => {
    const time = parseInt(tempRestTime, 10);
    if (!isNaN(time) && time > 0 && time <= 600) {
      setRestTime(time);
      setShowRestTimeModal(false);
    }
  };

  const handleOpenRestTimeModal = () => {
    setTempRestTime(restTime.toString());
    setShowRestTimeModal(true);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.borderLight }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.backButton, { color: colors.primary }]}>Voltar</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Configurações</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Aparência</Text>

          {themeOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.themeOption,
                { borderColor: colors.border },
                theme === option.value && {
                  backgroundColor: colors.primary + '20',
                  borderColor: colors.primary,
                  borderWidth: 2,
                }
              ]}
              onPress={() => setTheme(option.value)}
            >
              <View style={styles.themeOptionContent}>
                <Text style={[
                  styles.themeOptionLabel,
                  { color: colors.text },
                  theme === option.value && { fontWeight: '600' }
                ]}>
                  {option.label}
                </Text>
                {theme === option.value && (
                  <Text style={[styles.checkmark, { color: colors.primary }]}>✓</Text>
                )}
              </View>
              {option.value === 'auto' && (
                <Text style={[styles.themeOptionDescription, { color: colors.textSecondary }]}>
                  Segue as configurações do sistema
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Treino</Text>

          <TouchableOpacity
            style={[styles.settingRow, { borderColor: colors.border }]}
            onPress={handleOpenRestTimeModal}
          >
            <View>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Tempo de Descanso</Text>
              <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                Tempo padrão entre séries
              </Text>
            </View>
            <Text style={[styles.settingValue, { color: colors.primary }]}>{restTime}s</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Sobre</Text>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Versão</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>1.0.0</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Tema Atual</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              {isDark ? 'Escuro' : 'Claro'}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Modal de Configuração de Tempo de Descanso */}
      <Modal
        visible={showRestTimeModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowRestTimeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Tempo de Descanso</Text>
            <Text style={[styles.modalDescription, { color: colors.textSecondary }]}>
              Defina o tempo padrão de descanso entre séries (em segundos)
            </Text>

            <TextInput
              style={[styles.input, {
                backgroundColor: colors.background,
                borderColor: colors.border,
                color: colors.text
              }]}
              value={tempRestTime}
              onChangeText={(value) => {
                const numericValue = value.replace(/[^0-9]/g, '');
                setTempRestTime(numericValue);
              }}
              keyboardType="numeric"
              maxLength={3}
              placeholder="60"
              placeholderTextColor={colors.placeholder}
            />

            <Text style={[styles.hint, { color: colors.textSecondary }]}>
              Sugestões: 30s (curto), 60s (médio), 90s (longo)
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton, { borderColor: colors.border }]}
                onPress={() => setShowRestTimeModal(false)}
              >
                <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton, { backgroundColor: colors.primary }]}
                onPress={handleSaveRestTime}
              >
                <Text style={styles.saveButtonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  backButton: {
    fontSize: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  themeOption: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  themeOptionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  themeOptionLabel: {
    fontSize: 16,
  },
  themeOptionDescription: {
    fontSize: 12,
    marginTop: 4,
  },
  checkmark: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 16,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
  },
  settingValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 14,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 8,
  },
  hint: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {},
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
