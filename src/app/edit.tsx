import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const BASE_URL = "http://10.12.221.211/SmartGate/api";

export default function MemberEdit() {
    const [searchId, setSearchId] = useState<string>("");
    const [old_employee_id, setOldEmployeeId] = useState<string>("");

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

                setCreateDate(json.data.create_date || getCurrentDate());

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

    const updateMember = async (): Promise<void> => {
        if (!employee_id.trim() || !firstname.trim() || !lastname.trim()) {
            Alert.alert("แจ้งเตือน", "กรุณากรอกข้อมูลสำคัญให้ครบถ้วน");
            return;
        }

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
                    edit_date: currentNow,
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
        <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>จัดการข้อมูลสมาชิก</Text>

                <View style={styles.searchRow}>
                    <View style={styles.searchIconBox}>
                        <Ionicons name="search" size={20} color="#10B981" />
                    </View>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="กรอกรหัสพนักงานที่ต้องการค้นหา"
                        placeholderTextColor="#94A3B8"
                        value={searchId}
                        onChangeText={setSearchId}
                    />
                </View>
                <TouchableOpacity activeOpacity={0.8} onPress={searchMember}>
                    <LinearGradient
                        colors={['#059669', '#10B981']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.searchButton}
                    >
                        <Ionicons name="search" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                        <Text style={styles.searchButtonText}>ค้นหาข้อมูล</Text>
                    </LinearGradient>
                </TouchableOpacity>

                {isFound && (
                    <View style={styles.editForm}>
                        <View style={styles.formHeader}>
                            <Ionicons name="create-outline" size={20} color="#10B981" />
                            <Text style={styles.subTitle}>แก้ไขรายละเอียดสมาชิก</Text>
                        </View>

                        <Text style={styles.label}>1. Card UID:</Text>
                        <TextInput style={styles.input} value={card_uid} onChangeText={setCard_uid} placeholderTextColor="#94A3B8" />

                        <Text style={styles.label}>2. รหัสพนักงาน (Employee ID):</Text>
                        <TextInput style={styles.input} value={employee_id} onChangeText={setEmployee_id} placeholderTextColor="#94A3B8" />

                        <Text style={styles.label}>3. ชื่อ (Firstname):</Text>
                        <TextInput style={styles.input} value={firstname} onChangeText={setFirstName} placeholderTextColor="#94A3B8" />

                        <Text style={styles.label}>4. นามสกุล (Lastname):</Text>
                        <TextInput style={styles.input} value={lastname} onChangeText={setLastName} placeholderTextColor="#94A3B8" />

                        <Text style={styles.label}>5. ชื่อเล่น (Nickname):</Text>
                        <TextInput style={styles.input} value={nickname} onChangeText={setNickname} placeholderTextColor="#94A3B8" />

                        <Text style={styles.label}>6. แผนก (Department):</Text>
                        <TextInput style={styles.input} value={department} onChangeText={setDepartment} placeholderTextColor="#94A3B8" />

                        <Text style={styles.label}>7. เบอร์โทร (Phone):</Text>
                        <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholderTextColor="#94A3B8" />

                        <Text style={styles.label}>8. รูปภาพ (Image Path/URL):</Text>
                        <TextInput style={styles.input} value={image} onChangeText={setImage} placeholderTextColor="#94A3B8" />

                        <Text style={styles.label}>9. สถานะ (Status):</Text>
                        <View style={styles.statusContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.statusButton,
                                    status === 'Active' ? styles.statusActiveBtn : styles.statusDefault
                                ]}
                                onPress={() => setStatus('Active')}
                                activeOpacity={0.8}
                            >
                                <Ionicons name="checkmark-circle" size={16} color={status === 'Active' ? '#10B981' : '#94A3B8'} style={{ marginRight: 6 }} />
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
                                    status === 'Inactive' ? styles.statusInactiveBtn : styles.statusDefault
                                ]}
                                onPress={() => setStatus('Inactive')}
                                activeOpacity={0.8}
                            >
                                <Ionicons name="close-circle" size={16} color={status === 'Inactive' ? '#EF4444' : '#94A3B8'} style={{ marginRight: 6 }} />
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
                            placeholderTextColor="#94A3B8"
                        />

                        <TouchableOpacity activeOpacity={0.8} onPress={updateMember}>
                            <LinearGradient
                                colors={['#059669', '#10B981']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.saveButton}
                            >
                                <Ionicons name="save-outline" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                                <Text style={styles.saveButtonText}>บันทึกการแก้ไข</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={deleteMember}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="trash-outline" size={18} color="#EF4444" style={{ marginRight: 8 }} />
                            <Text style={styles.deleteButtonText}>ลบข้อมูล</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingTop: 50,
        flexGrow: 1,
        paddingBottom: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: '900',
        marginBottom: 20,
        textAlign: 'center',
        color: "#1E293B",
        letterSpacing: -0.5,
    },
    subTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#1E293B',
        marginLeft: 8,
    },
    formHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    label: {
        fontSize: 13,
        marginBottom: 6,
        color: '#64748B',
        fontWeight: '600',
    },
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "#F8FAFC",
        borderWidth: 1,
        borderColor: "#E2E8F0",
        borderRadius: 16,
        marginBottom: 14,
        paddingHorizontal: 4,
    },
    searchIconBox: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchInput: {
        flex: 1,
        padding: 14,
        fontSize: 15,
        color: "#1E293B",
    },
    input: {
        backgroundColor: "#F8FAFC",
        borderWidth: 1,
        borderColor: "#E2E8F0",
        borderRadius: 12,
        padding: 14,
        marginBottom: 14,
        fontSize: 15,
        color: "#1E293B",
    },
    disabledInput: {
        backgroundColor: '#F1F5F9',
        color: '#94A3B8',
        borderColor: '#E2E8F0',
    },
    editForm: {
        marginTop: 10,
        padding: 20,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        backgroundColor: '#FFFFFF',
        borderRadius: 22,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 3,
    },
    statusContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 14,
        gap: 12,
    },
    statusButton: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: 12,
        borderWidth: 1,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statusDefault: {
        backgroundColor: '#F8FAFC',
        borderColor: '#E2E8F0',
    },
    statusActiveBtn: {
        backgroundColor: '#ECFDF5',
        borderColor: '#10B981',
    },
    statusInactiveBtn: {
        backgroundColor: '#FEF2F2',
        borderColor: '#EF4444',
    },
    statusText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#94A3B8',
    },
    statusActiveText: {
        color: '#10B981',
    },
    statusInactiveText: {
        color: '#EF4444',
    },

    saveButton: {
        flexDirection: 'row',
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 18,
        shadowColor: '#059669',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '900',
    },
    deleteButton: {
        flexDirection: 'row',
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        backgroundColor: '#FEF2F2',
        borderWidth: 1,
        borderColor: '#FECACA',
    },
    deleteButtonText: {
        color: '#EF4444',
        fontSize: 16,
        fontWeight: '800',
    },
    searchButton: {
        flexDirection: 'row',
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        shadowColor: '#059669',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    searchButtonText: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: '900',
    },
});