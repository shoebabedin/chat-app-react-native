import { db } from '@/lib/firebase';
import { useRouter } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

type Lawyer = {
  id: string;
  name: string;
  specialization: string;
  image: string;
};

export default function LawyerListScreen() {
   const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [filteredData, setFilteredData] = useState<Lawyer[]>([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
    const fetchLawyers = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'lawyers'));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Lawyer[];

        setLawyers(data);
        setFilteredData(data);
      } catch (error) {
        console.error('Error fetching lawyers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLawyers();
  }, []);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    const filtered = lawyers.filter((lawyer) =>
      lawyer.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(filtered);
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="blue" />
        <Text>Loading Lawyers...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search Lawyer by Name"
        style={styles.input}
        value={searchQuery}
        onChangeText={handleSearch}
      />
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: '/details',
                params: {
                  name: item.name,
                  specialization: item.specialization,
                  image: item.image,
                },
              })
            }>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.specialization}>{item.specialization}</Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 12,
    borderRadius: 8,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    padding: 12,
    marginBottom: 12,
    borderRadius: 10,
    alignItems: 'center',
    gap: 12,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
  },
  specialization: {
    fontSize: 14,
    color: '#555',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
