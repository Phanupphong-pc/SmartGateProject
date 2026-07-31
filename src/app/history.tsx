import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View, ScrollView } from "react-native";

const History = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [cardId, setCardId] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [nickname, setNickname] = useState("");
  const [department, setDepartment] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState("");
  const [status, setStatus] = useState("");

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>History Page</Text>

      <View style={styles.inputContainer}>
        <Text>ชื่อจริง:</Text>
        <TextInput
          style={styles.input}
          placeholder="กรอกชื่อจริง"
          value={firstname}
          onChangeText={setFirstname}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text>นามสกุล:</Text>
        <TextInput
          style={styles.input}
          placeholder="กรอกนามสกุล"
          value={lastname}
          onChangeText={setLastname}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text>เลขบัตรประชาชน (Card ID):</Text>
        <TextInput
          style={styles.input}
          placeholder="กรอก Card ID"
          value={cardId}
          onChangeText={setCardId}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text>รหัสพนักงาน (Employee ID):</Text>
        <TextInput
          style={styles.input}
          placeholder="กรอก Employee ID"
          value={employeeId}
          onChangeText={setEmployeeId}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text>ชื่อเล่น:</Text>
        <TextInput
          style={styles.input}
          placeholder="กรอกชื่อเล่น"
          value={nickname}
          onChangeText={setNickname}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text>แผนก (Department):</Text>
        <TextInput
          style={styles.input}
          placeholder="กรอกแผนก"
          value={department}
          onChangeText={setDepartment}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text>เบอร์โทรศัพท์ (Phone):</Text>
        <TextInput
          style={styles.input}
          placeholder="กรอกเบอร์โทรศัพท์"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text>รูปภาพ (Image URL):</Text>
        <TextInput
          style={styles.input}
          placeholder="กรอก URL รูปภาพ"
          value={image}
          onChangeText={setImage}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text>สถานะ (Status):</Text>
        <TextInput
          style={styles.input}
          placeholder="กรอกสถานะ"
          value={status}
          onChangeText={setStatus}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    marginTop: 4,
  },
});

export default History;
