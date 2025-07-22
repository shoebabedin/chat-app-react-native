import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Text, View } from 'react-native';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return null; // or loading spinner
  }

  if (!user) {
    return null; // waiting for redirect
  }

  return (
    <View>
      <Text>Welcome {user.email}</Text>
    </View>
  );
}
