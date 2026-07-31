import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { Button, Text, View } from "react-native";

function Dashboard() {
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);

    const onChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || date;
        setShow(false);
        setDate(currentDate);
    };

    const showDatepicker = () => {
        setShow(true);
    };

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 20, marginBottom: 20 }}>Dashboard</Text>

            <Button onPress={showDatepicker} title="เลือกวันที่" />

            <Text style={{ marginTop: 10 }}>
                วันที่เลือก: {date.toLocaleDateString('th-TH')}
            </Text>

            {show && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode="date"
                    is24Hour={true}
                    display="default"
                    onChange={onChange}
                />
            )}
        </View>
    );
}

export default Dashboard;