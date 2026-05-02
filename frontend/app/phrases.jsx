import React from 'react';
import {
  StyleSheet, Text, View, Image, FlatList,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import ScreenContainer from '@/components/ScreenContainer';

// 100% local images — no API, no network needed
const PHRASES = [
  {
    id: 'p1',
    character: 'Hello',
    description: 'Wave your open hand near your forehead outward.',
    image: require('../assets/signs/phrase_hello.jpeg'),
  },
  {
    id: 'p2',
    character: 'Thank You',
    description: 'Touch your chin with fingertips then move hand forward and down.',
    image: require('../assets/signs/phrase_thankyou.jpeg'),
  },
  {
    id: 'p3',
    character: 'Please',
    description: 'Rub your flat hand in a circular motion on your chest.',
    image: require('../assets/signs/phrase_please.jpeg'),
  },
  {
    id: 'p4',
    character: 'Sorry',
    description: 'Make a fist and rub it in a circle over your chest.',
    image: require('../assets/signs/phrase_sorry.jpeg'),
  },
  {
    id: 'p5',
    character: 'Yes',
    description: 'Make an "S" fist and nod it up and down like a head nodding.',
    image: require('../assets/signs/phrase_yes.jpeg'),
  },
  {
    id: 'p6',
    character: 'No',
    description: 'Extend index and middle finger, then snap them to your thumb.',
    image: require('../assets/signs/phrase_no.jpeg'),
  },
  {
    id: 'p7',
    character: 'Goodbye',
    description: 'Open your hand and bend your fingers up and down like waving.',
    image: require('../assets/signs/phrase_goodbye.jpeg'),
  },
  {
    id: 'p8',
    character: 'I Love You',
    description: 'Extend your thumb, index finger, and pinky simultaneously.',
    image: require('../assets/signs/phrase_loveyou.jpeg'),
  },
  {
    id: 'p9',
    character: 'You Are Welcome',
    description: 'Bring your flat hand from your chin forward and downward.',
    image: require('../assets/signs/phrase_welcome.jpeg'),
  },
  {
    id: 'p10',
    character: 'Family',
    description: 'Form two "F" hands in a circle to indicate family group.',
    image: require('../assets/signs/phrase_family.jpeg'),
  },
];

export default function PhrasesLearningScreen() {
  const speak = (text) => Speech.speak(text, { rate: 0.9 });

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={item.image} style={styles.signImage} resizeMode="contain" />
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
    <ScreenContainer
      scrollable
      containerStyle={styles.safeArea}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#374B6D" />
        </TouchableOpacity>
        <Text style={styles.title}>Common Phrases</Text>
      </View>

      <Text style={styles.subtitle}>
        Learn essential everyday expressions in ASL. Tap the volume icon to hear pronunciation.
      </Text>

      <FlatList
        data={PHRASES}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        contentContainerStyle={styles.list}
      />

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
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  backBtn: { marginRight: 14, padding: 4 },
  title: { fontSize: 26, fontWeight: '800', color: '#374B6D' },
  subtitle: { fontSize: 14, color: '#64748B', lineHeight: 20, marginBottom: 22 },
  list: { paddingBottom: 20 },
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
  imageContainer: {
    width: '100%',
    height: 220,
    backgroundColor: '#F8FAFC',
  },
  signImage: { width: '100%', height: '100%' },
  cardContent: { padding: 20 },
  textRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  phraseTitle: { fontSize: 20, fontWeight: '700', color: '#1E293B' },
  speakerBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#F0F4F8',
    justifyContent: 'center', alignItems: 'center',
  },
  phraseDesc: { fontSize: 14, color: '#64748B', lineHeight: 20 },
  practiceBtn: {
    backgroundColor: '#4A628A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16,
    marginTop: 8,
    marginBottom: 40,
  },
  practiceBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
