import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useState } from "react";
import { saveMoodEntry } from "../../utils/database";

export default function MoodScreen() {
  const [moodScore, setMoodScore] = useState(3);
  const [energyLevel, setEnergyLevel] = useState(3);
  const [stressLevel, setStressLevel] = useState(3);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const moodEmojis = ["😢", "😕", "😐", "🙂", "😄"];
  const energyEmojis = ["😴", "🥱", "😌", "😊", "⚡"];
  const stressEmojis = ["😌", "🙂", "😐", "😰", "😫"];

  const handleSave = async () => {
    setSaving(true);
    const success = await saveMoodEntry(moodScore, energyLevel, stressLevel, notes);
    setSaving(false);
    
    if (success) {
      Alert.alert("✅ 成功", "情緒記錄已儲存！", [{ text: "OK" }]);
      // Reset to default
      setMoodScore(3);
      setEnergyLevel(3);
      setStressLevel(3);
      setNotes("");
    } else {
      Alert.alert("❌ 錯誤", "儲存失敗，請再試一次", [{ text: "OK" }]);
    }
  };

  const renderSlider = (label, value, setValue, emojis, description) => (
    <View style={styles.sliderContainer}>
      <Text style={styles.sliderLabel}>{label}</Text>
      <Text style={styles.sliderDescription}>{description}</Text>
      <View style={styles.emojiRow}>
        {emojis.map((emoji, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.emojiButton,
              value === index + 1 && styles.emojiButtonSelected,
            ]}
            onPress={() => setValue(index + 1)}
          >
            <Text style={styles.emoji}>{emoji}</Text>
            <Text style={styles.emojiNumber}>{index + 1}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>😊 情緒問卷</Text>
      <Text style={styles.subtitle}>每天記錄 3 次你的情緒狀態</Text>

      {renderSlider(
        "心情如何？",
        moodScore,
        setMoodScore,
        moodEmojis,
        "1 = 非常低落，5 = 非常開心"
      )}

      {renderSlider(
        "精力程度？",
        energyLevel,
        setEnergyLevel,
        energyEmojis,
        "1 = 非常疲憊，5 = 精力充沛"
      )}

      {renderSlider(
        "壓力程度？",
        stressLevel,
        setStressLevel,
        stressEmojis,
        "1 = 非常放鬆，5 = 壓力很大"
      )}

      <TouchableOpacity
        style={[styles.saveButton, saving && styles.saveButtonDisabled]}
        onPress={handleSave}
        disabled={saving}
      >
        <Text style={styles.saveButtonText}>
          {saving ? "儲存中..." : "💾 儲存記錄"}
        </Text>
      </TouchableOpacity>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          💡 提示：作業要求每種數據類型至少 3 筆記錄，且時間跨度需超過 12 小時。
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    color: "#1C1C1E",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#8E8E93",
    marginBottom: 24,
  },
  sliderContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sliderLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 4,
  },
  sliderDescription: {
    fontSize: 12,
    color: "#8E8E93",
    marginBottom: 12,
  },
  emojiRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  emojiButton: {
    alignItems: "center",
    padding: 8,
    borderRadius: 12,
    backgroundColor: "#F2F2F7",
    minWidth: 56,
  },
  emojiButtonSelected: {
    backgroundColor: "#007AFF",
  },
  emoji: {
    fontSize: 28,
  },
  emojiNumber: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 4,
  },
  saveButton: {
    backgroundColor: "#34C759",
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    marginTop: 8,
  },
  saveButtonDisabled: {
    backgroundColor: "#A8A8A8",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  infoBox: {
    backgroundColor: "#E3F2FD",
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
  },
  infoText: {
    fontSize: 13,
    color: "#1565C0",
    lineHeight: 20,
  },
});
