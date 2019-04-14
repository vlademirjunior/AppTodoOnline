import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, TouchableHighlight } from 'react-native';

export default class Item extends Component {

    constructor(props) {
        super(props);
        this.state = {
            done: (this.props.data.done == '1' ? styles.done : styles.undone),
        };

        this.marcar = this.marcar.bind(this);
        this.excluir = this.excluir.bind(this);
    }


    excluir() {
        this.props.onDelete(this.props.data.id);
        /*
        fetch(this.props.url + '/' + this.props.data.id, {
            method: "DELETE",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        }).then((r) => r.json())
            .then((json) => {
                alert("Item exclúido com suceso!");
                this.props.loadFunction();
            });
            */
    }


    marcar() {
        let state = this.state;

        let done = 'sim';

        if (state.done == styles.undone) {
            state.done = styles.done;
            done = 'sim';
        } else {
            state.done = styles.undone;
            done = 'nao';
        }

        this.setState(state);

        this.props.onUpdate(this.props.data.id, done);
        /*

        fetch(this.props.url + '/' + this.props.data.id, {
            method: "PUT",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                done: done
            })
        }).then((r) => r.json())
            .then((json) => {
                alert("Item atualizado com suceso!");
            });
            */

        this.setState(state);
    }

    render() {
        return (
            <View style={styles.area}>
                <TouchableHighlight style={[styles.marcarArea, this.state.done]} onPress={this.marcar}>
                    <View>

                    </View>
                </TouchableHighlight>
                <Text>{this.props.data.item}</Text>
                <Button style={styles.botao} title="X" onPress={this.excluir} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    area: {
        paddingTop: 10,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderColor: '#CCC',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    marcarArea: {
        width: 40,
        height: 40,
        marginRight: 10,
        marginLeft: 10,
    },
    undone: {
        backgroundColor: '#CCC'
    },
    done: {
        backgroundColor: '#0F0'
    },
    botao: {
        width: 40,
        height: 40
    }

});