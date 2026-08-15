import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function History() {
  // ฟังก์ชันแสดงวันเวลาปัจจุบัน
  const getCurrentDate = () => {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    const hour = String(now.getHours()).padStart(2, "0");
    const minute = String(now.getMinutes()).padStart(2, "0");
    const second = String(now.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  };

  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [card_uid, setCard_uid] = useState("");
  const [employee_id, setEmployee_id] = useState("");
  const [nickname, setNickname] = useState("");
  const [department, setDepartment] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState("");

  // แสดงวันที่ทันทีเมื่อเปิดหน้า
  const [create_date, setCreateDate] = useState(getCurrentDate());

  const saveData = async () => {
    if (firstname === "" ||
      lastname === "" ||
      employee_id === "" ||
      card_uid === "" ||
      nickname === "" ||
      department === "" ||
      phone === "") {
      Alert.alert("แจ้งเตือน", "กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    const now = getCurrentDate();

    try {
      const response = await fetch("http://10.12.221.211/SmartGate/api/addMember.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstname,
          lastname,
          card_uid,
          employee_id,
          nickname,
          department,
          phone,
          image,
          status: "Active",
          create_date,
          edit_date: now,
        }),
      });

      const result = await response.json();

      if (result.status === "success") {
        Alert.alert("สำเร็จ", result.message);

        setFirstName("");
        setLastName("");
        setCard_uid("");
        setEmployee_id("");
        setNickname("");
        setDepartment("");
        setPhone("");
        setImage("");

        // อัปเดตวันที่ใหม่
        setCreateDate(getCurrentDate());
      } else {
        Alert.alert("ผิดพลาด", result.message);
      }
    } catch (error) {
      Alert.alert("Error", "ไม่สามารถเชื่อมต่อ Server");
    }
  };

  const renderInput = (icon: string, placeholder: string, value: string, onChangeText: (t: string) => void, extra?: object) => (
    <View style={styles.inputRow}>
      <View style={styles.inputIcon}>
        <Ionicons name={icon as any} size={18} color="#10B981" />
      </View>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        value={value}
        onChangeText={onChangeText}
        {...extra}
      />
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>เพิ่มข้อมูลพนักงาน</Text>

          {/* Card UID - highlighted */}
          <View style={styles.cardUidRow}>
            <View style={styles.cardUidIcon}>
              <Ionicons name="card-outline" size={20} color="#FFFFFF" />
            </View>
            <TextInput
              style={styles.cardUidInput}
              placeholder="เลขบัตรประจำตัวพนักงาน"
              placeholderTextColor="#94A3B8"
              value={card_uid}
              onChangeText={setCard_uid}
            />
          </View>

          {renderInput("person-outline", "ชื่อ", firstname, setFirstName)}
          {renderInput("person-outline", "นามสกุล", lastname, setLastName)}
          {renderInput("happy-outline", "ชื่อเล่น", nickname, setNickname)}
          {renderInput("id-card-outline", "รหัสพนักงาน", employee_id, setEmployee_id)}
          {renderInput("business-outline", "แผนก", department, setDepartment)}
          {renderInput("call-outline", "เบอร์โทร", phone, setPhone, { keyboardType: "phone-pad" })}
          {renderInput("image-outline", "URL รูปภาพ", image, setImage)}

          {/* Date (readonly) */}
          <View style={[styles.inputRow, { opacity: 0.6 }]}>
            <View style={styles.inputIcon}>
              <Ionicons name="calendar-outline" size={18} color="#10B981" />
            </View>
            <TextInput
              style={styles.input}
              placeholder="วันที่สร้าง"
              placeholderTextColor="#94A3B8"
              value={create_date}
              editable={false}
            />
          </View>

          <TouchableOpacity activeOpacity={0.8} onPress={saveData}>
            <LinearGradient
              colors={['#059669', '#10B981']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}
            >
              <Ionicons name="save-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.buttonText}>บันทึกข้อมูล</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
  },

  title: {
    fontSize: 28,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 24,
    color: "#1E293B",
    letterSpacing: -0.5,
  },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  inputIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    padding: 14,
    fontSize: 15,
    color: "#1E293B",
  },

  cardUidRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#F8FAFC",
    borderWidth: 2,
    borderColor: "#10B981",
    borderRadius: 16,
    marginBottom: 18,
    paddingHorizontal: 4,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  cardUidIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  cardUidInput: {
    flex: 1,
    padding: 14,
    fontSize: 15,
    color: "#1E293B",
    fontWeight: '600',
  },

  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginTop: 12,
    marginBottom: 20,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },

  buttonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "900",
    fontSize: 17,
  },
});