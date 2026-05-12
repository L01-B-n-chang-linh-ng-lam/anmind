import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSettingsStore } from '@/store/settingsStore';
import { clearAll } from '@/services/storage.service';
import * as reminderService from '@/services/reminder.service';
import type { AppSettings } from '@/types';

function timeStringToDate(time: string): Date {
  const [h, m] = time.split(':').map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}

function dateToTimeString(date: Date): string {
  const h = date.getHours().toString().padStart(2, '0');
  const m = date.getMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
}

function ToggleRow({
  label,
  value,
  onValueChange,
  testID,
}: {
  label: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
  testID?: string;
}) {
  return (
    <View style={styles.row} testID={testID}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#252B45', true: '#8E97FD' }}
        thumbColor={value ? '#FFFFFF' : '#6B7280'}
      />
    </View>
  );
}

function SegmentRow<T extends string>({
  label,
  options,
  selected,
  onSelect,
}: {
  label: string;
  options: T[];
  selected: T;
  onSelect: (v: T) => void;
}) {
  return (
    <View style={styles.segmentSection}>
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={styles.segmentRow}>
        {options.map((opt) => (
          <Pressable
            key={opt}
            onPress={() => onSelect(opt)}
            style={[styles.segBtn, selected === opt && styles.segBtnActive]}>
            <Text style={[styles.segBtnText, selected === opt && styles.segBtnTextActive]}>
              {opt}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const { settings, loadSettings, updateSetting, resetToDefaults } = useSettingsStore();

  useEffect(() => {
    loadSettings();
  }, []);

  async function handleReminderTimeChange(
    _event: DateTimePickerEvent,
    date?: Date,
  ) {
    if (!date) return;
    const newTime = dateToTimeString(date);
    await updateSetting('reminderTime', newTime);
    if (settings.reminderEnabled) {
      await reminderService.cancelAllReminders();
      await reminderService.scheduleReminder(newTime);
    }
  }

  async function handleReminderToggle(value: boolean) {
    if (value) {
      const granted = await reminderService.requestPermissions();
      if (!granted) {
        Alert.alert(
          'Permission Required',
          'Please enable notifications in your device settings to use reminders.',
        );
        return;
      }
      await reminderService.scheduleReminder(settings.reminderTime);
    } else {
      await reminderService.cancelAllReminders();
    }
    await updateSetting('reminderEnabled', value);
  }

  async function handleClearData() {
    Alert.alert(
      'Clear All Data',
      'This will delete all your sessions and settings. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await clearAll();
            await resetToDefaults();
            Alert.alert('Done', 'All data has been cleared.');
          },
        },
      ],
    );
  }

  async function handleResetDefaults() {
    Alert.alert('Reset Settings', 'Reset all settings to default values?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', onPress: () => resetToDefaults() },
    ]);
  }

  function update<K extends keyof AppSettings>(key: K) {
    return (value: AppSettings[K]) => updateSetting(key, value);
  }

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}>
          {/* Header */}
          <View style={styles.headerRow}>
            <Pressable
              onPress={() => router.back()}
              style={styles.backBtn}
              accessibilityRole="button"
              accessibilityLabel="Back">
              <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
            </Pressable>
            <Text style={styles.heading}>Settings</Text>
            <View style={styles.backBtn} />
          </View>

          {/* Meditation */}
          <Text style={styles.sectionTitle}>Meditation</Text>
          <View style={styles.card}>
            <ToggleRow
              label="Reset Sound"
              value={settings.resetSoundEnabled}
              onValueChange={update('resetSoundEnabled')}
              testID="toggle-reset-sound"
            />
            <View style={styles.divider} />
            <ToggleRow
              label="Haptic Feedback"
              value={settings.hapticFeedbackEnabled}
              onValueChange={update('hapticFeedbackEnabled')}
              testID="toggle-haptic"
            />
          </View>

          <SegmentRow
            label="Default Duration"
            options={['3', '5', '7', '10'] as any}
            selected={String(settings.defaultResetDuration) as any}
            onSelect={(v) => update('defaultResetDuration')(Number(v) as 3 | 5 | 7 | 10)}
          />
          <SegmentRow
            label="Breathing Speed"
            options={['Slow', 'Normal', 'Fast']}
            selected={settings.breathingSpeed}
            onSelect={update('breathingSpeed')}
          />
          <SegmentRow
            label="Ambient Sound"
            options={['None', 'Rain', 'Ocean', 'Forest']}
            selected={settings.ambientSound as 'None' | 'Rain' | 'Ocean' | 'Forest'}
            onSelect={(v) => update('ambientSound')(v as AppSettings['ambientSound'])}
          />

          {/* Notifications */}
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.card}>
            <ToggleRow
              label="Daily Reminder"
              value={settings.reminderEnabled}
              onValueChange={handleReminderToggle}
              testID="toggle-reminder"
            />
            {settings.reminderEnabled && (
              <>
                <View style={styles.divider} />
                <View style={styles.row}>
                  <Text style={styles.rowLabel}>Reminder Time</Text>
                  <Text style={styles.rowValue}>{settings.reminderTime}</Text>
                </View>
                <DateTimePicker
                  value={timeStringToDate(settings.reminderTime)}
                  mode="time"
                  display="spinner"
                  onChange={handleReminderTimeChange}
                  textColor="#FFFFFF"
                  themeVariant="dark"
                  style={styles.timePicker}
                  {...(Platform.OS === 'android' && { is24Hour: true })}
                />
              </>
            )}
          </View>

          {/* Personalization */}
          <Text style={styles.sectionTitle}>Personalization</Text>
          <View style={styles.card}>
            <ToggleRow
              label="Suggest Usual Mood"
              value={settings.suggestUsualMood}
              onValueChange={update('suggestUsualMood')}
              testID="toggle-suggest-mood"
            />
            <View style={styles.divider} />
            <ToggleRow
              label="Dark Mode"
              value={settings.darkMode}
              onValueChange={update('darkMode')}
              testID="toggle-dark-mode"
            />
          </View>

          {/* Data */}
          <Text style={styles.sectionTitle}>Data</Text>
          <View style={styles.card}>
            <Pressable
              style={styles.row}
              onPress={() => Alert.alert('Export', 'Export feature coming soon.')}
              accessibilityRole="button">
              <Text style={styles.rowLabel}>Export My Data</Text>
              <Ionicons name="download-outline" size={18} color="#9CA3AF" />
            </Pressable>
            <View style={styles.divider} />
            <Pressable
              style={styles.row}
              onPress={handleClearData}
              accessibilityRole="button"
              testID="clear-data-btn">
              <Text style={[styles.rowLabel, styles.danger]}>Clear All Data</Text>
              <Ionicons name="trash-outline" size={18} color="#F87171" />
            </Pressable>
            <View style={styles.divider} />
            <Pressable
              style={styles.row}
              onPress={handleResetDefaults}
              accessibilityRole="button">
              <Text style={styles.rowLabel}>Reset to Defaults</Text>
              <Ionicons name="refresh-outline" size={18} color="#9CA3AF" />
            </Pressable>
          </View>

          {/* About */}
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>App Version</Text>
              <Text style={styles.rowValue}>1.0.0</Text>
            </View>
            <View style={styles.divider} />
            <Pressable
              style={styles.row}
              onPress={() => Alert.alert('Privacy Policy', 'Coming soon.')}
              accessibilityRole="button">
              <Text style={styles.rowLabel}>Privacy Policy</Text>
              <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0B0F1A' },
  safe:   { flex: 1 },
  scroll: { paddingHorizontal: 24, paddingBottom: 32 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 24,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#1A1F35',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: { color: '#FFFFFF', fontSize: 22, fontWeight: '700' },
  sectionTitle: {
    color: '#9CA3AF',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 10,
    marginTop: 24,
  },
  card: {
    backgroundColor: '#1A1F35',
    borderRadius: 16,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowLabel: { color: '#FFFFFF', fontSize: 15 },
  rowValue: { color: '#9CA3AF', fontSize: 14 },
  danger: { color: '#F87171' },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: '#252B45', marginHorizontal: 16 },
  segmentSection: { marginTop: 14 },
  segmentRow: {
    flexDirection: 'row',
    backgroundColor: '#1A1F35',
    borderRadius: 12,
    padding: 4,
    gap: 4,
    marginTop: 8,
  },
  segBtn: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: 8,
  },
  segBtnActive: { backgroundColor: '#8E97FD' },
  segBtnText:       { color: '#9CA3AF', fontSize: 13, fontWeight: '500' },
  segBtnTextActive: { color: '#1C0A3E', fontWeight: '700' },
  timePicker: { width: '100%', backgroundColor: '#1A1F35' },
});
