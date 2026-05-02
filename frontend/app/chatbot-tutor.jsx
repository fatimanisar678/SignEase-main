import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Switch, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import ScreenContainer from '@/components/ScreenContainer';
import CustomButton from '@/components/CustomButton';

const ALPHABET = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

export default function ChatbotTutorScreen() {
  const [activeLetter, setActiveLetter] = useState('A');
  const [isSlowMode, setIsSlowMode] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');

  const languages = [
    { label: 'English', code: 'en-US' },
    { label: 'Urdu (اردو)', code: 'ur-PK' },
    { label: 'Sindhi (سنڌي)', code: 'sd-PK' },
    { label: 'Punjabi (پنجابي)', code: 'pa-PK' },
  ];

  const speakExplanation = (letter, langCode) => {
    const explanations = {
      'en-US': `This is the sign for ${letter}`,
      'ur-PK': `یہ ${letter} کے لیے اشارہ ہے`,
      'sd-PK': `هي ${letter} لاءِ اشارو آهي`,
      'pa-PK': `ਇਹ ${letter} ਦਾ ਇਸ਼ਾਰਾ ਹੈ`,
    };
    const text = explanations[langCode] || explanations['en-US'];
    Speech.speak(text, { language: langCode, rate: 0.8 });
  };

  const speak = (text) => {
    Speech.speak(text, { rate: 0.9 });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      
      {/* Custom Header Navigation */}
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <Ionicons name="arrow-back" size={24} color="#3B82F6" />
        </TouchableOpacity>
        <Text style={styles.topHeaderText}>3D Tutor</Text>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="settings" size={22} color="#3B82F6" />
        </TouchableOpacity>
      </View>

      <ScreenContainer 
        style={styles.container} 
        containerStyle={{ backgroundColor: '#F8F9FA' }} 
        scrollable 
        contentContainerStyle={styles.scroll}
      >
        
        {/* Info Header */}
        <View style={styles.infoHeader}>
          <View style={styles.watchBadge}>
            <Text style={styles.watchBadgeText}>Watch the Sign</Text>
          </View>
          <Text style={styles.progressText}>5/26 letters learned</Text>
        </View>

        {/* 3D Avatar View Area */}
        <View style={styles.avatarContainer}>
          {/* Using real ASL GIFs as placeholders until your 3D models are ready! */}
          <Image 
            source={{ uri: `https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/${activeLetter.toLowerCase()}.gif` }} 
            style={styles.avatarImage} 
            resizeMode="contain"
          />
        </View>

        {/* Language Selection */}
        <View style={styles.languageContainer}>
          {languages.map((lang) => (
            <TouchableOpacity 
              key={lang.code}
              style={[styles.langChip, selectedLanguage === lang.code && styles.langChipActive]}
              onPress={() => setSelectedLanguage(lang.code)}
            >
              <Text style={[styles.langChipText, selectedLanguage === lang.code && styles.langChipTextActive]}>
                {lang.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Letter Info Card */}
        <View style={styles.letterCard}>
          <View>
            <Text style={styles.largeLetter}>{activeLetter}</Text>
            <Text style={styles.letterSubtitle}>
              {selectedLanguage === 'ur-PK' ? `یہ ${activeLetter} ہے` : 
               selectedLanguage === 'sd-PK' ? `هي ${activeLetter} آهي` : 
               selectedLanguage === 'pa-PK' ? `ਇਹ ${activeLetter} ਹੈ` : 
               `This is the sign for ${activeLetter}`}
            </Text>
          </View>
          <TouchableOpacity style={styles.speakerButton} onPress={() => speakExplanation(activeLetter, selectedLanguage)}>
            <Ionicons name="volume-medium" size={20} color="#374B6D" />
          </TouchableOpacity>
        </View>

        {/* Alphabet Selection Scroll */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.alphabetScroll}
          contentContainerStyle={styles.alphabetScrollContent}
        >
          {ALPHABET.map((letter) => {
            const isActive = letter === activeLetter;
            return (
              <TouchableOpacity 
                key={letter} 
                style={[styles.letterBox, isActive && styles.letterBoxActive]}
                onPress={() => setActiveLetter(letter)}
                activeOpacity={0.7}
              >
                <Text style={[styles.letterBoxText, isActive && styles.letterBoxTextActive]}>
                  {letter}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Controls Row */}
        <View style={styles.controlsRow}>
          <TouchableOpacity style={styles.controlButton}>
            <Ionicons name="play" size={18} color="#374B6D" style={{ marginRight: 6 }} />
            <Text style={styles.controlButtonText}>Play</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton}>
            <Ionicons name="sync" size={18} color="#374B6D" style={{ marginRight: 6 }} />
            <Text style={styles.controlButtonText}>Repeat</Text>
          </TouchableOpacity>

          <View style={styles.controlSwitchBox}>
            <Text style={styles.controlSwitchText}>Slow</Text>
            <Switch 
              value={isSlowMode} 
              onValueChange={setIsSlowMode}
              trackColor={{ false: '#E2E8F0', true: '#A7C7E7' }}
              thumbColor={isSlowMode ? '#FFFFFF' : '#FFFFFF'}
              ios_backgroundColor="#E2E8F0"
              style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
            />
          </View>
        </View>

        {/* Try It Yourself Button */}
        <CustomButton
          label="Try It Yourself"
          onPress={() => router.push({ pathname: '/practice', params: { targetLetter: activeLetter } })}
          left={<Ionicons name="aperture-outline" size={20} color="#FFFFFF" />}
          style={styles.primaryBtn}
        />

      </ScreenContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  iconButton: {
    padding: 4,
  },
  topHeaderText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3B82F6',
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  scroll: {
    paddingBottom: 40,
  },
  languageContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 15, justifyContent: 'center' },
  langChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: '#E2E8F0', borderWidth: 1, borderColor: 'transparent' },
  langChipActive: { backgroundColor: '#4A628A', borderColor: '#3B82F6' },
  langChipText: { fontSize: 11, color: '#475569', fontWeight: '600' },
  langChipTextActive: { color: '#FFFFFF' },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  watchBadge: {
    backgroundColor: '#DDE8F4', // Light blue background
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  watchBadgeText: {
    color: '#2A4B6B',
    fontWeight: '700',
    fontSize: 12,
  },
  progressText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
  },
  avatarContainer: {
    width: '100%',
    aspectRatio: 1, // Make it square-ish
    backgroundColor: '#BDE3E0', // Mint/teal pastel color
    borderRadius: 40,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarImage: {
    width: '80%',
    height: '100%',
    // Image will fall back to transparent if url breaks, leaving just the mint background
  },
  letterCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
  },
  largeLetter: {
    fontSize: 42,
    fontWeight: '800',
    color: '#374B6D',
    marginBottom: 4,
  },
  letterSubtitle: {
    fontSize: 15,
    color: '#475569',
  },
  speakerButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  alphabetScroll: {
    marginBottom: 24,
  },
  alphabetScrollContent: {
    gap: 12,
    paddingRight: 20,
  },
  letterBox: {
    width: 56,
    height: 56,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
  letterBoxActive: {
    backgroundColor: '#9DBEE0', // Soft blue matching active state
  },
  letterBoxText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#475569',
  },
  letterBoxTextActive: {
    color: '#2A4B6B',
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    gap: 12,
  },
  controlButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
  controlButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374B6D',
  },
  controlSwitchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
  controlSwitchText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374B6D',
    marginRight: 4,
  },
  primaryBtn: {
    backgroundColor: '#6A89A7',
    height: 56,
    borderRadius: 16,
  },
});

