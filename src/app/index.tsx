import { Link } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View, } from 'react-native';


export default function App() {
  return (
    <View style={styles.safeview}>
      <ScrollView contentContainerStyle={styles.container}>

        {/* 1. ข้อความต้อนรับ */}
        <View style={styles.headerContainer}>
          <Text style={styles.welcomeTitle}>Welcome</Text>
          <Text style={styles.welcomeSubtitle}>ยินดีต้อนรับสู่ SmartGate</Text>
        </View>

        {/* 2. คำอธิบายแอปพลิเคชัน (ปรับคำให้ดูน่าเชื่อถือและมืออาชีพ) */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>
            แอปสำหรับดูข้อมูลการสแกนบัตร RFID ผ่านเครื่อง SmartGate พร้อมระบบจัดการและบันทึกข้อมูลสมาชิกที่ใช้งานง่ายและรวดเร็ว
          </Text>
        </View>

        {/* 3. เมนูนำทางแบบ Tab เรียงลงมา */}
        <View style={styles.menuContainer}>
          <Link href="/dashboard" style={styles.link}>
            Dashboard
          </Link>

          <Link href="/history" style={styles.link}>
            Add Member
          </Link>

          <Link href="/edit" style={styles.link}>
            Edit Data
          </Link>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeview: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    alignItems: 'center',
    paddingVertical: 50,
    paddingHorizontal: 24,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0F172A', // สีน้ำเงินเข้มเกือบดำ ให้ความรู้สึกมั่นคง
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
  },
  descriptionContainer: {
    width: '100%',
    paddingHorizontal: 8,
    marginBottom: 36,
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#64748B', // สีเทาสุภาพ อ่านง่าย
    textAlign: 'center',
  },
  menuContainer: {
    width: '100%',
    gap: 12, // เว้นระยะห่างระหว่าง Tab
  },
  link: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: '#1E40AF',           // สีน้ำเงินเข้มแบบ Enterprise
    backgroundColor: '#F8FAFC', // สีเทาอ่อนเรียบหรู
    width: '100%',
    paddingVertical: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',    // เส้นขอบบางๆ เพิ่มความประณีต
    overflow: 'hidden',
  },


});


