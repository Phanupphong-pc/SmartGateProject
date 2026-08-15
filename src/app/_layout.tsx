import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function Layout() {
    return (
        <Tabs screenOptions={{ 
            tabBarActiveTintColor: '#10B981', // Emerald Green
            tabBarInactiveTintColor: '#94A3B8', // Slate 400
            tabBarStyle: {
                backgroundColor: '#FFFFFF', // Pure White
                borderTopWidth: 1,
                borderTopColor: '#F1F5F9',
                elevation: 10,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -4 },
                shadowOpacity: 0.05,
                shadowRadius: 10,
                height: 65,
                paddingBottom: 8,
                paddingTop: 8,
            },
            headerShown: false,
        }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? "home" : "home-outline"} size={26} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="dashboard"
                options={{
                    title: 'Dashboard',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? "grid" : "grid-outline"} size={26} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="addData"
                options={{
                    title: 'Add',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? "person-add" : "person-add-outline"} size={26} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="edit"
                options={{
                    title: 'Edit',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? "create" : "create-outline"} size={26} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}