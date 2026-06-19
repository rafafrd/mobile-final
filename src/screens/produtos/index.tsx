import { useLayoutEffect, useState } from "react";
import { Alert, FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View,} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../App";

type Props = NativeStackScreenProps<RootStackParamList, "Produtos">;
type Categoria = { id: number; nome: string };
type Produto = { id: number; nome: string; preco: string; categoriaId: number };

// Categorias de exemplo - SQLite vai ser implementado (mesma tabela da tela categorias)
const categoriasMock: Categoria[] = [
  { id: 1, nome: "Eletrônicos" },
  { id: 2, nome: "Roupas" },
  { id: 3, nome: "Alimentos" },
];

// será substituído pelo SQLite
const dadosIniciais: Produto[] = [
  { id: 1, nome: "Notebook", preco: "3500.00", categoriaId: 1 },
  { id: 2, nome: "Camiseta", preco: "49.90", categoriaId: 2 },
  { id: 3, nome: "Arroz 5kg", preco: "25.00", categoriaId: 3 },
  { id: 4, nome: "Feijão com farinha", preco: "67.00", categoriaId: 3 },
];

export default function Produtos({ navigation }: Props) {
  const [data, setData] = useState<Produto[]>(dadosIniciais);
  const [categorias] = useState<Categoria[]>(categoriasMock);

  // Estado do modal principal (criar/editar)
  const [modalVisivel, setModalVisivel] = useState(false); //esconde o modal

  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [nomeInput, setNomeInput] = useState("");
  const [precoInput, setPrecoInput] = useState("");
  const [categoriaSelecionada, setCategoriaSelecionada] =
    useState<Categoria | null>(null);

  // Estado do modal do dropdown de categorias
  const [dropdownVisivel, setDropdownVisivel] = useState(false); //esconde o dropdown

  // add botao +
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          style={styles.headerBtn}
          onPress={() => {
            setEditandoId(null);
            setNomeInput("");
            setPrecoInput("");
            setCategoriaSelecionada(null);
            setModalVisivel(true);
          }}
        >
          <Text style={styles.headerBtnTexto}>novo</Text>
        </Pressable>
      ),
    });
  }, [navigation]);

  // Retorna o nome da categoria pelo id, find faz isso
  function nomeCategoria(id: number): string {
    return categorias.find((c) => c.id === id)?.nome ?? "—"; // c n achar retorna "-"
  }

  // Abre modal
  function abrirEditar(item: Produto) {
    setEditandoId(item.id);
    setNomeInput(item.nome);
    setPrecoInput(item.preco);
    setCategoriaSelecionada(
      categorias.find((c) => c.id === item.categoriaId) ?? null // ternario para garantir que seja categoria válida
    );
    setModalVisivel(true);
  }

  // Cria ou atualiza o produto conforme editandoId
  function salvar() {
    if (!nomeInput.trim() || !precoInput.trim() || !categoriaSelecionada)
      return;

    if (editandoId !== null) {
      // Atualiza existente
      setData((prev) =>
        prev.map((p) =>
          p.id === editandoId
            ? {
                ...p,
                nome: nomeInput.trim(),
                preco: precoInput.trim(),
                categoriaId: categoriaSelecionada.id,
              }
            : p
        )
      );
    } else {
      // Insere novo com id único
      setData((prev) => [
        ...prev,
        {
          id: Date.now(),
          nome: nomeInput.trim(),
          preco: precoInput.trim(),
          categoriaId: categoriaSelecionada.id,
        },
      ]);
    }

    setModalVisivel(false);
  }

  // Confirma e remove o produto
  function excluir(id: number) {
    Alert.alert("Excluir produto", "Tem certeza?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: () => setData((prev) => prev.filter((p) => p.id !== id)), //aqui ao clicar no excluir, ele filtra a lista removendo o item com o id q bater
      },
    ]);
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={
          <Text style={styles.vazio}>Nenhum produto cadastrado.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.item}>
            {/* Info do produto */}
            <View style={styles.itemInfo}>
              <Text style={styles.itemNome}>{item.nome}</Text>
              <Text style={styles.itemDetalhe}>
                R$ {item.preco} • {nomeCategoria(item.categoriaId)}
              </Text>
            </View>

            {/* Botões de ação */}
            <View style={styles.acoes}>
              <Pressable
                style={styles.btnEditar}
                onPress={() => abrirEditar(item)}
              >
                <Text style={styles.btnTexto}>Editar</Text>
              </Pressable>

              <Pressable
                style={styles.btnExcluir}
                onPress={() => excluir(item.id)}
              >
                <Text style={styles.btnTexto}>Excluir</Text>
              </Pressable>
            </View>
          </View>
        )}
      />

      {/* Modal de criar / editar produto */}
      <Modal visible={modalVisivel} transparent animationType="slide">
        <View style={styles.modalFundo}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitulo}> 
              {editandoId !== null ? "Editar Produto" : "Novo Produto"}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Nome do produto"
              value={nomeInput}
              onChangeText={setNomeInput}
            />

            <TextInput
              style={styles.input}
              placeholder="Preço (ex: 29.90)"
              value={precoInput}
              onChangeText={setPrecoInput}
              keyboardType="decimal-pad"
            />

            {/* Dropdown básico - abre modal para escolher categoria */}
            <Pressable
              style={styles.dropdown}
              onPress={() => setDropdownVisivel(true)}
            >
              <Text
                style={
                  categoriaSelecionada //ternario entre estilos
                    ? styles.dropdownTexto
                    : styles.dropdownPlaceholder
                }
              >
                {categoriaSelecionada
                  ? categoriaSelecionada.nome
                  : "Selecionar categoria"}
              </Text>
              <Text style={styles.dropdownSeta}>▼</Text>
            </Pressable>

            <Pressable style={styles.btnSalvar} onPress={salvar}>
              <Text style={styles.btnTexto}>Salvar</Text>
            </Pressable>

            <Pressable
              style={styles.btnCancelar}
              onPress={() => setModalVisivel(false)}
            >
              <Text style={styles.btnCancelarTexto}>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Modal do dropdown de categorias */}
      <Modal visible={dropdownVisivel} transparent animationType="fade">
        <Pressable
          style={styles.modalFundo}
          onPress={() => setDropdownVisivel(false)}
        >
          <View style={styles.dropdownBox}>
            <Text style={styles.modalTitulo}>Selecionar Categoria</Text>

            {categorias.map((cat) => (
              <Pressable
                key={cat.id}
                style={styles.dropdownItem}
                onPress={() => {
                  setCategoriaSelecionada(cat);
                  setDropdownVisivel(false);
                }}
              >
                <Text style={styles.dropdownItemTexto}>{cat.nome}</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  lista: {
    padding: 16,
    gap: 10,
  },

  // Cada item da lista
  item: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  itemInfo: {
    flex: 1,
    marginRight: 10,
  },
  itemNome: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
  },
  itemDetalhe: {
    fontSize: 13,
    color: "#64748b",
    marginTop: 2,
  },
  acoes: {
    flexDirection: "row",
    gap: 8,
  },
  btnEditar: {
    backgroundColor: "#f59e0b",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  btnExcluir: {
    backgroundColor: "#ef4444",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  btnTexto: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },
  vazio: {
    textAlign: "center",
    color: "#94a3b8",
    marginTop: 40,
    fontSize: 15,
  },

  // Botão no header
  headerBtn: {
    marginRight: 4,
    backgroundColor: "#3b82f6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  headerBtnTexto: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },

  // Modal principal
  modalFundo: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 24,
  },
  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 24,
    gap: 12,
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: "#0f172a",
    backgroundColor: "#f8fafc",
  },

  // Dropdown de categoria
  dropdown: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#f8fafc",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownTexto: {
    fontSize: 15,
    color: "#0f172a",
  },
  dropdownPlaceholder: {
    fontSize: 15,
    color: "#94a3b8",
  },
  dropdownSeta: {
    color: "#64748b",
    fontSize: 12,
  },

  // Modal do dropdown
  dropdownBox: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 20,
    gap: 4,
    margin: 24,
  },
  dropdownItem: {
    padding: 14,
    borderRadius: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  dropdownItemTexto: {
    fontSize: 16,
    color: "#0f172a",
  },

  // Botões do modal
  btnSalvar: {
    backgroundColor: "#0f172a",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 4,
  },
  btnCancelar: {
    alignItems: "center",
    padding: 10,
  },
  btnCancelarTexto: {
    color: "#64748b",
    fontSize: 14,
  },
});
