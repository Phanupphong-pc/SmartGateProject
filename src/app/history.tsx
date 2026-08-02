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
} from "react-native";

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
      const response = await fetch("http://10.79.230.211/SmartGate/api/addMember.php", {
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

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 80 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>เพิ่มข้อมูลพนักงาน</Text>

        <TextInput
          style={styles.carduid}
          placeholder="เลขบัตรประจำตัวพนักงาน"
          value={card_uid}
          onChangeText={setCard_uid}
        />

        <TextInput
          style={styles.input}
          placeholder="ชื่อ"
          value={firstname}
          onChangeText={setFirstName}
        />

        <TextInput
          style={styles.input}
          placeholder="นามสกุล"
          value={lastname}
          onChangeText={setLastName}
        />

        <TextInput
          style={styles.input}
          placeholder="ชื่อเล่น"
          value={nickname}
          onChangeText={setNickname}
        />

        <TextInput
          style={styles.input}
          placeholder="รหัสพนักงาน"
          value={employee_id}
          onChangeText={setEmployee_id}
        />


        <TextInput
          style={styles.input}
          placeholder="แผนก"
          value={department}
          onChangeText={setDepartment}
        />

        <TextInput
          style={styles.input}
          placeholder="เบอร์โทร"
          value={phone}
          onChangeText={setPhone}
        />

        <TextInput
          style={styles.input}
          placeholder="URL รูปภาพ"
          value={image}
          onChangeText={setImage}
        />

        <TextInput
          style={styles.input}
          placeholder="วันที่สร้าง"
          value={create_date}
          editable={false}
        />

        <TouchableOpacity style={styles.button} onPress={saveData}>
          <Text style={styles.buttonText}>บันทึกข้อมูล</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#0B1120"
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#F1F5F9",
  },

  input: {
    backgroundColor: "#1A2332",
    borderWidth: 1,
    borderColor: "#1E293B",
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    color: "#ffffffff",
  },

  button: {
    backgroundColor: "#0E7490",
    padding: 14,
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 20,
    shadowColor: "#06B6D4",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },

  buttonText: {
    color: "#E0F2FE",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  carduid: {
    backgroundColor: "#1A2332",
    borderWidth: 1.5,
    borderColor: "#0891B2",
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    color: "#22D3EE",
  }

});
