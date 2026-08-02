import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function Layout() {
    return (
        <Tabs screenOptions={{
                tabBarActiveTintColor: '#22D3EE',
                tabBarInactiveTintColor: '#64748B',
                tabBarStyle: {
                    backgroundColor: '#0F1729',
                    borderTopColor: '#1E293B',
                    borderTopWidth: 1,
                    paddingTop: 4,
                    height: 60,
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '600',
                    letterSpacing: 0.3,
                },
                headerStyle: {
                    backgroundColor: '#0F1729',
                    shadowColor: '#000',
                    elevation: 8,
                },
                headerTintColor: '#F1F5F9',
                headerTitleStyle: {
                    fontWeight: '700',
                    fontSize: 18,
                    letterSpacing: 0.3,
                },
            }}>
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