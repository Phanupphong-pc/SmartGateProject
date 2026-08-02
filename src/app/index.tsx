import { Link } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function App() {
    return (
        <View style={styles.safeview}>
            <ScrollView
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
            >

                {/* ส่วนบน: Header + Description */}
                <View style={styles.topSection}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.welcomeTitle}>Welcome</Text>
                        <Text style={styles.welcomeSubtitle}>ยินดีต้อนรับสู่ SmartGate</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.descriptionContainer}>
                        <Text style={styles.descriptionText}>
                            แอปสำหรับดูข้อมูลการสแกนบัตร RFID ผ่านเครื่อง SmartGate พร้อมระบบจัดการและบันทึกข้อมูลสมาชิกที่ใช้งานง่ายและรวดเร็ว
                        </Text>
                    </View>
                </View>

                {/* ส่วนล่าง: เมนูนำทาง (ถูกจัดวางให้อยู่ในระยะสายตาพอดี) */}
                <View style={styles.menuContainer}>
                    <Text style={styles.sectionHeader}>เมนูหลัก</Text>

                    <Link href="/dashboard" style={styles.link}>
                        <Text style={styles.linkText}>Dashboard</Text>
                        
                    </Link>

                    <Link href="/history" style={styles.link}>
                        <Text style={styles.linkText}>Add Member</Text>
                        
                    </Link>

                    <Link href="/edit" style={styles.link}>
                        <Text style={styles.linkText}>Edit Data</Text>
            
                    </Link>
                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    safeview: {
        flex: 1,
        backgroundColor: '#F5F6FA',
    },
    container: {
        flexGrow: 1,
        justifyContent: 'space-between',
        paddingVertical: 60,
        paddingHorizontal: 24,
    },
    topSection: {
        alignItems: 'center',
        width: '100%',
        paddingTop: 20,
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 12,
    },
    welcomeTitle: {
        fontSize: 36,
        fontWeight: '800',
        color: '#0F172A',
        letterSpacing: -0.5,
        marginBottom: 6,
    },
    welcomeSubtitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#475569',
    },
    divider: {
        width: 48,
        height: 4,
        backgroundColor: '#2563EB',
        borderRadius: 2,
        marginVertical: 20,
    },
    descriptionContainer: {
        width: '100%',
        paddingHorizontal: 8,
    },
    descriptionText: {
        fontSize: 15,
        lineHeight: 26,
        color: '#64748B',
        textAlign: 'center',
    },
    menuContainer: {
        width: '100%',
        gap: 14,
        paddingBottom: 20, // เว้นระยะจากขอบล่างให้พอดี
    },
    sectionHeader: {
        fontSize: 13,
        fontWeight: '700',
        color: '#94A3B8',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 4,
        paddingLeft: 4,
    },
    link: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        width: '100%',
        paddingVertical: 20, // เพิ่มขนาดปุ่มให้หนาขึ้น ใช้อ่างว่างได้คุ้มค่า
        paddingHorizontal: 20,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        overflow: 'hidden',
    },
    linkText: {
        fontSize: 17,
        fontWeight: '600',
        color: '#1E293B',
        textAlign: 'center',
    },
    
});