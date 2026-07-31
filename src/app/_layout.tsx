import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function Layout() {
    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: '#18b54fff' }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => <Ionicons name="home"
                        size={24} color={color} />,

                }}
            />
            <Tabs.Screen
                name="dashboard"
                options={{
                    title: 'Dashboard',
                    tabBarIcon: ({ color }) => <Ionicons name="document-text"
                        size={24} color={color} />,

                }}
            />
            <Tabs.Screen
                name="history"
                options={{
                    title: 'History',
                    tabBarIcon: ({ color }) => <Ionicons name="search"
                        size={24} color={color} />,

                }}
            />
            <Tabs.Screen
                name="edit"
                options={{
                    title: 'Edit',
                    tabBarIcon: ({ color }) => <Ionicons name="footsteps"
                        size={24} color={color} />,

                }}
            />

        </Tabs>
    );
}