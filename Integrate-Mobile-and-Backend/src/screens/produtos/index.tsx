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
            <View style={styles.header}>
                <Text style={styles.titleScreen}>Gestão de produtos</Text>
                <TouchableOpacity style={styles.button} onPress={formVisible ? closeForm : openCreate}>
                    <Text style={styles.buttonText}>{formVisible ? 'Cancelar' : 'Novo +'}</Text>
                </TouchableOpacity>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {formVisible && (
                <View style={styles.formCard}>
                    <Text style={styles.modalTitle}>
                        {selectedProduto ? 'Editar Produto' : 'Novo Produto'}
                    </Text>

                    <TextInput
                        placeholder="Digite o nome do produto"
                        placeholderTextColor="#6b7280"
                        value={dcProduto}
                        onChangeText={setDcProduto}
                        style={styles.input}
                    />

                    <TextInput
                        placeholder="Digite o valor (ex: 99.90)"
                        placeholderTextColor="#6b7280"
                        value={vlProduto}
                        onChangeText={setVlProduto}
                        keyboardType="decimal-pad"
                        style={styles.input}
                    />

                    <TouchableOpacity style={styles.input} onPress={() => setPickerVisible(true)}>
                        <Text style={idCategoria ? styles.pickerValueText : styles.pickerPlaceholderText}>
                            {idCategoria ? getCategoriaNome(idCategoria) : 'Selecione uma categoria'}
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.formActions}>
                        <TouchableOpacity style={[styles.formButton, styles.cancelButton]} onPress={closeForm}>
                            <Text style={{ color: '#111827', fontWeight: '600' }}>Cancelar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.formButton, styles.saveButton]} onPress={salvar}>
                            <Text style={{ color: '#f9fafb', fontWeight: '600' }}>Salvar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {loading ? (
                <ActivityIndicator style={styles.loading} size="large" color="#111827" />
            ) : (
                <FlatList
                    data={produtos}
                    keyExtractor={(item) => String(item.id_produto)}
                    contentContainerStyle={styles.listContent}
                    onRefresh={loadData}
                    refreshing={loading}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Text style={styles.nomeProduto}>{item.dc_produto}</Text>

                            <View style={styles.infoContainer}>
                                <Text style={styles.label}>Categoria:</Text>
                                <Text style={styles.valueText}>{getCategoriaNome(item.id_categoria)}</Text>
                            </View>

                            <View style={styles.infoContainer}>
                                <Text style={styles.label}>Valor:</Text>
                                <Text style={styles.valueText}>R$ {item.vl_produto.toFixed(2).replace('.', ',')}</Text>
                            </View>

                            <View style={styles.acoesContainer}>
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
                            ListEmptyComponent={<Text style={styles.label}>Nenhuma categoria cadastrada.</Text>}
                        />

                        <TouchableOpacity style={[styles.formButton, styles.cancelButton]} onPress={() => setPickerVisible(false)}>
                            <Text style={{ color: '#111827', fontWeight: '600' }}>Fechar</Text>
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
        backgroundColor: '#f8fafc',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    titleScreen: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
    },
    button: {
        backgroundColor: '#111827',
        minWidth: 110,
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        paddingHorizontal: 14,
    },
    buttonText: {
        color: '#f9fafb',
        fontSize: 14,
        textAlign: 'center',
        fontWeight: '600',
    },
    errorText: {
        color: '#dc2626',
        paddingHorizontal: 16,
        marginBottom: 8,
    },
    loading: {
        marginTop: 24,
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 24,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    nomeProduto: {
        fontSize: 17,
        fontWeight: '600',
        marginBottom: 8,
        color: '#111827',
    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
        gap: 6,
    },
    label: {
        color: '#6b7280',
        fontSize: 14,
    },
    valueText: {
        color: '#111827',
        fontSize: 14,
        fontWeight: '500',
    },
    acoesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        justifyContent: 'flex-end',
        marginTop: 10,
    },
    buttonEdit: {
        backgroundColor: '#f3f4f6',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    buttonEditText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },
    buttonDelete: {
        backgroundColor: '#f3f4f6',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    buttonDeleteText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },
    formCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 12,
    },
    input: {
        height: 52,
        width: '100%',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 10,
        paddingHorizontal: 12,
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        color: '#111827',
    },
    pickerPlaceholderText: {
        color: '#6b7280',
        fontSize: 15,
    },
    pickerValueText: {
        color: '#111827',
        fontSize: 15,
    },
    formActions: {
        flexDirection: 'row',
        gap: 12,
    },
    formButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#d1d5db',
    },
    saveButton: {
        backgroundColor: '#111827',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: '#f8fafc',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 20,
        maxHeight: '70%',
    },
    optionItem: {
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    optionText: {
        fontSize: 16,
        color: '#111827',
    },
});
