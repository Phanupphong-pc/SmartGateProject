import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function App() {
    return (
        <View style={styles.background}>
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                {/* Header Section */}
                <View style={styles.topSection}>
                    <LinearGradient colors={['#059669', '#10B981']} style={styles.iconCircle}>
                        <Ionicons name="shield-checkmark" size={42} color="#FFFFFF" />
                    </LinearGradient>
                    <View style={styles.headerContainer}>
                        <Text style={styles.welcomeTitle}>SmartGate</Text>
                        <Text style={styles.welcomeSubtitle}>ระบบจัดการข้อมูลสมาชิก</Text>
                    </View>
                    
                    <LinearGradient
                        colors={['#059669', '#10B981']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.descriptionCard}
                    >
                        <Text style={styles.descriptionText}>
                            แอปสำหรับดูข้อมูลการสแกนบัตร RFID ผ่านเครื่อง SmartGate พร้อมระบบจัดการที่ใช้งานง่าย สวยงาม และรวดเร็ว
                        </Text>
                    </LinearGradient>
                </View>

                {/* Menu Section */}
                <View style={styles.menuContainer}>
                    <Text style={styles.sectionHeader}>เมนูหลัก</Text>

                    <Link href="/dashboard" asChild>
                        <TouchableOpacity activeOpacity={0.7} style={styles.linkCard}>
                            <LinearGradient colors={['#059669', '#10B981']} style={styles.linkIconBox}>
                                <Ionicons name="grid" size={22} color="#FFFFFF" />
                            </LinearGradient>
                            <View style={styles.linkTextContainer}>
                                <Text style={styles.linkTitle}>Dashboard</Text>
                                <Text style={styles.linkDesc}>ดูข้อมูลการลงทะเบียนและสแกนบัตร</Text>
                            </View>
                            <View style={styles.chevronCircle}>
                                <Ionicons name="chevron-forward" size={16} color="#10B981" />
                            </View>
                        </TouchableOpacity>
                    </Link>

                    <Link href="/history" asChild>
                        <TouchableOpacity activeOpacity={0.7} style={styles.linkCard}>
                            <LinearGradient colors={['#059669', '#10B981']} style={styles.linkIconBox}>
                                <Ionicons name="person-add" size={22} color="#FFFFFF" />
                            </LinearGradient>
                            <View style={styles.linkTextContainer}>
                                <Text style={styles.linkTitle}>Add Member</Text>
                                <Text style={styles.linkDesc}>เพิ่มรายชื่อพนักงานและข้อมูลบัตรใหม่</Text>
                            </View>
                            <View style={styles.chevronCircle}>
                                <Ionicons name="chevron-forward" size={16} color="#10B981" />
                            </View>
                        </TouchableOpacity>
                    </Link>

                    <Link href="/edit" asChild>
                        <TouchableOpacity activeOpacity={0.7} style={styles.linkCard}>
                            <LinearGradient colors={['#059669', '#10B981']} style={styles.linkIconBox}>
                                <Ionicons name="create" size={22} color="#FFFFFF" />
                            </LinearGradient>
                            <View style={styles.linkTextContainer}>
                                <Text style={styles.linkTitle}>Edit Data</Text>
                                <Text style={styles.linkDesc}>แก้ไขหรือลบข้อมูลสมาชิกในระบบ</Text>
                            </View>
                            <View style={styles.chevronCircle}>
                                <Ionicons name="chevron-forward" size={16} color="#10B981" />
                            </View>
                        </TouchableOpacity>
                    </Link>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    background: { flex: 1, backgroundColor: '#FFFFFF' },
    container: {
        flexGrow: 1,
        justifyContent: 'space-between',
        paddingVertical: 60,
        paddingHorizontal: 20,
    },
    topSection: {
        alignItems: 'center',
        paddingTop: 20,
        marginBottom: 30,
    },
    iconCircle: {
        width: 90,
        height: 90,
        borderRadius: 45,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: '#059669',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 16,
        elevation: 12,
    },
    headerContainer: { alignItems: 'center', marginBottom: 24 },
    welcomeTitle: {
        fontSize: 38,
        fontWeight: '900',
        color: '#1E293B',
        letterSpacing: -0.5,
        marginBottom: 8,
    },
    welcomeSubtitle: { fontSize: 16, fontWeight: '600', color: '#10B981' },
    descriptionCard: {
        width: '100%',
        borderRadius: 22,
        padding: 22,
        shadowColor: '#059669',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 14,
        elevation: 8,
    },
    descriptionText: {
        fontSize: 15,
        lineHeight: 24,
        color: '#FFFFFF',
        textAlign: 'center',
        fontWeight: '500',
    },
    menuContainer: { width: '100%', gap: 14, paddingBottom: 20 },
    sectionHeader: {
        fontSize: 13,
        fontWeight: '800',
        color: '#94A3B8',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: 4,
        paddingLeft: 8,
    },
    linkCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    linkIconBox: {
        width: 48,
        height: 48,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    linkTextContainer: { flex: 1 },
    linkTitle: { fontSize: 16, fontWeight: '700', color: '#1E293B', marginBottom: 3 },
    linkDesc: { fontSize: 13, color: '#64748B' },
    chevronCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#ECFDF5',
        justifyContent: 'center',
        alignItems: 'center',
    },
});