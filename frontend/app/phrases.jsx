import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import ScreenContainer from '@/components/ScreenContainer';
import { apiRequest } from '@/lib/api';

export default function PhrasesLearningScreen() {
  const [phrases, setPhrases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch phrases from backend
    apiRequest('/api/lessons')
      .then((data) => {
        if (Array.isArray(data)) {
          // Filter for phrases (where character length > 1 usually or by moduleId)
          // For simplicity, we'll just take those that are not single alphabet letters
          const filtered = data.filter(l => l.character.length > 1);
          setPhrases(filtered);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const speak = (text) => {
    Speech.speak(text, { rate: 0.9 });
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.gifContainer}>
        <Image 
          source={{ uri: item.mediaUrl }} 
          style={styles.gif} 
          resizeMode="contain"
        />
      </View>
      <View style={styles.cardContent}>
        <View style={styles.textRow}>
          <Text style={styles.phraseTitle}>{item.character}</Text>
          <TouchableOpacity onPress={() => speak(item.character)} style={styles.speakerBtn}>
            <Ionicons name="volume-medium" size={20} color="#4A628A" />
          </TouchableOpacity>
        </View>
        <Text style={styles.phraseDesc}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <ScreenContainer scrollable containerStyle={styles.safeArea} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#374B6D" />
        </TouchableOpacity>
        <Text style={styles.title}>Common Phrases</Text>
      </View>
      
      <Text style={styles.subtitle}>
        Learn essential everyday expressions in ASL. Tap the volume icon to hear the pronunciation.
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#4A628A" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={phrases}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          scrollEnabled={false}
          contentContainerStyle={styles.list}
        />
      )}

      <TouchableOpacity 
        style={styles.practiceBtn}
        onPress={() => router.push('/practice')}
      >
        <Text style={styles.practiceBtnText}>Practice with AI</Text>
        <Ionicons name="sparkles" size={20} color="#FFFFFF" style={{ marginLeft: 8 }} />
      </TouchableOpacity>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: '#F8F9FA' },
  container: { paddingHorizontal: 16, paddingTop: 10 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  backBtn: { marginRight: 15 },
  title: { fontSize: 28, fontWeight: '800', color: '#374B6D' },
  subtitle: { fontSize: 15, color: '#64748B', lineHeight: 22, marginBottom: 25 },
  list: { paddingBottom: 30 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  gifContainer: {
    width: '100%',
    height: 180,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gif: { width: '100%', height: '100%' },
  cardContent: { padding: 20 },
  textRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  phraseTitle: { fontSize: 20, fontWeight: '700', color: '#1E293B' },
  speakerBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F0F4F8', justifyContent: 'center', alignItems: 'center' },
  phraseDesc: { fontSize: 14, color: '#64748B', lineHeight: 20 },
  practiceBtn: {
    backgroundColor: '#4A628A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16,
    marginBottom: 40,
  },
  practiceBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
