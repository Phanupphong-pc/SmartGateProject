import React, { useState } from "react";
import {
  Alert,
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
  const [cardId, setCardId] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [nickname, setNickname] = useState("");
  const [department, setDepartment] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState("");

  // แสดงวันที่ทันทีเมื่อเปิดหน้า
  const [createDate, setCreateDate] = useState(getCurrentDate());

  const saveData = async () => {
    if (firstname === "" || lastname === "" || employeeId === "") {
      Alert.alert("แจ้งเตือน", "กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    const now = getCurrentDate();

    try {
      const response = await fetch("http://IP/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstname,
          lastname,
          cardId,
          employeeId,
          nickname,
          department,
          phone,
          image,
          createDate,
          editDate: now,
        }),
      });

      const result = await response.json();

      if (result.status === "success") {
        Alert.alert("สำเร็จ", result.message);

        setFirstName("");
        setLastName("");
        setCardId("");
        setEmployeeId("");
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
    <ScrollView style={styles.container}>
      <Text style={styles.title}>เพิ่มข้อมูลพนักงาน</Text>

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
        value={employeeId}
        onChangeText={setEmployeeId}
      />

      <TextInput
        style={styles.input}
        placeholder="เลขบัตรประชาชน"
        value={cardId}
        onChangeText={setCardId}
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
        value={createDate}
        editable={false}
      />

      <TouchableOpacity style={styles.button} onPress={saveData}>
        <Text style={styles.buttonText}>บันทึกข้อมูล</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f2f2f2",
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },

  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },

  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 20,
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
});