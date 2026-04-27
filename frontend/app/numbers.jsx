import React from 'react';
import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import ScreenContainer from '@/components/ScreenContainer';

const NUMBER_SIGNS = [
  { id: '1', number: '1', gif: 'https://www.lifeprint.com/asl101/gifs-animated/number01.gif' },
  { id: '2', number: '2', gif: 'https://www.lifeprint.com/asl101/gifs-animated/number02.gif' },
  { id: '3', number: '3', gif: 'https://www.lifeprint.com/asl101/gifs-animated/number03.gif' },
  { id: '4', number: '4', gif: 'https://www.lifeprint.com/asl101/gifs-animated/number04.gif' },
  { id: '5', number: '5', gif: 'https://www.lifeprint.com/asl101/gifs-animated/number05.gif' },
  { id: '6', number: '6', gif: 'https://www.lifeprint.com/asl101/gifs-animated/number06.gif' },
  { id: '7', number: '7', gif: 'https://www.lifeprint.com/asl101/gifs-animated/number07.gif' },
  { id: '8', number: '8', gif: 'https://www.lifeprint.com/asl101/gifs-animated/number08.gif' },
  { id: '9', number: '9', gif: 'https://www.lifeprint.com/asl101/gifs-animated/number09.gif' },
  { id: '10', number: '10', gif: 'https://www.lifeprint.com/asl101/gifs-animated/number10.gif' },
];

export default function NumbersLearningScreen() {
  const speak = (text) => {
    Speech.speak(text, { rate: 0.9 });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => speak(item.number)}>
      <View style={styles.numberBadge}>
        <Text style={styles.numberText}>{item.number}</Text>
      </View>
      <View style={styles.gifContainer}>
        <Image 
          source={{ uri: item.gif }} 
          style={styles.gif} 
          resizeMode="contain"
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenContainer scrollable containerStyle={styles.safeArea} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#374B6D" />
        </TouchableOpacity>
        <Text style={styles.title}>Numbers 1–10</Text>
      </View>
      
      <Text style={styles.subtitle}>
        Master the basic counting signs in ASL. Tap on any sign to practice.
      </Text>

      <FlatList
        data={NUMBER_SIGNS}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        scrollEnabled={false} // Since ScreenContainer is scrollable
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
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  backBtn: { marginRight: 15 },
  title: { fontSize: 28, fontWeight: '800', color: '#374B6D' },
  subtitle: { fontSize: 15, color: '#64748B', lineHeight: 22, marginBottom: 25 },
  list: { paddingBottom: 30 },
  columnWrapper: { justifyContent: 'space-between', marginBottom: 16 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '48%',
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  numberBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#CDE0F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  numberText: { fontSize: 16, fontWeight: '700', color: '#4A628A' },
  gifContainer: {
    width: '100%',
    height: 120,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    overflow: 'hidden',
  },
  gif: { width: '100%', height: '100%' },
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
