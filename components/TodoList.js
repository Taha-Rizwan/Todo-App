import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, Alert } from 'react-native';
import colors from '../Colors'
import {Ionicons} from '@expo/vector-icons'
import TodoModal from './TodoModal'


export default class TodoList extends React.Component {

  state = {
    showListVisible: false
  }

  toggleListModal() {
    this.setState({showListVisible: !this.state.showListVisible})
  }
  
  render() {
    const list = this.props.list
    const completedCount = list.todos.filter(todo => todo.completed).length
    const remainingCount = list.todos.length - completedCount
    const bruhAlert = () => 
    Alert.alert(
      "Confirmation",
      "Do you want to delete your todo list?",
      [
        { text: "Cancel"}
        ,   
        {
          text: "Delete",
          onPress: () => {
            this.props.deleteList(this.props.index)
          },
          style: "destructive"
        }
      ]
    )
    return(
      <View>
        <Modal animationType="fade" visible={this.state.showListVisible} onRequestClose={()=> this.toggleListModal()} >
        <TodoModal list={list} closeModal={() => this.toggleListModal()} lists={this.props.lists} darkMode={this.props.darkMode} updateLists={this.props.updateLists} />
        </Modal>
        
        <TouchableOpacity style={[styles.listContainer, {backgroundColor: list.color}]} onPress={() => this.toggleListModal()} >
          <Text style={styles.listTitle} numberOfLines={1}>
            {list.name}
          </Text>
          <View>
            <TouchableOpacity onPress={bruhAlert} style={styles.options}>
              <Ionicons name="trash-bin" size={32}  color="#fff" />
            </TouchableOpacity>
            <View style={{alignItem: 'center'}}>
              <Text style={styles.count}>{remainingCount}</Text>
              <Text style={styles.subtitle}>Remaining</Text>
            </View>
            <View style={{alignItem: 'center'}}>
              <Text style={styles.count}>{completedCount}</Text>
              <Text style={styles.subtitle}>Completed</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
      
    )
  }
 
}

const styles = StyleSheet.create({
  listContainer: {
    paddingVertical: 32,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginHorizontal: 12,
    alignItems: "center",
    width: 200
  },
  listTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 18
  },
  count: {
    fontSize: 48,
    fontWeight: "200",
    color: colors.white
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.white
  },
  options: {
    position: 'absolute',
    top: -75,
    left: -68,
    zIndex: 10
  }
})