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
            <View style={styles.header}>
                <Text style={styles.titleScreen}>Gestão de categorias</Text>
                <TouchableOpacity style={styles.button} onPress={formVisible ? closeForm : openCreate}>
                    <Text style={styles.buttonText}>{formVisible ? 'Cancelar' : 'Novo +'}</Text>
                </TouchableOpacity>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {formVisible && (
                <View style={styles.formCard}>
                    <Text style={styles.modalTitle}>
                        {selectedCategoria ? 'Editar Categoria' : 'Nova Categoria'}
                    </Text>

                    <TextInput
                        placeholder="Digite o nome da categoria"
                        placeholderTextColor="#6b7280"
                        value={nomeCategoria}
                        onChangeText={setNomeCategoria}
                        style={styles.input}
                    />

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
                    data={categorias}
                    keyExtractor={(item) => String(item.id_categoria)}
                    contentContainerStyle={styles.listContent}
                    onRefresh={loadData}
                    refreshing={loading}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Text style={styles.nomeProduto}>{item.dc_categoria}</Text>
                            <View style={styles.infoContainer}>
                                <Text style={styles.label}>ID:</Text>
                                <Text style={styles.valueText}>{item.id_categoria}</Text>
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
        marginBottom: 12,
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
        backgroundColor: '#ffffff',
        color: '#111827',
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
});
