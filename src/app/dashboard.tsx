import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { FlatList, Image, RefreshControl, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const BASE_URL = "http://10.79.230.211/SmartGate/api";

export default function Dashboard() {
    const [members, setMembers] = useState<any[]>([]);
    const [checked, setChecked] = useState(0);
    const [pending, setPending] = useState(0);
    const [tab, setTab] = useState("All");
    const [refreshing, setRefreshing] = useState(false);
    const [showPicker, setShowPicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());

    const [searchMode, setSearchMode] = useState(false);
    const [keyword, setKeyword] = useState("");
    const [searchResult, setSearchResult] = useState<any[]>([]);
    const [openMember, setOpenMember] = useState("");
    const [history, setHistory] = useState<any[]>([]);
    const [showHistory, setShowHistory] = useState(false);

    const formatDate = (date: Date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
    };
    const loadData = async () => {
        try {
            const response = await fetch(`${BASE_URL}/dashBMember.php?date=${formatDate(selectedDate)}`);
            const result = await response.json();

            if (result.status == "success") {
                setMembers(result.members);
                setChecked(result.checked);
                setPending(result.pending);
            }
        } catch { }
    };
    const searchMember = async (text: string) => {
        setKeyword(text);
        if (text == "") {
            setSearchResult([]);
            return;
        }
        try {
            const response = await fetch(`${BASE_URL}/searchMember.php?keyword=${encodeURIComponent(text)}`);
            const result = await response.json();
            if (result.status == "success") {
                setSearchResult(result.data);
            } else {
                setSearchResult([]);
            }
        } catch { }
    };
    const loadHistory = async (employee_id: string) => {
        try {
            const response = await fetch(`${BASE_URL}/memberHistory.php?employee_id=${employee_id}`);
            const result = await response.json();

            if (result.status == "success") {
                setHistory(result.data);
            } else {
                setHistory([]);
            }
        } catch { }
    };
    useEffect(() => {
        loadData();
    }, [selectedDate]);
    const onRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    };
    const filterMember = () => {
        if (tab == "Checked") {
            return members.filter((item: any) => item.status == "Checked");
        }
        if (tab == "Pending") {
            return members.filter((item: any) => item.status == "Pending");
        }
        return members;
    };
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>Dashboard</Text>
                    <Text style={styles.date}>{formatDate(selectedDate)}</Text>
                </View>
                <View style={styles.calendarBox}>
                    <TouchableOpacity style={styles.calendarBtn} onPress={() => setShowPicker(true)}>
                        <Ionicons name="calendar-outline" size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.todayBtn}
                        onPress={() => setSelectedDate(new Date())}>
                        <Text style={styles.todayText}>Today</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {showPicker && (
                <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display="default"
                    onChange={(event, date) => {
                        setShowPicker(false);
                        if (date) setSelectedDate(date);
                    }} />
            )}

            {/* Stats Cards */}
            <View style={styles.statsRow}>
                <LinearGradient
                    colors={['#059669', '#10B981']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.infoCard}
                >
                    <View style={styles.cardIconBox}>
                        <Ionicons name="checkmark-circle" size={22} color="#FFFFFF" />
                    </View>
                    <Text style={styles.cardNumber}>{checked}</Text>
                    <Text style={styles.cardLabel}>ลงทะเบียนแล้ว</Text>
                </LinearGradient>
                <View style={styles.infoCard2}>
                    <View style={[styles.cardIconBox, { backgroundColor: '#FFF7ED' }]}>
                        <Ionicons name="time" size={22} color="#F97316" />
                    </View>
                    <Text style={styles.cardNumber2}>{pending}</Text>
                    <Text style={styles.cardLabel2}>รอลงทะเบียน</Text>
                </View>
            </View>

            {/* Tabs / Search */}
            {!searchMode ? (
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tab, tab == "All" && styles.activeTab]}
                        onPress={() => setTab("All")}>
                        <Text style={[styles.tabText, tab == "All" && styles.activeText]}>
                            All
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, tab == "Checked" && styles.activeTab]}
                        onPress={() => setTab("Checked")}>
                        <Text style={[styles.tabText, tab == "Checked" && styles.activeText]}>
                            Checked
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, tab == "Pending" && styles.activeTab]}
                        onPress={() => setTab("Pending")}>
                        <Text style={[styles.tabText, tab == "Pending" && styles.activeText]}>
                            Pending
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.searchBtn}
                        onPress={() => setSearchMode(true)}>
                        <Ionicons name="search" size={20} color="#64748B" />
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color="#10B981" style={{ marginRight: 8 }} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="ค้นหา รหัส ชื่อ นามสกุล ชื่อเล่น แผนก"
                        placeholderTextColor="#94A3B8"
                        value={keyword}
                        onChangeText={searchMember}
                    />
                    <TouchableOpacity
                        onPress={() => {
                            setSearchMode(false);
                            setKeyword("");
                            setSearchResult([]);
                            setOpenMember("");
                            setHistory([]);
                        }}>
                        <View style={styles.closeBtn}>
                            <Ionicons name="close" size={18} color="#EF4444" />
                        </View>
                    </TouchableOpacity>
                </View>
            )}

            {/* Member List */}
            {searchMode ? (
                <FlatList
                    data={searchResult}
                    keyExtractor={(item) => item.employee_id}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    renderItem={({ item }) => (
                        <View style={styles.memberCard}>
                            <TouchableOpacity
                                style={{ flex: 1 }}
                                onPress={() => {
                                    if (openMember == item.employee_id) {
                                        setOpenMember("");
                                        setShowHistory(false);
                                    } else {
                                        setOpenMember(item.employee_id);
                                    }
                                }}>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Image
                                        source={{
                                            uri: item.image == "" ?
                                                `https://ui-avatars.com/api/?name=${item.firstname}+${item.lastname}&background=ECFDF5&color=059669`
                                                : item.image
                                        }}
                                        style={styles.avatar} />
                                    <View style={styles.memberInfo}>
                                        <Text style={styles.name}>
                                            {item.firstname} {item.lastname}
                                        </Text>
                                        <Text style={styles.department}>
                                            {item.department}
                                        </Text>
                                    </View>
                                    <Ionicons 
                                        name={openMember == item.employee_id ? "chevron-up" : "chevron-down"} 
                                        size={20} color="#94A3B8" />
                                </View>
                                {openMember == item.employee_id && (
                                    <View style={styles.detailBox}>
                                        <View style={styles.detailRow}>
                                            <Text style={styles.detailLabel}>รหัสบัตร</Text>
                                            <Text style={styles.detailValue}>{item.card_uid}</Text>
                                        </View>
                                        <View style={styles.detailRow}>
                                            <Text style={styles.detailLabel}>รหัสพนักงาน</Text>
                                            <Text style={styles.detailValue}>{item.employee_id}</Text>
                                        </View>
                                        <View style={styles.detailRow}>
                                            <Text style={styles.detailLabel}>ชื่อเล่น</Text>
                                            <Text style={styles.detailValue}>{item.nickname}</Text>
                                        </View>
                                        <View style={styles.detailRow}>
                                            <Text style={styles.detailLabel}>ตำแหน่ง</Text>
                                            <Text style={styles.detailValue}>{item.department}</Text>
                                        </View>
                                        <View style={styles.detailRow}>
                                            <Text style={styles.detailLabel}>เบอร์โทร</Text>
                                            <Text style={styles.detailValue}>{item.phone}</Text>
                                        </View>
                                        <View style={styles.detailRow}>
                                            <Text style={styles.detailLabel}>สถานะ</Text>
                                            <Text style={styles.detailValue}>{item.status}</Text>
                                        </View>
                                        <TouchableOpacity
                                            style={styles.historyBtn}
                                            onPress={() => {
                                                loadHistory(item.employee_id);
                                                setShowHistory(!showHistory);
                                            }}>
                                            <Ionicons name="time-outline" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                                            <Text style={styles.historyText}>ประวัติการเช็คชื่อ</Text>
                                        </TouchableOpacity>
                                        {showHistory &&
                                            history.map((h: any, index: number) => (
                                                <View key={index} style={styles.historyItemRow}>
                                                    <View style={styles.historyDot} />
                                                    <Text style={styles.historyItem}>
                                                        {h.scan_time}
                                                    </Text>
                                                </View>
                                            ))
                                        }
                                    </View>
                                )}</TouchableOpacity>
                        </View>)} />
            ) : (
                <FlatList
                    data={filterMember()}
                    keyExtractor={(item) => item.employee_id}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor="#10B981" />}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    renderItem={({ item }) => (
                        <View style={styles.memberCard}>
                            <Image
                                source={{
                                    uri: item.image == "" ?
                                        `https://ui-avatars.com/api/?name=${item.firstname}+${item.lastname}&background=ECFDF5&color=059669`
                                        : item.image
                                }} style={styles.avatar} />
                            <View style={styles.memberInfo}>
                                <Text style={styles.name}>{item.firstname} {item.lastname}</Text>
                                <Text style={styles.department}>Department : {item.department}</Text>
                                <Text style={[styles.status, {
                                    color: item.status == "Checked"
                                        ? "#10B981"
                                        : "#F97316"
                                }]}>
                                    {item.status == "Checked"
                                        ? `✓ ${item.last_scan}`
                                        : "● Pending"}
                                </Text>

                            </View>
                        </View>
                    )}
                />
            )}
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        paddingTop: 50,
        backgroundColor: "#FFFFFF",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    calendarBox: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    calendarBtn: {
        width: 42,
        height: 42,
        borderRadius: 14,
        backgroundColor: "#10B981",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: '#059669',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 6,
    },
    title: {
        fontSize: 30,
        fontWeight: "900",
        color: "#1E293B",
        letterSpacing: -0.5,
    },
    date: {
        marginTop: 4,
        fontSize: 14,
        color: "#64748B",
        fontWeight: "600",
    },
    todayBtn: {
        backgroundColor: "#10B981",
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 14,
        alignItems: "center",
        shadowColor: '#059669',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 6,
    },
    todayText: {
        color: "#FFFFFF",
        fontSize: 13,
        fontWeight: "800",
    },

    /* Stats Cards */
    statsRow: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 16,
    },
    infoCard: {
        flex: 1,
        borderRadius: 20,
        paddingHorizontal: 18,
        paddingVertical: 20,
        shadowColor: '#059669',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    infoCard2: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        paddingHorizontal: 18,
        paddingVertical: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    cardIconBox: {
        width: 42,
        height: 42,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    cardNumber: {
        color: "#FFFFFF",
        fontSize: 34,
        fontWeight: "900",
        letterSpacing: -1,
    },
    cardLabel: {
        color: "rgba(255,255,255,0.8)",
        fontSize: 13,
        fontWeight: "600",
        marginTop: 4,
    },
    cardNumber2: {
        color: "#1E293B",
        fontSize: 34,
        fontWeight: "900",
        letterSpacing: -1,
    },
    cardLabel2: {
        color: "#64748B",
        fontSize: 13,
        fontWeight: "600",
        marginTop: 4,
    },
    
    /* Tabs */
    tabContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
        backgroundColor: "#F8FAFC",
        borderRadius: 16,
        padding: 4,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 12,
        alignItems: "center",
    },
    activeTab: {
        backgroundColor: "#10B981",
        shadowColor: '#059669',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    tabText: {
        fontSize: 13,
        fontWeight: "700",
        color: "#94A3B8",
    },
    activeText: {
        color: "#FFFFFF",
    },

    /* Member Cards */
    memberCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 18,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: "#ECFDF5",
        marginRight: 14,
    },
    memberInfo: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: "700",
        color: "#1E293B",
    },
    department: {
        fontSize: 13,
        color: "#64748B",
        marginTop: 3,
    },
    status: {
        marginTop: 5,
        fontSize: 12,
        fontWeight: "800",
    },

    /* Search */
    searchBtn: {
        padding: 10,
        borderRadius: 12,
        backgroundColor: '#F1F5F9',
    },
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F8FAFC",
        borderRadius: 16,
        paddingHorizontal: 14,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    searchInput: {
        flex: 1,
        height: 50,
        color: "#1E293B",
        fontSize: 15,
    },
    closeBtn: {
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: '#FEF2F2',
        justifyContent: 'center',
        alignItems: 'center',
    },

    /* Detail Box */
    detailBox: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderColor: "#F1F5F9",
    },
    detailRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 5,
    },
    detailLabel: {
        fontSize: 13,
        color: "#94A3B8",
        fontWeight: "600",
    },
    detailValue: {
        fontSize: 13,
        color: "#1E293B",
        fontWeight: "700",
    },
    historyBtn: {
        flexDirection: "row",
        backgroundColor: "#10B981",
        paddingVertical: 11,
        borderRadius: 12,
        marginTop: 14,
        marginBottom: 5,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: '#059669',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 4,
    },
    historyText: {
        color: "#FFFFFF",
        textAlign: "center",
        fontWeight: "800",
        fontSize: 14,
    },
    historyItemRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 4,
    },
    historyDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: "#10B981",
        marginRight: 10,
    },
    historyItem: {
        fontSize: 13,
        color: "#64748B",
        fontWeight: '500',
    },
});