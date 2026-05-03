import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, Image, ActivityIndicator, Alert,
} from 'react-native';
import ScreenContainer from '@/components/ScreenContainer';
import PrimaryButton from '@/components/PrimaryButton';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { apiRequest } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

// 10 solid ASL quiz questions with working GIF URLs
const MOCK_QUESTIONS = [
  // ALPHABET (First)
  { id: 'q3', prompt: 'Which letter is being signed here?', mediaUrl: 'https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/a.gif', options: ['A', 'B', 'S', 'O'], correctIndex: 0 },
  { id: 'q4', prompt: 'Identify this letter:', mediaUrl: 'https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/b.gif', options: ['D', 'F', 'B', 'K'], correctIndex: 2 },
  { id: 'q5', prompt: 'What alphabet is this?', mediaUrl: 'https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/c.gif', options: ['G', 'C', 'O', 'Q'], correctIndex: 1 },

  // NUMBERS
  { id: 'q6', prompt: 'What number is being signed?', mediaUrl: 'https://www.lifeprint.com/asl101/gifs-animated/number01.gif', options: ['1', '2', '3', '4'], correctIndex: 0 },
  { id: 'q7', prompt: 'Identify this number:', mediaUrl: 'https://www.lifeprint.com/asl101/gifs-animated/number02.gif', options: ['5', '2', '8', '0'], correctIndex: 1 },
  { id: 'q8', prompt: 'What number does this represent?', mediaUrl: 'https://www.lifeprint.com/asl101/gifs-animated/number03.gif', options: ['6', '9', '3', '1'], correctIndex: 2 },
  { id: 'q9', prompt: 'Which number is this?', mediaUrl: 'https://www.lifeprint.com/asl101/gifs-animated/number05.gif', options: ['10', '5', '4', '7'], correctIndex: 1 },

  // WORDS (Last)
  { id: 'q1', prompt: 'What word does this sign mean?', mediaUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3ZhcHoxdmh5YXB4eHlxeHlxeHlxeHlxeHlxeHlxeHlxeHlxeHlxeCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKVUn7iM8FMEU24/giphy.gif', options: ['Goodbye', 'Please', 'Hello', 'Sorry'], correctIndex: 2 },
  { id: 'q2', prompt: 'Identify this common sign.', mediaUrl: 'https://www.lifeprint.com/asl101/gifs/t/thank-you.gif', options: ['Thank You', 'Welcome', 'Excuse Me', 'No'], correctIndex: 0 },
  { id: 'q10', prompt: 'Identify the word being signed:', mediaUrl: 'https://www.lifeprint.com/asl101/gifs/y/yes.gif', options: ['No', 'Yes', 'Maybe', 'Always'], correctIndex: 1 },
];

const optionPrefixes = ['A', 'B', 'C', 'D'];

export default function QuizScreen() {
  const router = useRouter();
  const { user, updateUserStats } = useAuth();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Try to get questions from backend, fallback to mock
    apiRequest('/api/quiz/generate')
      .then((data) => {
        let mapped = [];
        if (Array.isArray(data) && data.length > 0) {
          mapped = data.map((q, i) => ({
            id: q._id || `q${i}`,
            prompt: q.prompt || q.question || 'What does this sign mean?',
            mediaUrl: q.mediaUrl || q.gifUrl || MOCK_QUESTIONS[i % MOCK_QUESTIONS.length].mediaUrl,
            options: q.options || MOCK_QUESTIONS[i % MOCK_QUESTIONS.length].options,
            correctIndex: q.correctIndex ?? q.answerIndex ?? 0,
          }));
        } else {
          mapped = [...MOCK_QUESTIONS];
        }

        // Sort questions to put alphabets first, then numbers, then words
        mapped.sort((a, b) => {
          const isA_Alphabet = a.options.some(opt => /^[A-Za-z]$/.test(opt));
          const isB_Alphabet = b.options.some(opt => /^[A-Za-z]$/.test(opt));
          const isA_Number = a.options.some(opt => /^[0-9]+$/.test(opt));
          const isB_Number = b.options.some(opt => /^[0-9]+$/.test(opt));

          if (isA_Alphabet && !isB_Alphabet) return -1;
          if (!isA_Alphabet && isB_Alphabet) return 1;
          if (isA_Number && !isB_Number) return -1;
          if (!isA_Number && isB_Number) return 1;
          return 0;
        });

        setQuestions(mapped);
      })
      .catch(() => {
        setQuestions([...MOCK_QUESTIONS]);
      })
      .finally(() => setLoading(false));
  }, []);

  const currentQuestion = questions[currentIndex];

  const handleSubmit = () => {
    if (selectedIndex == null) return;
    if (selectedIndex === currentQuestion.correctIndex) {
      setScore((prev) => prev + 1);
    }
    setHasSubmitted(true);
  };

  const handleNext = async () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedIndex(null);
      setHasSubmitted(false);
    } else {
      setIsFinished(true);
      await submitScore(score + (selectedIndex === currentQuestion.correctIndex ? 0 : 0));
    }
  };

  const submitScore = async (finalScore) => {
    setSubmitting(true);
    const total = questions.length;
    const percentage = Math.round((finalScore / total) * 100);
    const scoreStr = `${percentage}%`;

    // Submit to backend quiz endpoint
    if (user?.id) {
      try {
        await apiRequest('/api/quiz/submit', {
          method: 'POST',
          body: JSON.stringify({ userId: user.id, score: finalScore, total }),
        });
      } catch (e) {
        console.warn('Quiz submit to backend failed:', e.message);
      }
    }

    // Update user profile stats
    try {
      await updateUserStats({
        quizScore: scoreStr,
        lessonsCompleted: (user?.lessonsCompleted || 0) + 1,
        streakDays: (user?.streakDays || 0) + 1,
      });
    } catch (e) {
      console.warn('Failed to update user stats:', e.message);
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <ScreenContainer style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A628A" />
        <Text style={styles.loadingText}>Generating your quiz…</Text>
      </ScreenContainer>
    );
  }

  // ── RESULTS SCREEN ──
  if (isFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    const passed = percentage >= 60;

    return (
      <ScreenContainer containerStyle={styles.safeAreaOverride} style={styles.resultsContainer}>
        {submitting ? (
          <ActivityIndicator size="large" color="#4A628A" style={{ marginBottom: 20 }} />
        ) : (
          <View style={styles.resultsIconWrapper}>
            <Ionicons name={passed ? 'trophy' : 'refresh-circle'} size={80} color={passed ? '#F59E0B' : '#6B7280'} />
          </View>
        )}
        <Text style={styles.resultsTitle}>{passed ? 'Excellent Work!' : 'Keep Practicing!'}</Text>
        <Text style={styles.resultsSubtitle}>
          You scored {score} out of {questions.length} correct.
        </Text>
        <View style={styles.scoreCircle}>
          <Text style={styles.scoreText}>{percentage}%</Text>
        </View>
        {passed && (
          <View style={styles.passBadge}>
            <Ionicons name="checkmark-circle" size={18} color="#22C55E" />
            <Text style={styles.passBadgeText}>Score saved to your profile!</Text>
          </View>
        )}
        <View style={styles.bottomActions}>
          <PrimaryButton
            label="Return to Learning Path"
            onPress={() => router.replace('/learning')}
            style={styles.checkButton}
          />
          <TouchableOpacity style={styles.retryBtn} onPress={() => {
            setCurrentIndex(0);
            setScore(0);
            setSelectedIndex(null);
            setHasSubmitted(false);
            setIsFinished(false);
          }}>
            <Text style={styles.retryBtnText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

  // ── QUIZ QUESTION SCREEN ──
  const progressPercent = ((currentIndex + 1) / questions.length) * 100;

  return (
    <ScreenContainer scrollable containerStyle={styles.safeAreaOverride} style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={28} color="#5A7C9D" />
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
          </View>
        </View>
        <Text style={styles.progressText}>{currentIndex + 1}/{questions.length}</Text>
        <View style={styles.avatarWrap}>
          <Ionicons name="person-circle" size={36} color="#F8B88B" />
        </View>
      </View>

      {/* Badge */}
      <View style={styles.badgeContainer}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>ASL Vocabulary Quiz</Text>
        </View>
      </View>

      {/* Prompt */}
      <Text style={styles.prompt}>{currentQuestion.prompt}</Text>

      {/* Media */}
      <View style={styles.mediaContainer}>
        <View style={styles.mediaBackground}>
          <Image 
            source={{ uri: `${currentQuestion.mediaUrl}?t=${currentIndex}` }} 
            style={styles.mediaImage} 
            resizeMode="contain" 
            key={`${currentQuestion.id}_${currentIndex}`}
          />
          {!hasSubmitted && <ActivityIndicator size="small" color="#4A628A" style={{ position: 'absolute', zIndex: -1 }} />}
        </View>
      </View>

      {/* Options */}
      <View style={styles.optionsContainer}>
        {currentQuestion.options.map((option, index) => {
          let state = 'unselected';
          if (hasSubmitted) {
            if (index === currentQuestion.correctIndex) state = 'correct';
            else if (index === selectedIndex) state = 'incorrect';
          } else if (index === selectedIndex) {
            state = 'selected';
          }

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.option,
                state === 'selected' && styles.optionSelected,
                state === 'correct' && styles.optionCorrect,
                state === 'incorrect' && styles.optionIncorrect,
                hasSubmitted && state === 'unselected' && { opacity: 0.5 },
              ]}
              onPress={() => { if (!hasSubmitted) setSelectedIndex(index); }}
              activeOpacity={0.7}
            >
              <View style={[
                styles.optionLetterContainer,
                state === 'selected' && styles.letterContainerSelected,
                state === 'correct' && styles.letterContainerCorrect,
                state === 'incorrect' && styles.letterContainerIncorrect,
              ]}>
                <Text style={[
                  styles.optionLetter,
                  (state === 'selected' || state === 'correct' || state === 'incorrect') && styles.letterActive,
                ]}>
                  {optionPrefixes[index]}
                </Text>
              </View>
              <Text style={[styles.optionText, (state !== 'unselected') && styles.textActive]}>
                {option}
              </Text>
              {state === 'selected' && <Ionicons name="radio-button-on" size={24} color="#4A628A" />}
              {state === 'correct' && <Ionicons name="checkmark-circle" size={24} color="#22C55E" />}
              {state === 'incorrect' && <Ionicons name="close-circle" size={24} color="#EF4444" />}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <PrimaryButton
          label={hasSubmitted ? 'Next Question' : 'Check Answer'}
          onPress={hasSubmitted ? handleNext : handleSubmit}
          style={[styles.checkButton, hasSubmitted && { backgroundColor: '#4A628A' }]}
          disabled={selectedIndex === null}
        />
        {!hasSubmitted && (
          <TouchableOpacity style={styles.hintContainer}>
            <Ionicons name="bulb" size={18} color="#5A7C9D" />
            <Text style={styles.hintText}>Get a Hint</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScreenContainer>
  );
}


const styles = StyleSheet.create({
  safeAreaOverride: { backgroundColor: '#FAFAFA' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FAFAFA' },
  loadingText: { marginTop: 16, fontSize: 16, color: '#6B7280', fontWeight: '500' },
  container: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20 },
  resultsContainer: { paddingHorizontal: 20, paddingTop: 40, paddingBottom: 20, alignItems: 'center', justifyContent: 'center' },
  resultsIconWrapper: { width: 140, height: 140, borderRadius: 70, backgroundColor: '#FEF3C7', justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  resultsTitle: { fontSize: 28, fontWeight: '800', color: '#1F2937', marginBottom: 8 },
  resultsSubtitle: { fontSize: 16, color: '#6B7280', marginBottom: 32 },
  scoreCircle: { width: 120, height: 120, borderRadius: 60, borderWidth: 8, borderColor: '#4A628A', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  scoreText: { fontSize: 32, fontWeight: '800', color: '#4A628A' },
  passBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 24, backgroundColor: '#F0FDF4', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  passBadgeText: { color: '#15803D', fontWeight: '600', fontSize: 13 },
  retryBtn: { marginTop: 12, paddingVertical: 12 },
  retryBtnText: { color: '#4A628A', fontWeight: '600', fontSize: 15 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  progressContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginHorizontal: 15 },
  progressBarBackground: { flex: 1, height: 10, backgroundColor: '#D6E4F0', borderRadius: 5, marginRight: 15, maxWidth: 160 },
  progressBarFill: { height: '100%', backgroundColor: '#A7C7E7', borderRadius: 5 },
  progressText: { fontSize: 16, fontWeight: '600', color: '#5A7C9D', marginRight: 15 },
  avatarWrap: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center' },
  badgeContainer: { alignItems: 'center', marginBottom: 15 },
  badge: { backgroundColor: '#DDE8F4', paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20 },
  badgeText: { color: '#5A7C9D', fontWeight: '500', fontSize: 14 },
  prompt: { fontSize: 18, fontWeight: '500', color: '#1F2937', textAlign: 'center', marginBottom: 20 },
  mediaContainer: { alignItems: 'center', marginBottom: 25, shadowColor: '#CDB4DB', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.5, shadowRadius: 12, elevation: 8 },
  mediaBackground: { width: '100%', height: 200, backgroundColor: '#FFFFFF', borderRadius: 20, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', borderWidth: 1, borderColor: '#E5E7EB' },
  mediaImage: { width: '100%', height: '100%' },
  optionsContainer: { gap: 12, marginBottom: 30 },
  option: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', paddingVertical: 14, paddingHorizontal: 16, borderRadius: 16, borderWidth: 2, borderColor: '#FFFFFF', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1 },
  optionSelected: { borderColor: '#4A628A' },
  optionCorrect: { borderColor: '#22C55E', backgroundColor: '#F0FDF4' },
  optionIncorrect: { borderColor: '#EF4444', backgroundColor: '#FEF2F2' },
  optionLetterContainer: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#CDE0F5', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  letterContainerSelected: { backgroundColor: '#4A628A' },
  letterContainerCorrect: { backgroundColor: '#22C55E' },
  letterContainerIncorrect: { backgroundColor: '#EF4444' },
  optionLetter: { fontSize: 14, fontWeight: '700', color: '#4A628A' },
  letterActive: { color: '#FFFFFF' },
  optionText: { flex: 1, fontSize: 15, color: '#4B5563', fontWeight: '400' },
  textActive: { color: '#1F2937', fontWeight: '600' },
  bottomActions: { alignItems: 'center', marginTop: 'auto', width: '100%' },
  checkButton: { backgroundColor: '#8BA3C0', width: '100%', paddingVertical: 16, borderRadius: 30, shadowColor: '#8BA3C0', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  hintContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 15, gap: 6 },
  hintText: { fontSize: 15, color: '#5A7C9D', fontWeight: '500' },
});