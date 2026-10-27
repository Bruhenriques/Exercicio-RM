import React, { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type Personagem = {
  id: number;
  name: string;
  status: string;
  species: string;
  image: string;
  origin: {
    name: string;
  };
};

export default function App() {
  const [personagens, setPersonagens] = useState<Personagem[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  async function buscarPersonagens() {
    try {
      setCarregando(true);
      setErro('');

      const resposta = await fetch(
        'https://rickandmortyapi.com/api/character'
      );

      if (!resposta.ok) {
        throw new Error('Não foi possível consultar a API.');
      }

      const dados = await resposta.json();

      setPersonagens(dados.results);
    } catch (error) {
      setErro(
        'Não foi possível carregar os personagens. Verifique sua conexão e tente novamente.'
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    buscarPersonagens();
  }, []);

  function traduzirStatus(status: string) {
    if (status === 'Alive') {
      return 'Vivo';
    }

    if (status === 'Dead') {
      return 'Morto';
    }

    return 'Desconhecido';
  }

  function corDoStatus(status: string) {
    if (status === 'Alive') {
      return '#25a866';
    }

    if (status === 'Dead') {
      return '#e25555';
    }

    return '#a3a3a3';
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.cabecalho}>
        <Text style={styles.titulo}>Rick and Morty</Text>

        <Text style={styles.subtitulo}>
          Conheça os personagens da série
        </Text>
      </View>

      {carregando ? (
        <View style={styles.centralizado}>
          <ActivityIndicator size="large" color="#75d85a" />

          <Text style={styles.mensagem}>
            Carregando personagens...
          </Text>
        </View>
      ) : erro ? (
        <View style={styles.centralizado}>
          <Text style={styles.mensagemErro}>
            {erro}
          </Text>

          <TouchableOpacity
            style={styles.botao}
            onPress={buscarPersonagens}
          >
            <Text style={styles.textoBotao}>
              Tentar novamente
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={personagens}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.lista}
          ListEmptyComponent={
            <Text style={styles.mensagem}>
              Nenhum personagem encontrado.
            </Text>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image
                source={{ uri: item.image }}
                style={styles.imagem}
              />

              <View style={styles.informacoes}>
                <Text style={styles.nome}>
                  {item.name}
                </Text>

                <View style={styles.linhaStatus}>
                  <View
                    style={[
                      styles.indicador,
                      {
                        backgroundColor: corDoStatus(item.status),
                      },
                    ]}
                  />

                  <Text style={styles.texto}>
                    {traduzirStatus(item.status)}
                  </Text>
                </View>

                <Text style={styles.rotulo}>
                  Espécie
                </Text>

                <Text style={styles.texto}>
                  {item.species}
                </Text>

                <Text style={styles.rotulo}>
                  Origem
                </Text>

                <Text style={styles.texto}>
                  {item.origin.name}
                </Text>
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
    backgroundColor: '#101820',
  },

  cabecalho: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 20,
    backgroundColor: '#192630',
  },

  titulo: {
    color: '#75d85a',
    fontSize: 30,
    fontWeight: 'bold',
  },

  subtitulo: {
    color: '#d2dce0',
    fontSize: 15,
    marginTop: 5,
  },

  lista: {
    padding: 16,
    paddingBottom: 30,
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#263641',
    borderRadius: 14,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 4,
  },

  imagem: {
    width: 120,
    height: 160,
  },

  informacoes: {
    flex: 1,
    padding: 14,
    justifyContent: 'center',
  },

  nome: {
    color: '#ffffff',
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  linhaStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },

  indicador: {
    width: 9,
    height: 9,
    borderRadius: 5,
    marginRight: 7,
  },

  rotulo: {
    color: '#aabac1',
    fontSize: 12,
    marginTop: 5,
  },

  texto: {
    color: '#ffffff',
    fontSize: 14,
  },

  centralizado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
  },

  mensagem: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 12,
    textAlign: 'center',
  },

  mensagemErro: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },

  botao: {
    backgroundColor: '#75d85a',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 18,
  },

  textoBotao: {
    color: '#101820',
    fontSize: 15,
    fontWeight: 'bold',
  },
});