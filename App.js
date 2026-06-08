import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  Modal,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { bookService } from './src/services/api';

export default function App() {
  const [books, setBooks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form states
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [status, setStatus] = useState('Quero ler');
  const [rating, setRating] = useState('');

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const response = await bookService.getAll();
      setBooks(response.data);
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível carregar os livros.');
    }
  };

  const handleSave = async () => {
    if (!title || !author || !genre) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
      return;
    }

    const data = {
      title,
      author,
      genre,
      status,
      rating: status === 'Lido' ? Number(rating) : null,
    };

    try {
      if (editingId) {
        await bookService.update(editingId, data);
      } else {
        await bookService.create(data);
      }
      closeModal();
      loadBooks();
    } catch (error) {
      Alert.alert('Erro', 'Erro ao salvar o livro.');
    }
  };

  const handleEdit = (book) => {
    setEditingId(book._id);
    setTitle(book.title);
    setAuthor(book.author);
    setGenre(book.genre);
    setStatus(book.status);
    setRating(book.rating ? String(book.rating) : '');
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    Alert.alert('Confirmar', 'Deseja excluir este livro?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        onPress: async () => {
          try {
            await bookService.delete(id);
            loadBooks();
          } catch (error) {
            Alert.alert('Erro', 'Erro ao excluir o livro.');
          }
        },
      },
    ]);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingId(null);
    setTitle('');
    setAuthor('');
    setGenre('');
    setStatus('Quero ler');
    setRating('');
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <Text style={styles.bookInfo}>Autor: {item.author}</Text>
        <Text style={styles.bookInfo}>Gênero: {item.genre}</Text>
        <Text style={styles.bookInfo}>Status: {item.status}</Text>
        {item.status === 'Lido' && (
          <Text style={styles.bookInfo}>Nota: {item.rating}/5</Text>
        )}
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => handleEdit(item)}
        >
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDelete(item._id)}
        >
          <Text style={styles.buttonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Minha Estante</Text>
      </View>

      <FlatList
        data={books}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum livro cadastrado.</Text>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide">
        <ScrollView style={styles.modalContainer}>
          <Text style={styles.modalTitle}>
            {editingId ? 'Editar Livro' : 'Novo Livro'}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Título"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={styles.input}
            placeholder="Autor"
            value={author}
            onChangeText={setAuthor}
          />
          <TextInput
            style={styles.input}
            placeholder="Gênero"
            value={genre}
            onChangeText={setGenre}
          />

          <Text style={styles.label}>Status:</Text>
          <View style={styles.pickerContainer}>
            {['Quero ler', 'Lendo', 'Lido'].map((s) => (
              <TouchableOpacity
                key={s}
                style={[
                  styles.statusOption,
                  status === s && styles.statusOptionActive,
                ]}
                onPress={() => setStatus(s)}
              >
                <Text style={status === s ? styles.statusTextActive : styles.statusText}>
                  {s}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {status === 'Lido' && (
            <TextInput
              style={styles.input}
              placeholder="Nota (0-5)"
              value={rating}
              onChangeText={setRating}
              keyboardType="numeric"
            />
          )}

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Salvar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </ScrollView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#6200ee',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  bookInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginLeft: 8,
  },
  editButton: {
    backgroundColor: '#03dac6',
  },
  deleteButton: {
    backgroundColor: '#ff5252',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#6200ee',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  fabText: {
    color: '#fff',
    fontSize: 24,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#999',
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statusOption: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    marginHorizontal: 4,
    borderRadius: 8,
  },
  statusOptionActive: {
    backgroundColor: '#6200ee',
    borderColor: '#6200ee',
  },
  statusText: {
    color: '#666',
  },
  statusTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#6200ee',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 40,
  },
  cancelButtonText: {
    color: '#ff5252',
    fontSize: 16,
  },
});
