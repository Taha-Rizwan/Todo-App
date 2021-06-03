import React, { Component } from 'react'
import { Text, View, StyleSheet, SafeAreaView, TouchableOpacity, FlatList , KeyboardAvoidingView, TextInput, Keyboard, Alert, Modal } from 'react-native'
import {AntDesign, Ionicons} from '@expo/vector-icons'
import colors from '../Colors'
import ReminderModal from './ReminderModal'

export default class TodoModal extends Component {
  state={
   reminderVisible: false,
   newTodo: '',
   todo: 0,
   list: this.props.list
  }
 
  removeReminder(index) {
    let list = this.props.list
    list.todos[index].reminder = false
  }
  toggleReminderModal(todo) {
    this.setState({reminderVisible: !this.state.reminderVisible})
    this.setState({todo})
  }
  toggleTodoCompleted = (index) => {
    let list = this.props.list
    list.todos[index].completed = !list.todos[index].completed
    this.setState({list: list})
    this.props.updateLists()
  }
  addTodo = () => {
    let list = this.props.list
    list.todos.push({
      title:this.state.newTodo,
       completed: false,
        reminder: false,
        number:  list.todos.length,
        reminderTime: 0
    })

    this.setState({newTodo: ''})
    this.setState({list: list})
    this.props.updateLists()
    Keyboard.dismiss()
  }
  deleteTodo = (index) => {
    let list = this.props.list
    list.todos.splice(index,1)
    this.setState({list: list})
    this.props.updateLists()
  }
   addReminder = (index, time) => {
    
    let list = this.props.list
    list.todos[index].reminder = true
    list.todos[index].reminderTime = time
    this.setState({list: list})
    this.props.updateLists()
  }
  removeReminder = (index) => {
    let list = this.props.list

    list.todos[index].reminder = false
    list.todos[index].reminderTime = 0
    this.setState({list: list})
    this.props.updateLists()
  }
  checkReminder = (index) => {
    let list = this.props.list
    var now = Math.round(new Date() / 1000)
    if(list.todos[index].reminderTime === 0) {
      return null
    } else if(now >= list.todos[index].reminderTime) {
      list.todos[index].reminder = false
      list.todos[index].reminderTime = 0
      this.setState({list: list})
      this.props.updateLists()
    } else {
      return null
    }
  }
  renderTodo = (todo, index) => {
    this.checkReminder(index)
    const yeahAlert = () => 
    Alert.alert(
      "Confirmation",
      "Do you want to delete your todo?",
      [
        { text: "Cancel"}
        ,   
        {
          text: "Delete",
          onPress: () => {
            this.deleteTodo(index)
          },
          style: "destructive"
        }
      ]
    )
    const bruhAlert = () => {
      Alert.alert(
        "Confirmation",
        "Do you want to delete the reminder?",
        [
          { text: "Cancel"}
          ,   
          {
            text: "Delete",
            onPress: () => {
              this.removeReminder(this.state.todo)
            },
            style: "destructive"
          }
        ]
      )
    }
    return(
     
        <View style={styles.todoContainer}>
        <Modal animationType="fade" visible={
          this.state.reminderVisible && !todo.reminder } onRequestClose={()=> this.toggleReminderModal()}>
          <ReminderModal transparent={true} 
          addReminder = {(index, time)=>this.addReminder(index, time)}
          removeReminder = {(index)=>this.removeReminder(index)}
          closeModal={()=>this.toggleReminderModal()}
          todo={this.state.todo}
          darkMode={this.props.darkMode}
          />
          
        </Modal> 
          <TouchableOpacity onPress={() => this.toggleTodoCompleted(index)}>
            <Ionicons name={todo.completed ? "ios-square" : "ios-square-outline"} size={24} color={!this.props.darkMode? colors.grey: '#b4a5a5'} style={{width: 32}} />
          </TouchableOpacity>   
          <Text style={[styles.todo, {color: todo.completed?colors.grey: !this.props.darkMode? '#000': '#fff', textDecorationLine: todo.completed ? 'line-through' : 'none'}]}>{todo.title}</Text> 
          <TouchableOpacity onPress={yeahAlert}>
            <Ionicons name="trash" size={24} color={colors.rose} style={{marginLeft: 5}} />
          </TouchableOpacity>
          <TouchableOpacity onPress={
            ()=>{
              if(!todo.reminder) {
                this.toggleReminderModal(index)
              }
              else{
                null
              }
            } 
          } style={styles.reminder} onLongPress={() => {
            this.setState({todo: index})
            if (todo.reminder) {
              bruhAlert()
            } else{
              null
            }
          }}>
            {!todo.completed? <Text style={{color: !this.props.darkMode? colors.black: colors.white}}>{!todo.reminder?'Set Reminder' : 'Reminder Set'}</Text> : null}
          </TouchableOpacity>
        </View>
    )
   
  }
 
  render() {
    const list = this.props.list
    const taskCount = list.todos.length
    const completedCount = list.todos.filter(todo => todo.completed).length

    return (
      <KeyboardAvoidingView style={{flex:1, backgroundColor: !this.props.darkMode? '#fff' : '#1e212d'}} behaviour="padding">
        <SafeAreaView style={styles.container}>
          <TouchableOpacity style={{position: 'absolute', top: 64, right: 32, zIndex: 10}} onPress={this.props.closeModal}> 
            <AntDesign name="close" size={24} color={!this.props.darkMode?colors.black: '#fff'} />
          </TouchableOpacity>
          <View style={[styles.section, styles.header, {borderBottomColor: list.color}]}>
            <View>
              <Text style={[styles.title, {color: !this.props.darkMode?colors.black: '#fff'}]}>{list.name}</Text>
              <Text style={styles.taskCount}>
                {completedCount} of {taskCount} tasks
              </Text>
            </View>
          </View>
          <View style={[styles.section, {flex:3}]}>
            <FlatList 
              data={this.state.list.todos}
              renderItem={({item, index}) => this.renderTodo(item, index)}
              keyExtractor={(_, index) => index.toString()}
              contentContainerStyle={{paddingHorizontal: 32, paddingVertical: 64}}
              showsVerticalScrollIndicator={false}
            />
          </View>
          <View style={[styles.section, styles.footer]}>
            <TextInput style={[styles.input, {borderColor: list.color, color: !this.props.darkMode?colors.black: '#fff'}]}  
            placeholder="Enter new todo!"
            placeholderTextColor={!this.props.darkMode? '#000': '#f2edd7'}
            maxLength={22}
              onChangeText={text => this.setState({newTodo: text})}
              value={this.state.newTodo}
              />
            <TouchableOpacity style={[styles.addTodo, {backgroundColor: list.color}]} onPress={() => this.addTodo()} >
              <AntDesign name="plus" size={16} color={colors.white} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  section: {
    flex: 1,
    alignSelf: 'stretch'
  },
  header: {
    justifyContent: 'flex-end',
    marginLeft: 64,
    borderBottomWidth: 3
  },
  title: {
    fontSize: 30,
    fontWeight: '800'
  },
  taskCount: {
    marginTop: 4,
    marginBottom: 16,
    color: colors.grey,
    fontWeight: '600' 
  },
  footer: {
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center'
  },
  input: {
    flex:1,
    height: 48,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 6,
    marginRight: 8,
    paddingHorizontal: 8
  },
  addTodo: {
    borderRadius: 4,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  todoContainer: {
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: 'center'
  },
  todo: {
    color: colors.black,
    fontWeight: '700',
    fontSize: 16
  },
  reminder: {
    color: colors.black,
    fontWeight: '700',
    fontSize: 32,
    left: 275,
    position: 'absolute',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center'
  }
})