import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Alert, ActivityIndicator, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { categoriaApi, produtoApi } from '../../api/api';
import { Categoria } from '../../models/CategoriaModel';
import { Produto } from '../../models/ProdutoModel';

export default function Produtos() {

    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formVisible, setFormVisible] = useState(false);
    const [dcProduto, setDcProduto] = useState('');
    const [vlProduto, setVlProduto] = useState('');
    const [idCategoria, setIdCategoria] = useState<number | null>(null);
    const [selectedProduto, setSelectedProduto] = useState<Produto | null>(null);
    const [pickerVisible, setPickerVisible] = useState(false);

    useEffect(() => {
        void loadData();
    }, [])

    async function loadData(): Promise<void> {
        setLoading(true);
        setError('');
        try {
            const [listaProdutos, listaCategorias] = await Promise.all([
                produtoApi.getAll(),
                categoriaApi.getAll(),
            ]);
            setProdutos(listaProdutos);
            setCategorias(listaCategorias);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao carregar produtos.');
        } finally {
            setLoading(false);
        }
    }

    function getCategoriaNome(id_categoria: number): string {
        const categoria = categorias.find((c) => c.id_categoria === id_categoria);
        return categoria ? categoria.dc_categoria : 'Sem categoria';
    }

    async function salvar(): Promise<void> {
        setError('');
        try {
            const valor = Number(vlProduto.replace(',', '.'));
            if (!idCategoria) {
                throw new Error('Selecione uma categoria.');
            }
            const produto = new Produto(dcProduto, valor, idCategoria, selectedProduto?.id_produto ?? 0);
            if (selectedProduto) {
                await produtoApi.update(produto);
            } else {
                await produtoApi.create(produto);
            }
            closeForm();
            await loadData();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao salvar produto.');
        }
    }

    function confirmarExclusao(item: Produto): void {
        Alert.alert(
            'Excluir produto',
            `Deseja excluir o produto "${item.dc_produto}"?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: async () => {
                        setError('');
                        try {
                            await produtoApi.remove(item.id_produto);
                            await loadData();
                        } catch (err) {
                            setError(err instanceof Error ? err.message : 'Erro ao excluir produto.');
                        }
                    },
                },
            ],
        );
    }

    function openCreate(): void {
        setSelectedProduto(null);
        setDcProduto('');
        setVlProduto('');
        setIdCategoria(null);
        setFormVisible(true);
    }
    function openEdit(item: Produto): void {
        setSelectedProduto(item);
        setDcProduto(item.dc_produto);
        setVlProduto(String(item.vl_produto));
        setIdCategoria(item.id_categoria);
        setFormVisible(true);
    }
    function closeForm(): void {
        setSelectedProduto(null);
        setDcProduto('');
        setVlProduto('');
        setIdCategoria(null);
        setFormVisible(false);
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Cabeçalho só com título e badge de contagem */}
            <View style={styles.header}>
                <Text style={styles.titleScreen}>Produtos</Text>
                <Text style={styles.countBadge}>{produtos.length}</Text>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {/* Formulário inline */}
            {formVisible && (
                <View style={styles.formCard}>
                    <Text style={styles.modalTitle}>
                        {selectedProduto ? 'Editar Produto' : 'Novo Produto'}
                    </Text>

                    <TextInput
                        placeholder="Nome do produto"
                        placeholderTextColor="#a78bfa"
                        value={dcProduto}
                        onChangeText={setDcProduto}
                        style={styles.input}
                    />

                    <TextInput
                        placeholder="Valor (ex: 99.90)"
                        placeholderTextColor="#a78bfa"
                        value={vlProduto}
                        onChangeText={setVlProduto}
                        keyboardType="decimal-pad"
                        style={styles.input}
                    />

                    <TouchableOpacity style={styles.pickerButton} onPress={() => setPickerVisible(true)}>
                        <Text style={idCategoria ? styles.pickerValueText : styles.pickerPlaceholderText}>
                            {idCategoria ? getCategoriaNome(idCategoria) : 'Selecione uma categoria'}
                        </Text>
                        <Text style={styles.pickerArrow}>▾</Text>
                    </TouchableOpacity>

                    {/* Salvar: botão cheio largo */}
                    <TouchableOpacity style={styles.saveButton} onPress={salvar}>
                        <Text style={styles.saveButtonText}>Salvar</Text>
                    </TouchableOpacity>

                    {/* Cancelar: link de texto centralizado */}
                    <TouchableOpacity style={styles.cancelLink} onPress={closeForm}>
                        <Text style={styles.cancelLinkText}>Cancelar</Text>
                    </TouchableOpacity>
                </View>
            )}

            {loading ? (
                <ActivityIndicator style={styles.loading} size="large" color="#7c3aed" />
            ) : (
                <FlatList
                    data={produtos}
                    keyExtractor={(item) => String(item.id_produto)}
                    contentContainerStyle={styles.listContent}
                    onRefresh={loadData}
                    refreshing={loading}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>Nenhum produto cadastrado.</Text>
                    }
                    renderItem={({ item }) => (
                        /* Card: info à esquerda, botões em coluna à direita */
                        <View style={styles.card}>
                            <View style={styles.cardInfo}>
                                <Text style={styles.cardNome}>{item.dc_produto}</Text>
                                <Text style={styles.cardCategoria}>{getCategoriaNome(item.id_categoria)}</Text>
                                <Text style={styles.cardPreco}>
                                    R$ {item.vl_produto.toFixed(2).replace('.', ',')}
                                </Text>
                            </View>

                            <View style={styles.cardActions}>
                                <TouchableOpacity style={styles.buttonEdit} onPress={() => openEdit(item)}>
                                    <Text style={styles.buttonEditText}>Editar</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.buttonDelete} onPress={() => confirmarExclusao(item)}>
                                    <Text style={styles.buttonDeleteText}>Excluir</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />
            )}

            {/* FAB flutuante no canto inferior direito */}
            {!formVisible && (
                <TouchableOpacity style={styles.fab} onPress={openCreate}>
                    <Text style={styles.fabText}>+</Text>
                </TouchableOpacity>
            )}

            {/* Modal picker de categorias */}
            <Modal
                visible={pickerVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setPickerVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Selecione a categoria</Text>

                        <FlatList
                            data={categorias}
                            keyExtractor={(item) => String(item.id_categoria)}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.optionItem}
                                    onPress={() => {
                                        setIdCategoria(item.id_categoria);
                                        setPickerVisible(false);
                                    }}
                                >
                                    <Text style={styles.optionText}>{item.dc_categoria}</Text>
                                </TouchableOpacity>
                            )}
                            ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma categoria cadastrada.</Text>}
                        />

                        <TouchableOpacity style={styles.saveButton} onPress={() => setPickerVisible(false)}>
                            <Text style={styles.saveButtonText}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#faf5ff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 12,
    },
    titleScreen: {
        fontSize: 26,
        fontWeight: '800',
        color: '#4c1d95',
    },
    countBadge: {
        backgroundColor: '#7c3aed',
        color: '#fff',
        fontSize: 13,
        fontWeight: '700',
        borderRadius: 20,
        paddingHorizontal: 9,
        paddingVertical: 2,
        overflow: 'hidden',
    },
    errorText: {
        color: '#dc2626',
        paddingHorizontal: 16,
        marginBottom: 8,
    },
    emptyText: {
        textAlign: 'center',
        color: '#a78bfa',
        marginTop: 48,
        fontSize: 15,
    },
    loading: {
        marginTop: 24,
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 96,
    },
    /* Card em linha: info esquerda + botões coluna direita */
    card: {
        backgroundColor: '#fff',
        borderRadius: 14,
        paddingVertical: 14,
        paddingLeft: 16,
        paddingRight: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ddd6fe',
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardInfo: {
        flex: 1,
        gap: 3,
    },
    cardNome: {
        fontSize: 16,
        fontWeight: '700',
        color: '#4c1d95',
    },
    cardCategoria: {
        fontSize: 12,
        color: '#a78bfa',
        fontWeight: '500',
    },
    cardPreco: {
        fontSize: 14,
        color: '#6d28d9',
        fontWeight: '700',
        marginTop: 2,
    },
    /* Botões em coluna no lado direito */
    cardActions: {
        flexDirection: 'column',
        gap: 6,
        alignItems: 'stretch',
        minWidth: 72,
    },
    buttonEdit: {
        backgroundColor: '#ede9fe',
        paddingHorizontal: 10,
        paddingVertical: 7,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonEditText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#6d28d9',
    },
    buttonDelete: {
        backgroundColor: '#fee2e2',
        paddingHorizontal: 10,
        paddingVertical: 7,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonDeleteText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#dc2626',
    },
    /* Formulário inline */
    formCard: {
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 18,
        marginHorizontal: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#ddd6fe',
    },
    modalTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#4c1d95',
        marginBottom: 14,
    },
    input: {
        height: 50,
        width: '100%',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#ddd6fe',
        borderRadius: 10,
        paddingHorizontal: 14,
        backgroundColor: '#faf5ff',
        color: '#111827',
        fontSize: 15,
    },
    pickerButton: {
        height: 50,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: '#ddd6fe',
        borderRadius: 10,
        paddingHorizontal: 14,
        backgroundColor: '#faf5ff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    pickerPlaceholderText: {
        color: '#a78bfa',
        fontSize: 15,
    },
    pickerValueText: {
        color: '#111827',
        fontSize: 15,
    },
    pickerArrow: {
        color: '#7c3aed',
        fontSize: 18,
    },
    /* Salvar: botão cheio largo */
    saveButton: {
        backgroundColor: '#7c3aed',
        borderRadius: 10,
        paddingVertical: 14,
        alignItems: 'center',
        marginBottom: 10,
    },
    saveButtonText: {
        color: '#ffffff',
        fontWeight: '700',
        fontSize: 15,
    },
    /* Cancelar: link de texto centralizado */
    cancelLink: {
        alignItems: 'center',
        paddingVertical: 4,
    },
    cancelLinkText: {
        color: '#7c3aed',
        fontSize: 14,
        fontWeight: '600',
    },
    /* FAB */
    fab: {
        position: 'absolute',
        bottom: 28,
        right: 24,
        width: 58,
        height: 58,
        borderRadius: 29,
        backgroundColor: '#7c3aed',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#7c3aed',
        shadowOpacity: 0.4,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 8,
    },
    fabText: {
        color: '#fff',
        fontSize: 30,
        lineHeight: 34,
        fontWeight: '300',
    },
    /* Modal picker */
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: '#faf5ff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 20,
        maxHeight: '70%',
    },
    optionItem: {
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd6fe',
    },
    optionText: {
        fontSize: 16,
        color: '#4c1d95',
    },
});
