import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../App";

type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function Home() {
    const navigation = useNavigation<NavigationProps>();

    return (
        <SafeAreaView style={styles.container}>
            {/* Banner superior com fundo roxo */}
            <View style={styles.banner}>
                <Text style={styles.bannerLabel}>SENAI · Mobile</Text>
                <Text style={styles.bannerTitle}>Gestão de{'\n'}Estoque</Text>
            </View>

            {/* Cartões de navegação */}
            <View style={styles.cardsContainer}>
                <TouchableOpacity
                    style={styles.card}
                    onPress={() => navigation.navigate('Categorias')}
                    activeOpacity={0.85}
                >
                    <View style={styles.cardIcon}>
                        <Text style={styles.cardIconText}>🗂</Text>
                    </View>
                    <View style={styles.cardTextGroup}>
                        <Text style={styles.cardTitle}>Categorias</Text>
                        <Text style={styles.cardSubtitle}>Criar, editar e excluir</Text>
                    </View>
                    <Text style={styles.cardArrow}>›</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.card}
                    onPress={() => navigation.navigate('Produtos')}
                    activeOpacity={0.85}
                >
                    <View style={styles.cardIcon}>
                        <Text style={styles.cardIconText}>📦</Text>
                    </View>
                    <View style={styles.cardTextGroup}>
                        <Text style={styles.cardTitle}>Produtos</Text>
                        <Text style={styles.cardSubtitle}>Criar, editar e excluir</Text>
                    </View>
                    <Text style={styles.cardArrow}>›</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#faf5ff',
    },
    /* Banner roxo no topo */
    banner: {
        backgroundColor: '#7c3aed',
        paddingHorizontal: 24,
        paddingTop: 36,
        paddingBottom: 40,
        borderBottomLeftRadius: 28,
        borderBottomRightRadius: 28,
    },
    bannerLabel: {
        color: '#c4b5fd',
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 1.5,
        textTransform: 'uppercase',
        marginBottom: 8,
    },
    bannerTitle: {
        color: '#ffffff',
        fontSize: 34,
        fontWeight: '800',
        lineHeight: 40,
    },
    /* Cartões de navegação */
    cardsContainer: {
        padding: 20,
        gap: 12,
        marginTop: 8,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        paddingVertical: 18,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd6fe',
        gap: 14,
        shadowColor: '#7c3aed',
        shadowOpacity: 0.08,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 3,
    },
    cardIcon: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: '#ede9fe',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardIconText: {
        fontSize: 22,
    },
    cardTextGroup: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#4c1d95',
    },
    cardSubtitle: {
        fontSize: 13,
        color: '#a78bfa',
        marginTop: 2,
    },
    cardArrow: {
        fontSize: 26,
        color: '#7c3aed',
        fontWeight: '300',
    },
});
