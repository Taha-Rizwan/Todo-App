import React from 'react'
import { Text, View, StyleSheet, KeyboardAvoidingView, TouchableOpacity, TextInput } from 'react-native'
import {AntDesign} from '@expo/vector-icons'
import colors from '../Colors'

export default class AddListModal extends React.Component {
  backgroundColors = [ "#fed049","#e9896a", "#9ede73", "#966c3b", "#9fd8df", "#93329e", "#7868e6",  "#fa1e0e", "#ffefa1", "#00af91", ]
  state = {
    name: "",
    color: this.backgroundColors[0]
  }

  createTodo = async() => {
    const {name, color} = this.state
    const id  = Math.floor(Math.random() * 100000000)
    const todos = []
    const list = {name,color, id, todos}
   await this.props.addList(list)
    this.setState({name: ''})
    this.props.closeModal()
  }
  renderColors() {
    return this.backgroundColors.map(color=> {
      return (
        <TouchableOpacity key={color} style={[styles.colorSelector, {backgroundColor: color}]} onPress={() => this.setState({color})} />
      )
    })
  }
  render() {
    return (
      <KeyboardAvoidingView style={[styles.container, {backgroundColor: !this.props.darkMode? '#fff' : '#2b2e4a'}]} behaviour="padding" >
        <TouchableOpacity style={{position: 'absolute', top: 64, right: 32}} onPress={this.props.closeModal}>
          <AntDesign name="close" size={24} color={!this.props.darkMode? colors.black: '#fff'} />
        </TouchableOpacity> 

        <View style={{alignSelf: 'stretch', marginHorizontal: 32}}>
          <Text style={[styles.title, {color: !this.props.darkMode? colors.black: '#f3f4ed'}]}>Create Todo List</Text>
          <TextInput style={[styles.input, {borderColor: !this.props.darkMode? colors.scarlet: '#d44000', color: this.props.darkMode? '#fff': '#000'}]} placeholder="Type a name for you todo list" onChangeText={text=>this.setState({name:text})} placeholderTextColor={!this.props.darkMode? colors.black: '#f2edd7'} maxLength={10}/>

          <View style={{flexDirection: 'row', justifyContent:'space-between', marginTop: 12}}>
            {this.renderColors()}
          </View>

          <TouchableOpacity style={[styles.create, {backgroundColor: this.state.color}]} onPress={this.createTodo}>
            <Text style={{color: colors.white, fontWeight: '600'}}>Create!</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
      fontSize: 28,
      fontWeight: "800",
      alignSelf: 'center',
      marginBottom: 16
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 6,
    height: 50,
    marginTop: 8,
    paddingHorizontal: 16,
    fontSize: 18
  },
  create: {
    marginTop: 24,
    height: 50,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center'
  },
  colorSelector: {
    width: 30,
    height: 30,
    borderRadius: 4
  }
})