import React, { useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

// 💡 ชี้ไปที่โฟลเดอร์ api
const BASE_URL = "http://10.79.230.211/SmartGate/api";

export default function MemberEdit() {
    const [searchId, setSearchId] = useState<string>("");
    const [old_employee_id, setOldEmployeeId] = useState<string>("");

    // State ชื่อตัวแปรแบบเดียวกับ history.tsx (snake_case)
    const [card_uid, setCard_uid] = useState<string>("");
    const [employee_id, setEmployee_id] = useState<string>("");
    const [firstname, setFirstName] = useState<string>("");
    const [lastname, setLastName] = useState<string>("");
    const [nickname, setNickname] = useState<string>("");
    const [department, setDepartment] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [image, setImage] = useState<string>("");
    const [status, setStatus] = useState<string>("");
    const [create_date, setCreateDate] = useState<string>("");
    const [edit_date, setEditDate] = useState<string>("");

    const [isFound, setIsFound] = useState<boolean>(false);

    // 1. ค้นหาพนักงาน
    const searchMember = async (): Promise<void> => {
        if (!searchId.trim()) {
            Alert.alert("แจ้งเตือน", "กรุณากรอกรหัสพนักงาน");
            return;
        }

        try {
            const response = await fetch(
                `${BASE_URL}/findMember.php?employee_id=` + encodeURIComponent(searchId)
            );
            const json = await response.json();

            if (json.status === "success") {
                setOldEmployeeId(json.data.employee_id || "");

                // แมปค่าเข้า State ตัวแปรใหม่
                setCard_uid(json.data.card_uid || "");
                setEmployee_id(json.data.employee_id || "");
                setFirstName(json.data.firstname || "");
                setLastName(json.data.lastname || "");
                setNickname(json.data.nickname || "");
                setDepartment(json.data.department || "");
                setPhone(json.data.phone || "");
                setImage(json.data.image || "");
                setStatus(json.data.status || "");
                setCreateDate(json.data.create_date || "");
                setEditDate(json.data.edit_date || "");

                setIsFound(true);
            } else {
                setIsFound(false);
                Alert.alert("ผลการค้นหา", json.message || "ไม่พบข้อมูลพนักงาน");
            }
        } catch (error) {
            Alert.alert("Error", "เกิดข้อผิดพลาดในการค้นหา");
        }
    };

    // 2. บันทึกการแก้ไข (ส่งแบบ JSON เหมือน history.tsx)
    const updateMember = async (): Promise<void> => {
        if (!employee_id.trim() || !firstname.trim() || !lastname.trim()) {
            Alert.alert("แจ้งเตือน", "กรุณากรอกข้อมูลสำคัญให้ครบถ้วน");
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/editMember.php`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    old_employee_id,
                    card_uid,
                    employee_id,
                    firstname,
                    lastname,
                    nickname,
                    department,
                    phone,
                    image,
                    status,
                    create_date,
                    edit_date,
                }),
            });

            const json = await response.json();

            if (json.status === "success") {
                Alert.alert("สำเร็จ", json.message);
                setSearchId("");
                setIsFound(false);
            } else {
                Alert.alert("ผิดพลาด", json.message);
            }
        } catch (error) {
            Alert.alert("Error", "เกิดข้อผิดพลาดในการอัปเดตข้อมูล");
        }
    };

    // 3. ลบข้อมูล (ส่งแบบ JSON เหมือน history.tsx)
    const deleteMember = async (): Promise<void> => {
        Alert.alert("ยืนยันการลบ", `คุณต้องการลบพนักงานรหัส ${old_employee_id} ใช่หรือไม่?`, [
            { text: "ยกเลิก", style: "cancel" },
            {
                text: "ลบข้อมูล",
                style: "destructive",
                onPress: async () => {
                    try {
                        const response = await fetch(`${BASE_URL}/deleteMember.php`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                employee_id: old_employee_id,
                            }),
                        });

                        const json = await response.json();

                        if (json.status === "success") {
                            Alert.alert("สำเร็จ", json.message);
                            setSearchId("");
                            setIsFound(false);
                        } else {
                            Alert.alert("ผิดพลาด", json.message);
                        }
                    } catch (error) {
                        Alert.alert("Error", "เกิดข้อผิดพลาดในการลบข้อมูล");
                    }
                },
            },
        ]);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>จัดการข้อมูลสมาชิก</Text>

            {/* โซนค้นหา */}
            <TextInput
                style={styles.input}
                placeholder="กรอกรหัสพนักงานที่ต้องการค้นหา"
                value={searchId}
                onChangeText={setSearchId}
            />
            <Button title="ค้นหาข้อมูล" onPress={searchMember} />

            {/* โซนฟอร์มแก้ไข/ลบข้อมูล */}
            {isFound && (
                <View style={styles.editForm}>
                    <Text style={styles.subTitle}>แก้ไขรายละเอียดสมาชิก</Text>

                    <Text style={styles.label}>1. Card UID:</Text>
                    <TextInput style={styles.input} value={card_uid} onChangeText={setCard_uid} />

                    <Text style={styles.label}>2. รหัสพนักงาน (Employee ID):</Text>
                    <TextInput style={styles.input} value={employee_id} onChangeText={setEmployee_id} />

                    <Text style={styles.label}>3. ชื่อ (Firstname):</Text>
                    <TextInput style={styles.input} value={firstname} onChangeText={setFirstName} />

                    <Text style={styles.label}>4. นามสกุล (Lastname):</Text>
                    <TextInput style={styles.input} value={lastname} onChangeText={setLastName} />

                    <Text style={styles.label}>5. ชื่อเล่น (Nickname):</Text>
                    <TextInput style={styles.input} value={nickname} onChangeText={setNickname} />

                    <Text style={styles.label}>6. แผนก (Department):</Text>
                    <TextInput style={styles.input} value={department} onChangeText={setDepartment} />

                    <Text style={styles.label}>7. เบอร์โทร (Phone):</Text>
                    <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

                    <Text style={styles.label}>8. รูปภาพ (Image Path/URL):</Text>
                    <TextInput style={styles.input} value={image} onChangeText={setImage} />

                    <Text style={styles.label}>9. สถานะ (Status):</Text>
                    <TextInput style={styles.input} value={status} onChangeText={setStatus} />

                    <Text style={styles.label}>10. วันที่สร้าง (Create Date):</Text>
                    <TextInput style={[styles.input, styles.disabledInput]} value={create_date} editable={false} />

                    <Text style={styles.label}>11. วันที่แก้ไขล่าสุด (Edit Date):</Text>
                    <TextInput style={[styles.input, styles.disabledInput]} value={edit_date} editable={false} placeholder="ระบบจะบันทึกให้อัตโนมัติ" />

                    {/* ปุ่มบันทึกการแก้ไข */}
                    <View style={{ marginTop: 15 }}>
                        <Button title="บันทึกการแก้ไข" color="green" onPress={updateMember} />
                    </View>

                    {/* ปุ่มลบข้อมูล */}
                    <View style={{ marginTop: 10 }}>
                        <Button title="ลบข้อมูล" color="red" onPress={deleteMember} />
                    </View>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingTop: 50,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    subTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
        color: '#333',
    },
    label: {
        fontSize: 14,
        marginBottom: 4,
        color: '#555',
        fontWeight: '500',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 12,
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    disabledInput: {
        backgroundColor: '#e9ecef',
        color: '#6c757d',
    },
    editForm: {
        marginTop: 20,
        padding: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#f9f9f9',
        borderRadius: 5,
    },
});