/* eslint-disable react-hooks/exhaustive-deps */
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Button, Text, View } from 'react-native';


export default function HomeScreen() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/(auth)/login');
    }
  }, [user, loading]);

  if (loading || !user) return null;
  return (
    <>
      <View>
        <Text>Welcome, {user.email}</Text>
        <Button title="Logout" onPress={logout} />
      </View>
    </>
  );
}
