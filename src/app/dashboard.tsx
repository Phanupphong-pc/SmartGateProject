import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
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
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>Dashboard</Text>
                    <Text style={styles.date}>{formatDate(selectedDate)}</Text>
                </View>
                <View style={styles.calendarBox}>
                    <TouchableOpacity onPress={() => setShowPicker(true)}>
                        <Ionicons name="calendar" size={28} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.todayBtn}
                        onPress={() => setSelectedDate(new Date())}>
                        <Text style={styles.todayText}>Today</Text> </TouchableOpacity>
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
            <View style={styles.infoCard}>
                <Text style={styles.cardTitle}>สมาชิกที่ลงทะเบียนแล้ว</Text>
                <View style={styles.cardRow}>
                    <Text style={styles.cardNumber}>{checked}</Text>
                    <Text style={styles.cardTitle2}>คน</Text>
                </View>
            </View>
            <View style={[styles.infoCard2, { marginTop: 10 }]}>
                <Text style={styles.cardTitle}>สมาชิกที่ยังไม่ได้ลงทะเบียน</Text>
                <View style={styles.cardRow}>
                    <Text style={styles.cardNumber}>{pending}</Text>
                    <Text style={styles.cardTitle2}>คน</Text>
                </View>
            </View>
            {!searchMode ? (
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tab, tab == "All" && styles.activeTab]}
                        onPress={() => setTab("All")}>
                        <Text style={[styles.tabText, tab == "All" && styles.activeText]}>
                            All Member
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
                        <Ionicons name="search" size={22} color="black" />
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.searchBar}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="ค้นหา รหัส ชื่อ นามสกุล ชื่อเล่น แผนก"
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
                        <Ionicons name="close" size={28} color="red" />
                    </TouchableOpacity>
                </View>
            )}
            {searchMode ? (
                <FlatList
                    data={searchResult}
                    keyExtractor={(item) => item.employee_id}
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
                                                `https://ui-avatars.com/api/?name=${item.firstname}+${item.lastname}`
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
                                </View>
                                {openMember == item.employee_id && (
                                    <View style={styles.detailBox}>
                                        <Text>รหัสบัตรพนักงาน : {item.card_uid}</Text>
                                        <Text>รหัสพนักงาน : {item.employee_id}</Text>
                                        <Text>ชื่อเล่น : {item.nickname}</Text>
                                        <Text>ตำแหน่ง : {item.department}</Text>
                                        <Text>เบอร์โทร : {item.phone}</Text>
                                        <Text>สถานะ : {item.status}</Text>
                                        <TouchableOpacity
                                            style={styles.historyBtn}
                                            onPress={() => {
                                                loadHistory(item.employee_id);
                                                setShowHistory(!showHistory);
                                            }}>
                                            <Text style={styles.historyText}>ประวัติการเช็คชื่อ</Text>
                                        </TouchableOpacity>
                                        {showHistory &&
                                            history.map((h: any, index: number) => (
                                                <Text key={index} style={styles.historyItem}>
                                                    {h.scan_time}
                                                </Text>
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
                            onRefresh={onRefresh} />}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    renderItem={({ item }) => (
                        <View style={styles.memberCard}>
                            <Image
                                source={{
                                    uri: item.image == "" ?
                                        `https://ui-avatars.com/api/?name=${item.firstname}+${item.lastname}`
                                        : item.image
                                }} style={styles.avatar} />
                            <View style={styles.memberInfo}>
                                <Text style={styles.name}>{item.firstname} {item.lastname}</Text>
                                <Text style={styles.department}>Department : {item.department}</Text>
                                <Text style={[styles.status, {
                                    color: item.status == "Checked"
                                        ? "#16A34A"
                                        : "#EF4444"
                                }]}>
                                    {item.status == "Checked"
                                        ? item.last_scan
                                        : "Pending"}
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
        backgroundColor: "#F5F6FA",
        padding: 15,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
    },
    calendarBox: {
        alignItems: "center",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#222",
    },
    date: {
        marginTop: 5,
        fontSize: 14,
        color: "#666",
    },
    todayBtn: {
        marginTop: 8,
        backgroundColor: "#000",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    todayText: {
        color: "#fff",
        fontSize: 13,
        fontWeight: "bold",
    },
    infoCard: {
        backgroundColor: "#007bffff",
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingTop: 15,
        paddingBottom: 5
    },
    infoCard2: {
        backgroundColor: "#ff0000ff",
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingTop: 15,
        paddingBottom: 5
    },
    cardTitle: {
        color: "#ffffffff",
        fontSize: 20,
        fontWeight: "600",
    },
    cardNumber: {
        color: "#fff",
        fontSize: 50,
        fontWeight: "bold",
        marginLeft: 5
    },
    cardTitle2: {
        color: "#ffffffff",
        fontSize: 30,
        fontWeight: "600",
        marginTop: 10,
    },
    cardRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    tabContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        marginVertical: 18,
    },
    tab: {
        paddingVertical: 8,
        paddingHorizontal: 15,
    },
    activeTab: {
        backgroundColor: "#000",
        borderRadius: 8,
    },
    tabText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#000",
    },
    activeText: {
        color: "#fff",
    },
    memberCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 12,
        marginBottom: 10,
        elevation: 2,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "#DDD",
        marginRight: 12,
    },
    memberInfo: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#222",
    },
    department: {
        fontSize: 13,
        color: "#777",
        marginTop: 2,
    },
    status: {
        marginTop: 4,
        fontSize: 12,
        fontWeight: "bold",
    },
    searchBtn: {
        marginLeft: 10,
        padding: 6,
    },
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 10,
        paddingHorizontal: 10,
        marginTop: 15,
        marginBottom: 15,
        elevation: 2,
    },
    searchInput: {
        flex: 1,
        height: 45,
    },
    detailBox: {
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderColor: "#ddd",
    },
    historyBtn: {
        backgroundColor: "#000",
        paddingVertical: 8,
        borderRadius: 8,
        marginTop: 10,
        marginBottom: 5,
    },
    historyText: {
        color: "#fff",
        textAlign: "center",
        fontWeight: "bold",
    },
    historyItem: {
        fontSize: 13,
        color: "#555",
        marginTop: 4,
    },
});