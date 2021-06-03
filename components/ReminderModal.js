import React, { Component} from 'react'
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import {AntDesign} from '@expo/vector-icons'
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default class ReminderModal extends Component {
  state = {
    hours: 0,
    minutes: 1
  }
  
  render() {
    var time = (this.state.hours * 60 * 60) + (this.state.minutes*60)
    const handleNotification = () => {
      Notifications.scheduleNotificationAsync({
        content: {
          title: 'JUST DO IT',
          body: "Don't know if you remember, but we do :)"
        },
        trigger: {
          seconds: time
        }
      })
    }
    return (
      <View style={[styles.container, {backgroundColor: !this.props.darkMode? '#fff': '#1e212d'}]}>
        <AntDesign name="close" size={32} onPress={() =>{
          this.props.closeModal()
        }
          } style={{position: 'absolute', top: 62, right: 32, zIndex: 10}} color={!this.props.darkMode? "#000": '#fff'}/>
        <TouchableOpacity onPress={() => this.setReminder()}>
          <Text style={[styles.title, {color: !this.props.darkMode? '#000': '#fff'}]}>Set Reminder</Text>
        </TouchableOpacity>
        <Text style={{fontSize: 20, color: !this.props.darkMode? '#000': '#a7c5eb'}}>Remind me in</Text>
        <View style={{flexDirection: 'row', padding: 20, justifyContent: 'space-around'}}>
          <View style={styles.counter}>
          <TouchableOpacity onPress={()=>this.setState({hours: this.state.hours+1})}>
            <AntDesign name="plus" size={32} color={!this.props.darkMode? '#000': '#a7c5eb'}/>
          </TouchableOpacity>
          <Text style={{fontSize: 24,fontWeight: '700', color: !this.props.darkMode? '#000': '#dbf6e9'}}>{this.state.hours}</Text>
          <TouchableOpacity onPress={()=>{
            if(this.state.hours <= 0) {
              this.setState({hours: 0})
            } else{
              this.setState({hours: this.state.hours-1})
            }
          }}>
            <AntDesign name="minus" size={32} style={{textAlign: 'center'}} color={!this.props.darkMode? '#000': '#a7c5eb'}/>
            <Text style={{textAlign: 'center', fontSize: 16, fontWeight: '700', color: !this.props.darkMode? '#000': '#dbf6e9'}}>Hours</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.counter}>
          <TouchableOpacity onPress={()=>this.setState({minutes: this.state.minutes+1})}>
            <AntDesign name="plus" size={32} color={!this.props.darkMode? '#000': '#a7c5eb'}/>
          </TouchableOpacity>
          <Text style={{fontSize: 24,fontWeight: '700', textAlign: 'center', color: !this.props.darkMode? '#000': '#dbf6e9'}}>{this.state.minutes}</Text>
          <TouchableOpacity onPress={()=>{
            if(this.state.minutes <= 1) {
              this.setState({minutes: 1})
            } 
            else if(this.state.minutes >= 60) {
                this.setState({minutes: 60})
            }
            else{
              this.setState({minutes: this.state.minutes-1})
            }
          }}>
            <AntDesign name="minus" size={32} style={{textAlign: 'center'}} color={!this.props.darkMode? '#000': '#a7c5eb'}/>
            <Text style={{textAlign: 'center', fontSize: 16, fontWeight: '700', color: !this.props.darkMode? '#000': '#dbf6e9'}}>Minutes</Text>
          </TouchableOpacity>
        </View>
        </View>
        
        <TouchableOpacity style={[styles.set, {backgroundColor: !this.props.darkMode? '#e48257': '#046582'}]} onPress={() =>{
           handleNotification()
           this.props.closeModal()
           var timer = Math.round(new Date() / 1000) + time
           this.props.addReminder(this.props.todo, timer) 
        }
          }>
            <Text style={{color: '#fff', fontWeight: '600'}}>Set</Text>
          </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 32,
    fontWeight: '700'
  },
  counter: {
    flexDirection: 'column',
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  set: {
    marginTop: 24,
    height: 50,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  }
})