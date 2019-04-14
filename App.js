import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from "@react-native-community/netinfo";

import Item from './src/Item'

export default class App extends Component {

  constructor(props) {
    // console.ignoredYellowBox = ['Warning:']; apenas warnings especificos
    console.disableYellowBox = true; //todos warnings

    super(props);
    this.state = {
      lista: [],
      input: "",
      netstatus: 0,
      load: 0,
    };

    this.url = "https://b7web.com.br/todo/49833";

    this.loadLista = this.loadLista.bind(this);
    this.addButton = this.addButton.bind(this);
    this.conEvent = this.conEvent.bind(this);
    this.sincronizar = this.sincronizar.bind(this);
    this.excluir = this.excluir.bind(this);
    this.atualizar = this.atualizar.bind(this);

    NetInfo.addEventListener('connectionChange', this.conEvent);

    this.loadLista();
  }

  excluir(id) {
    // alert("Exlcuindo item..." + id);
    getData = async () => {
      try {
        await AsyncStorage.getItem('lista').then((v) => {
          let state = this.state;
          let listaJSON = JSON.parse(v);//manda de string para json
          for (var i in listaJSON) {
            if (listaJSON[i].id == id) {
              listaJSON.splice(i, 1);
            }
          }

          state.lista = listaJSON;
          let listaStr = JSON.stringify(listaJSON);

          storeData = async () => {
            try {
              await AsyncStorage.setItem('lista', listaStr);//só armazena string
            } catch (e) {
              // saving error
              alert('saving error');
            }
          }
          storeData();

          this.setState(state);
        });

      } catch (e) {
        // error reading value
        alert('error reading value');
      }
    }
    if (id != null) {//só vou enviar se tiver algo.
      getData();
    }
  }

  atualizar(id, done) {
    getData = async () => {
      try {
        await AsyncStorage.getItem('lista').then((v) => {
          let state = this.state;
          let listaJSON = JSON.parse(v);//manda de string para json
          for (var i in listaJSON) {
            if (listaJSON[i].id == id) {
              listaJSON[i].done = done == 'sim' ? '1' : '0';
            }
          }

          state.lista = listaJSON;
          let listaStr = JSON.stringify(listaJSON);

          storeData = async () => {
            try {
              await AsyncStorage.setItem('lista', listaStr);//só armazena string
            } catch (e) {
              // saving error
              alert('saving error');
            }
          }
          storeData();

          this.setState(state);
        });

      } catch (e) {
        // error reading value
        alert('error reading value');
      }
    }
    if (id != null) {//só vou enviar se tiver algo.
      getData();
    }
  }

  sincronizar() {
    getData = async () => {
      try {
        await AsyncStorage.getItem('lista').then((v) => {
          fetch(this.url + '/sync', {
            method: "POST",
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              json: v//string com a lista inteira.
            })
          }).then((r) => r.json())
            .then((json) => {
              if (json.todo.status) {
                alert('Itens sincronizados com suceso!');
                // this.loadLista(); não precisa do load lista por que já estarão sincronizados.
              } else {
                alert('Ops, algo deu errado, tente novamente mais tarde.');
              }
            });
        });

      } catch (e) {
        // error reading value
        alert('error reading value');
      }
    }

    if (this.state.netstatus == 1) {
      getData();
    } else {
      alert("Você está offline.");
    }
  }

  conEvent(info) {
    let state = this.state;

    if (info.type == 'wifi' ||
      info.type == 'cellular' ||
      info.type == 'wimax') {
      state.netstatus = 1
      state.load = 1;
    } else if (info.type == 'unknown') {
      conEvent(info);//chamo novamente para tentar determinar o status de conexão com a internet.
    } else {
      state.load = 1;
      state.netstatus = 0;
    }

    this.setState(state);

    if (this.state.netstatus == 1) {
      this.sincronizar();
    }

    if (state.lista.length == 0) {//toda vez que mudar o status da internet ele vai executar o loadLista para pegar os dados.
      this.loadLista();
    }
  }

  loadLista() {
    if (this.state.netstatus == 1) {
      fetch(this.url)
        .then((r) => r.json())
        .then((json) => {
          let state = this.state;
          state.lista = json.todo;
          this.setState(state);

          //a gente precisa armazenar o retorno no async storage
          // o async storage deve ser o centro de armazenamento.
          let lista = JSON.stringify(json.todo);//pega o json e manda para string
          storeData = async () => {
            try {
              await AsyncStorage.setItem('lista', lista);//só armazena string
            } catch (e) {
              // saving error
              alert('saving error');
            }
          }
          storeData();
        });
    } else {
      //se não tiver internet eu pego do async storage
      getData = async () => {
        try {
          await AsyncStorage.getItem('lista').then((v) => {
            let state = this.state;
            //v = lsita em forma de string
            //verifica se tem alguma coisa salva;
            if (v != '') {
              let listaJSON = JSON.parse(v);//manda de string para json
              state.lista = listaJSON;
            } else {
              alert('Vazio');
            }
            this.setState(state);
          });

        } catch (e) {
          // error reading value
          alert('error reading value');
        }
      }
      getData();
    }
  }

  addButton() {
    getData = async () => {
      try {
        await AsyncStorage.getItem('lista').then((v) => {
          let state = this.state;
          let listaJSON = JSON.parse(v);//manda de string para json
          listaJSON.push({
            item: this.state.input,
            done: 0,
            id: 0
          });
          state.lista = listaJSON;
          let listaStr = JSON.stringify(listaJSON);

          storeData = async () => {
            try {
              await AsyncStorage.setItem('lista', listaStr);//só armazena string
            } catch (e) {
              // saving error
              alert('saving error');
            }
          }
          storeData();
          state.input = "";
          this.setState(state);
        });

      } catch (e) {
        // error reading value
        alert('error reading value');
      }
    }
    if (this.state.input != '') {//só vou enviar se tiver algo.
      getData();
    }
  }

  render() {

    if (this.state.load) {
      return (
        <View style={styles.container}>
          <View style={styles.addArea}>
            <Text style={styles.addTxt}>Adicione uma nova tarefa</Text>
            <TextInput style={styles.input} onChangeText={(text) => {
              let state = this.state;
              state.input = text;
              this.setState(state);
            }} value={this.state.input} />
            <Button title="Adicionar" onPress={this.addButton} />
          </View>
          <FlatList
            data={this.state.lista}
            renderItem={({ item }) => <Item data={item} onDelete={this.excluir} onUpdate={this.atualizar} url={this.url} loadFunction={this.loadLista} />}
            keyExtractor={(item, index) => item.id}
          />
          <View style={styles.statusView}>
            <Text style={styles.statusText}>{this.state.netstatus == 1 ? "Conectado" : "Desconectado"}</Text>
          </View>
          <View style={styles.statusView}>
            <Button title="Sincronizar" onPress={this.sincronizar} />
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.container2}>
          <Text style={styles.indetermined}>Aguarde...</Text>
        </View>
      );
    }
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  addArea: {
    marginBottom: 20,
    backgroundColor: '#DDD',
  },
  addTxt: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 10
  },
  input: {
    height: 40,
    backgroundColor: '#CCC',
    marginLeft: 20,
    marginRight: 20,
    paddingLeft: 10,
    paddingRight: 10
  },
  statusView: {
    height: 50,
    backgroundColor: '#EEE'
  },
  statusText: {
    fontSize: 23,
    textAlign: 'center'
  },
  container2: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  indetermined: {
    fontSize: 23,
    fontWeight: 'bold'
  }
});
