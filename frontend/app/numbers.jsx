import React from 'react';
import {
  StyleSheet, Text, View, Image, FlatList,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import ScreenContainer from '@/components/ScreenContainer';

const NUMBER_SIGNS = [
  { id: '1', number: '1', label: 'One', image: require('../assets/signs/num_1.jpeg') },
  { id: '2', number: '2', label: 'Two', image: require('../assets/signs/num_2.jpeg') },
  { id: '3', number: '3', label: 'Three', image: require('../assets/signs/num_3.jpeg') },
  { id: '4', number: '4', label: 'Four', image: require('../assets/signs/num_4.jpeg') },
  { id: '5', number: '5', label: 'Five', image: require('../assets/signs/num_5.jpeg') },
  { id: '6', number: '6', label: 'Six', image: require('../assets/signs/num_6.jpeg') },
  { id: '7', number: '7', label: 'Seven', image: require('../assets/signs/num_7.jpeg') },
  { id: '8', number: '8', label: 'Eight', image: require('../assets/signs/num_8.jpeg') },
  { id: '9', number: '9', label: 'Nine', image: require('../assets/signs/num_9.jpeg') },
  { id: '10', number: '10', label: 'Ten', image: require('../assets/signs/num_10.jpeg') },
];

export default function NumbersLearningScreen() {
  const speak = (text) => Speech.speak(text, { rate: 0.9 });

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => speak(item.label)}
      activeOpacity={0.8}
    >
      <View style={styles.numberBadge}>
        <Text style={styles.numberText}>{item.number}</Text>
      </View>
      <View style={styles.imageContainer}>
        <Image source={item.image} style={styles.signImage} resizeMode="contain" />
      </View>
      <Text style={styles.cardLabel}>{item.label}</Text>
      <View style={styles.tapHint}>
        <Ionicons name="volume-medium-outline" size={13} color="#8BA3C0" />
        <Text style={styles.tapHintText}>Tap to hear</Text>
      </View>
    </TouchableOpacity>
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
        <Text style={styles.title}>Numbers 1–10</Text>
      </View>

      <Text style={styles.subtitle}>
        Master the basic counting signs in ASL. Tap any card to hear the number.
      </Text>

      <FlatList
        data={NUMBER_SIGNS}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        scrollEnabled={false}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.columnWrapper}
      />

      <TouchableOpacity
        style={styles.practiceBtn}
        onPress={() => router.push('/practice')}
      >
        <Text style={styles.practiceBtnText}>Practice with Camera</Text>
        <Ionicons name="videocam" size={20} color="#FFFFFF" style={{ marginLeft: 8 }} />
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
  columnWrapper: { justifyContent: 'space-between', marginBottom: 14 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '48%',
    padding: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  numberBadge: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#CDE0F5',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 10,
  },
  numberText: { fontSize: 16, fontWeight: '700', color: '#4A628A' },
  imageContainer: {
    width: '100%',
    height: 130,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
  },
  signImage: { width: '100%', height: '100%' },
  cardLabel: { fontSize: 15, fontWeight: '600', color: '#1E293B', marginBottom: 4 },
  tapHint: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  tapHintText: { fontSize: 11, color: '#8BA3C0' },
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
