import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useResetStore } from '@/store/resetStore';
import { useSettingsStore } from '@/store/settingsStore';

export default function TabsLayout() {
  const loadSettings = useSettingsStore((s) => s.loadSettings);
  const loadSessions = useResetStore((s) => s.loadSessions);
  const loadAuth = useAuthStore((s) => s.loadAuth);

  useEffect(() => {
    loadSettings();
    loadSessions();
    loadAuth();
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0D1120',
          borderTopColor: '#1A1F35',
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: '#8E97FD',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="reset"
        options={{
          title: 'Reset',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="refresh-circle" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: 'Community',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
