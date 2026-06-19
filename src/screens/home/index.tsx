import { Pressable, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../App";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function Home({ navigation }: Props) {
  return (
    <View style={styles.container}>
      {/* Bloco de texto */}
      <View style={styles.cabecalho}>
        <Text style={styles.titulo}>Bem-vindo!</Text>
        <Text style={styles.subtitulo}>
          Gerencie seus produtos e categorias de forma fácil e rápida.
        </Text>
      </View>

      {/* Botaos de navegação */}
      <View style={styles.botoes}>
        <Pressable
          style={styles.botao}
          onPress={() => navigation.navigate("Categorias")}
        >
          <Text style={styles.botaoTexto}>Categorias</Text>
        </Pressable>

        <Pressable
          style={[styles.botao, styles.botaoSecundario]}
          onPress={() => navigation.navigate("Produtos")}
        >
          <Text style={styles.botaoTexto}>Produtos</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    justifyContent: "center",
    padding: 24,
  },
  cabecalho: {
    marginBottom: 40,
    alignItems: "center",
  },
  titulo: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#0f172a",
  },
  subtitulo: {
    fontSize: 16,
    color: "#64748b",
    marginTop: 8,
    textAlign: "center",
  },
  botoes: {
    gap: 14,
  },
  botao: {
    backgroundColor: "#0f172a",
    padding: 16,
    borderRadius: 6,
    alignItems: "center",
  },
  botaoSecundario: {
    backgroundColor: "#3b82f6",
  },
  botaoTexto: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
