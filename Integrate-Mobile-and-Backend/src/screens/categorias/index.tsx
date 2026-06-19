import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { categoriaApi } from '../../api/api';
import { Categoria } from '../../models/CategoriaModel';

export default function CategoriaScreen() {

    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formVisible, setFormVisible] = useState(false);
    const [nomeCategoria, setNomeCategoria] = useState('');
    const [selectedCategoria, setSelectedCategoria] = useState<Categoria | null>(null);

    useEffect(() => {
        void loadData();
    }, [])

    async function loadData(): Promise<void> {
        setLoading(true);
        setError('');
        try {
            const lista = await categoriaApi.getAll();
            setCategorias(lista);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao carregar categorias.');
        } finally {
            setLoading(false);
        }
    }

    async function salvar(): Promise<void> {
        setError('');
        try {
            const categoria = new Categoria(nomeCategoria, selectedCategoria?.id_categoria ?? 0);
            if (selectedCategoria) {
                await categoriaApi.update(categoria);
            } else {
                await categoriaApi.create(categoria);
            }
            closeForm();
            await loadData();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao salvar categoria.');
        }
    }

    function confirmarExclusao(item: Categoria): void {
        Alert.alert(
            'Excluir categoria',
            `Deseja excluir a categoria "${item.dc_categoria}"?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: async () => {
                        setError('');
                        try {
                            await categoriaApi.remove(item.id_categoria);
                            await loadData();
                        } catch (err) {
                            setError(err instanceof Error ? err.message : 'Erro ao excluir categoria.');
                        }
                    },
                },
            ],
        );
    }

    function openCreate(): void {
        setSelectedCategoria(null);
        setNomeCategoria('');
        setFormVisible(true);
    }
    function openEdit(item: Categoria): void {
        setSelectedCategoria(item);
        setNomeCategoria(item.dc_categoria);
        setFormVisible(true);
    }
    function closeForm(): void {
        setSelectedCategoria(null);
        setNomeCategoria('');
        setFormVisible(false);
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Cabeçalho só com título */}
            <View style={styles.header}>
                <Text style={styles.titleScreen}>Categorias</Text>
                <Text style={styles.countBadge}>{categorias.length}</Text>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {/* Formulário inline */}
            {formVisible && (
                <View style={styles.formCard}>
                    <Text style={styles.modalTitle}>
                        {selectedCategoria ? 'Editar Categoria' : 'Nova Categoria'}
                    </Text>

                    <TextInput
                        placeholder="Nome da categoria"
                        placeholderTextColor="#a78bfa"
                        value={nomeCategoria}
                        onChangeText={setNomeCategoria}
                        style={styles.input}
                    />

                    {/* Salvar empilhado, cancelar como link abaixo */}
                    <TouchableOpacity style={styles.saveButton} onPress={salvar}>
                        <Text style={styles.saveButtonText}>Salvar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.cancelLink} onPress={closeForm}>
                        <Text style={styles.cancelLinkText}>Cancelar</Text>
                    </TouchableOpacity>
                </View>
            )}

            {loading ? (
                <ActivityIndicator style={styles.loading} size="large" color="#7c3aed" />
            ) : (
                <FlatList
                    data={categorias}
                    keyExtractor={(item) => String(item.id_categoria)}
                    contentContainerStyle={styles.listContent}
                    onRefresh={loadData}
                    refreshing={loading}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>Nenhuma categoria cadastrada.</Text>
                    }
                    renderItem={({ item }) => (
                        /* Card: info à esquerda, botões em coluna à direita */
                        <View style={styles.card}>
                            <View style={styles.cardInfo}>
                                <Text style={styles.cardNome}>{item.dc_categoria}</Text>
                                <Text style={styles.cardId}>#{item.id_categoria}</Text>
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
    },
    cardNome: {
        fontSize: 16,
        fontWeight: '700',
        color: '#4c1d95',
        marginBottom: 4,
    },
    cardId: {
        fontSize: 12,
        color: '#a78bfa',
        fontWeight: '500',
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
        marginBottom: 14,
        borderWidth: 1,
        borderColor: '#ddd6fe',
        borderRadius: 10,
        paddingHorizontal: 14,
        backgroundColor: '#faf5ff',
        color: '#111827',
        fontSize: 15,
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
});
