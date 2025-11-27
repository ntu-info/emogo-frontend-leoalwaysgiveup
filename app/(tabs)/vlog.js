import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Platform } from "react-native";
import { useState, useRef, useEffect } from "react";
import { saveVlogEntry, getVlogEntries } from "../../utils/database";

// Web Camera Component
function WebCamera({ onRecord }) {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: true
      });
      setStream(mediaStream);
      setHasPermission(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Camera error:', err);
      setHasPermission(false);
    }
  };

  const startRecording = () => {
    if (!stream) return;

    const mediaRecorder = new MediaRecorder(stream);
    const chunks = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunks.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      onRecord(url);
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setIsRecording(true);

    // Stop after 1 second
    setTimeout(() => {
      if (mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        setIsRecording(false);
      }
    }, 1000);
  };

  if (hasPermission === false) {
    return (
      <View style={styles.permissionBox}>
        <Text style={styles.permissionTitle}>📹 需要相機權限</Text>
        <Text style={styles.permissionText}>請允許瀏覽器存取相機</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={startCamera}>
          <Text style={styles.permissionButtonText}>重試</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.webCameraContainer}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          width: '100%',
          height: 300,
          objectFit: 'cover',
          borderRadius: 16,
          transform: 'scaleX(-1)',
        }}
      />
      <TouchableOpacity
        style={[styles.recordButton, isRecording && styles.recordButtonRecording]}
        onPress={startRecording}
        disabled={isRecording || !hasPermission}
      >
        <View style={[
          styles.recordButtonInner,
          isRecording && styles.recordButtonInnerRecording,
        ]} />
      </TouchableOpacity>
      <Text style={styles.recordText}>
        {isRecording ? "錄影中..." : "點擊錄製 1 秒 Vlog"}
      </Text>
    </View>
  );
}

// Native Camera Component
function NativeCamera({ onRecord }) {
  const [permission, setPermission] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [facing, setFacing] = useState("front");
  const cameraRef = useRef(null);
  const CameraView = useRef(null);

  useEffect(() => {
    loadCamera();
  }, []);

  const loadCamera = async () => {
    try {
      const { CameraView: CV, useCameraPermissions } = require('expo-camera');
      CameraView.current = CV;
      const [perm, requestPerm] = useCameraPermissions();
      if (!perm?.granted) {
        const result = await requestPerm();
        setPermission(result.granted);
      } else {
        setPermission(true);
      }
    } catch (e) {
      console.error('Camera load error:', e);
      setPermission(false);
    }
  };

  const recordVlog = async () => {
    if (!cameraRef.current) return;
    try {
      setIsRecording(true);
      const video = await cameraRef.current.recordAsync({ maxDuration: 1 });
      onRecord(video.uri);
    } catch (error) {
      console.error("Recording error:", error);
      Alert.alert("❌ 錯誤", "錄影失敗：" + error.message);
    } finally {
      setIsRecording(false);
    }
  };

  if (!permission || !CameraView.current) {
    return (
      <View style={styles.permissionBox}>
        <Text style={styles.permissionTitle}>📹 載入相機中...</Text>
      </View>
    );
  }

  const CV = CameraView.current;
  return (
    <View style={styles.nativeCameraContainer}>
      <CV ref={cameraRef} style={styles.camera} facing={facing} mode="video" />
      <TouchableOpacity
        style={[styles.recordButton, isRecording && styles.recordButtonRecording]}
        onPress={recordVlog}
        disabled={isRecording}
      >
        <View style={[
          styles.recordButtonInner,
          isRecording && styles.recordButtonInnerRecording,
        ]} />
      </TouchableOpacity>
      <Text style={styles.recordText}>
        {isRecording ? "錄影中..." : "點擊錄製 1 秒 Vlog"}
      </Text>
    </View>
  );
}

export default function VlogScreen() {
  const [recentVlogs, setRecentVlogs] = useState([]);
  const isWeb = Platform.OS === 'web';

  useEffect(() => {
    loadRecentVlogs();
  }, []);

  const loadRecentVlogs = async () => {
    const vlogs = await getVlogEntries();
    setRecentVlogs(vlogs.slice(0, 5));
  };

  const handleRecord = async (videoUri) => {
    await saveVlogEntry(videoUri, 1);
    if (isWeb) {
      alert("✅ 1秒 Vlog 已儲存！");
    } else {
      Alert.alert("✅ 成功", "1秒 Vlog 已儲存！");
    }
    loadRecentVlogs();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>📹 1秒 Vlog</Text>
      <Text style={styles.subtitle}>錄製 1 秒的影片記錄此刻</Text>

      {isWeb ? (
        <WebCamera onRecord={handleRecord} />
      ) : (
        <NativeCamera onRecord={handleRecord} />
      )}

      {/* Recent vlogs */}
      <View style={styles.recentContainer}>
        <Text style={styles.recentTitle}>最近錄影 ({recentVlogs.length})</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {recentVlogs.map((vlog) => (
            <View key={vlog.id} style={styles.recentItem}>
              <Text style={styles.recentEmoji}>🎬</Text>
              <Text style={styles.recentTime}>
                {new Date(vlog.timestamp).toLocaleTimeString()}
              </Text>
            </View>
          ))}
          {recentVlogs.length === 0 && (
            <Text style={styles.noVlogs}>還沒有錄影記錄</Text>
          )}
        </ScrollView>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          💡 提示：Vlog 為非結構化主動數據。作業要求至少 3 筆記錄，時間跨度 {">"}12 小時。
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
  webCameraContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  nativeCameraContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  camera: {
    width: "100%",
    height: 300,
    borderRadius: 16,
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FFFFFF",
    borderWidth: 4,
    borderColor: "#FF3B30",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  recordButtonRecording: {
    borderColor: "#8E8E93",
  },
  recordButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FF3B30",
  },
  recordButtonInnerRecording: {
    width: 30,
    height: 30,
    borderRadius: 4,
    backgroundColor: "#FF3B30",
  },
  recordText: {
    marginTop: 12,
    fontSize: 16,
    color: "#8E8E93",
  },
  recentContainer: {
    marginTop: 24,
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 12,
  },
  recentItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    alignItems: "center",
    minWidth: 80,
  },
  recentEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  recentTime: {
    fontSize: 12,
    color: "#8E8E93",
  },
  noVlogs: {
    color: "#8E8E93",
    fontStyle: "italic",
  },
  permissionBox: {
    alignItems: "center",
    padding: 40,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 24,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  permissionText: {
    fontSize: 14,
    color: "#8E8E93",
    textAlign: "center",
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  permissionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
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
