import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// 💡 1. [เพิ่ม] กำหนดค่า BASE_URL
const BASE_URL = "http://10.79.230.211/SmartGate/api";

export default function MemberEdit() {
    const [searchId, setSearchId] = useState<string>("");
    const [old_employee_id, setOldEmployeeId] = useState<string>("");

    // State ตัวแปร snake_case
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

    // 💡 2. [ย้ายขึ้นมาบนสุด] ฟังก์ชันแสดงวันเวลาปัจจุบัน (รูปแบบ YYYY-MM-DD HH:mm:ss)
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

                setCard_uid(json.data.card_uid || "");
                setEmployee_id(json.data.employee_id || "");
                setFirstName(json.data.firstname || "");
                setLastName(json.data.lastname || "");
                setNickname(json.data.nickname || "");
                setDepartment(json.data.department || "");
                setPhone(json.data.phone || "");
                setImage(json.data.image || "");
                setStatus(json.data.status || "");

                // 💡 3. [แก้] ถ้า DB ไม่มี create_date ให้ใช้วันเวลาปัจจุบันแทน
                setCreateDate(json.data.create_date || getCurrentDate());

                // 💡 4. [แก้] ตั้งค่าวันที่แก้ไขเป็นเวลาปัจจุบัน
                setEditDate(getCurrentDate());

                setIsFound(true);
            } else {
                setIsFound(false);
                Alert.alert("ผลการค้นหา", json.message || "ไม่พบข้อมูลพนักงาน");
            }
        } catch (error) {
            Alert.alert("Error", "เกิดข้อผิดพลาดในการค้นหา");
        }
    };

    // 2. บันทึกการแก้ไข
    const updateMember = async (): Promise<void> => {
        if (!employee_id.trim() || !firstname.trim() || !lastname.trim()) {
            Alert.alert("แจ้งเตือน", "กรุณากรอกข้อมูลสำคัญให้ครบถ้วน");
            return;
        }

        // 💡 5. [เพิ่ม] ดึงเวลาปัจจุบันเพื่อบันทึกเป็น edit_date ล่าสุด ณ วินาทีที่กดบันทึก
        const currentNow = getCurrentDate();
        setEditDate(currentNow);

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
                    edit_date: currentNow, // ส่งเวลาปัจจุบันไปยังฝั่ง PHP
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

    // 3. ลบข้อมูล
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
                placeholderTextColor="#94A3B8" // ช่วยให้ข้อความ Placeholder ดูนุ่มตาอ่านง่าย
                value={searchId}
                onChangeText={setSearchId}
            />
            <TouchableOpacity
                style={[styles.actionButton, styles.searchButton]}
                onPress={searchMember}
                activeOpacity={0.8}
            >
                <Text style={styles.actionButtonText}>ค้นหาข้อมูล</Text>
            </TouchableOpacity>

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
                    <View style={styles.statusContainer}>
                        <TouchableOpacity
                            style={[
                                styles.statusButton,
                                status === 'Active' && styles.statusActiveBtn
                            ]}
                            onPress={() => setStatus('Active')}
                        >
                            <Text style={[
                                styles.statusText,
                                status === 'Active' && styles.statusActiveText
                            ]}>
                                Active
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.statusButton,
                                status === 'Inactive' && styles.statusInactiveBtn
                            ]}
                            onPress={() => setStatus('Inactive')}
                        >
                            <Text style={[
                                styles.statusText,
                                status === 'Inactive' && styles.statusInactiveText
                            ]}>
                                Inactive
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.label}>10. วันที่สร้าง (Create Date):</Text>
                    <TextInput
                        style={[styles.input, styles.disabledInput]}
                        value={create_date}
                        editable={false}
                    />

                    <Text style={styles.label}>11. วันที่แก้ไขล่าสุด (Edit Date):</Text>
                    <TextInput
                        style={[styles.input, styles.disabledInput]}
                        value={edit_date}
                        editable={false}
                        placeholder="ระบบจะบันทึกให้อัตโนมัติ"
                    />

                    {/* ปุ่มบันทึกการแก้ไข */}
                    <TouchableOpacity
                        style={[styles.actionButton, styles.saveButton]}
                        onPress={updateMember}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.actionButtonText}>บันทึกการแก้ไข</Text>
                    </TouchableOpacity>

                    {/* ปุ่มลบข้อมูล */}
                    <TouchableOpacity
                        style={[styles.actionButton, styles.deleteButton]}
                        onPress={deleteMember}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.actionButtonText}>ลบข้อมูล</Text>
                    </TouchableOpacity>
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
        fontSize: 24,
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
        backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
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
    statusContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    statusButton: {
        flex: 1,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        alignItems: 'center',
        backgroundColor: '#fff',
        marginHorizontal: 4,
    },
    statusActiveBtn: {
        backgroundColor: '#28a745', // สีเขียวเมื่อเลือก Active
        borderColor: '#28a745',
    },
    statusInactiveBtn: {
        backgroundColor: '#dc3545', // สีแดงเมื่อเลือก Inactive
        borderColor: '#dc3545',
    },
    statusText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#555',
    },
    statusActiveText: {
        color: '#fff',
    },
    statusInactiveText: {
        color: '#fff',
    },

    actionButton: {
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    saveButton: {
        backgroundColor: '#10B981',
        marginTop: 15,
    },
    deleteButton: {
        backgroundColor: '#EF4444',
    },
    actionButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    searchButton: {
        backgroundColor: '#007bffff',
        marginTop: 5,
        marginBottom: 15,
    },
});