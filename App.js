import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Modal, ActivityIndicator } from 'react-native';
import {AntDesign, Ionicons} from '@expo/vector-icons'
import colors from './Colors'
import  TodoList from './components/TodoList'
import AddListModal from './components/AddListModal'

import storage from './Storage'
export default class App extends React.Component {
  state = {
    addTodoVisible: false,
    lists: [],
    user: {},
    loading: true,
    darkMode: false
  }

  componentDidMount =  () => {
    storage.load({
      key: 'lists'
    }).then(ret=>{
      if(ret){
        this.setState({lists: ret})
        this.setState({loading: false})
      }
      else{
        storage.save({
          key: 'lists',
          data: {}
        }).then(ret=>{
          this.setState({lists: ret})
          this.setState({loading: false})
        })
      }
  }) 
  storage.load({
    key: 'darkMode'
  }).then((val) => {
    if(val){
      this.setState({darkMode: val})
    }
   else{
     storage.save({
       key: 'darkMode',
       data: false
     }).then(ret=>{
       this.setState({darkMode: false})
     })
   }
  })
}
  componentDidUpdate() {
    storage.save({
      key: 'lists',
      data: this.state.lists
    })
    console.log('Hi')
  }
  componentWillUnmount() {
    storage.save({
      key: 'lists',
      data: this.state.lists
    })
  }

  toggleDarkMode(){
    storage.save({
      key: 'darkMode',
      data: !this.state.darkMode
    }).then(ret=>{
      this.setState({darkMode: !this.state.darkMode})
    })
  }
  toggleAddToModal() {
    this.setState({addTodoVisible: !this.state.addTodoVisible})
  }
  changeState(update) {
    this.setState({lists: update})
  }
  renderList = (list, index) => {
    var darkMode = this.state.darkMode
    return <TodoList list={list} deleteList={this.deleteList} darkMode={darkMode} index={index} lists={this.changeState} updateLists={this.updateLists} />
  }
  addList = list => {
    let lists = this.state.lists
    lists.push(list)  
    this.setState({lists: lists})
    storage.save({
      key: 'lists',
      data: this.state.lists
    })
  }
  updateLists = () => {
     storage.save({
      key: 'lists',
      data: this.state.lists
    })
  }
  deleteList = (index) => {
    let lists = this.state.lists
    lists.splice(index, 1)
    this.setState({lists: lists})
    storage.save({
      key: 'lists',
      data: this.state.lists
    })
  };
  render = () => {
    var darkMode = this.state.darkMode
    
    if (this.state.loading) {
      return(
        <View style={styles.container}>
          <ActivityIndicator size="large" color={colors.rose} />
        </View>
      ) 
    }
    return (
    
      <View style={[styles.container, {backgroundColor: !darkMode?'#fff':'#1e212d'}]}>
      <Modal animationType="fade" visible={this.state.addTodoVisible} onRequestClose={()=> this.toggleAddToModal()}>
        <AddListModal closeModal={()=> this.toggleAddToModal()} addList={this.addList} darkMode={darkMode}/>
      </Modal>
      {!darkMode ?<View style={{position: 'absolute', top: 32, left: 16}}>
        <TouchableOpacity onPress={()=>this.toggleDarkMode()}>
          <Ionicons name="sunny-outline" size={32} color="#000"/>
        </TouchableOpacity>
      </View> : 
      <View style={{position: 'absolute', top: 32, right: 16}}>
        <TouchableOpacity onPress={()=>this.toggleDarkMode()}>
          <Ionicons name="moon-outline" size={32} color="#fff"/>
        </TouchableOpacity>
      </View>
    }

      <View style={{flexDirection: "row"}}>
       
        <View style={[styles.divider, {backgroundColor: !darkMode?colors.crimson: colors.lightRed}]} />
        
        <Text style={[styles.title,{color: !darkMode?'#000':'#fff'}]}>
          To <Text style={{fontWeight: "300", color: !darkMode? '#1f4068': '#4169E1'}}>-</Text> <Text style={{fontWeight: "300", color: !darkMode? colors.rose: colors.lightRed}}>Do</Text>
        </Text>
        <View style={[styles.divider, {backgroundColor: !darkMode?colors.crimson: colors.lightRed}]} />
      </View>
      <View style={{marginVertical: 48}}>
        <TouchableOpacity style={[styles.addList, {borderColor: !darkMode? colors.rose: colors.lightRed}]} onPress={()=> this.toggleAddToModal()}>
          <AntDesign name="plus" size={16} color={darkMode? colors.rose: colors.lightRed} />
        </TouchableOpacity>

        <Text style={[styles.add, {color: !darkMode? colors.rose: colors.lightRed}]}>Add List</Text>
      </View>
      <View style={{height: 275, paddingLeft: 32}}>
        <FlatList 
        data={this.state.lists} 
        keyExtractor={item => item.id.toString()} 
        horizontal={true} 
        showsHorizontalScrollIndicator={false} 
        renderItem={({item, index }) => this.renderList(item,index)}
        keyboardShouldPersistTaps = 'always'
        />
      </View>
    </View>
      
    );
  }
 
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider:{
    height: 1,
    flex: 1,
    alignSelf: 'center'
  },
  title: {
    fontSize: 38,
    fontWeight: "800",
    color: colors.black,
    paddingHorizontal: 64
  },
  addList: {
    borderWidth: 2,
    borderRadius: 4,
    padding: 16,
    alignItems: "center",
    justifyContent: "center"
  },
  add: {
    fontWeight: "600",
    fontSize: 14,
    marginTop: 8
  }
});
