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
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [cardId, setCardId] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [nickname, setNickname] = useState("");
  const [department, setDepartment] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState("");
  const [createDate, setCreateDate] = useState("");
  const [editDate, setEditDate] = useState("");

  const saveData = async () => {
    if (firstname === "" || lastname === "" || employeeId === "") {
      Alert.alert("แจ้งเตือน", "กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    const now = new Date().toISOString().slice(0, 19).replace("T", " ");

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
          createDate: now,
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
        setCreateDate("");
        setEditDate("");
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

      <TextInput
        style={styles.input}
        placeholder="วันที่แก้ไข"
        value={editDate}
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
  },

  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
});
