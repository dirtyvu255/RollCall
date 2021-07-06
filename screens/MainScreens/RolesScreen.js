import React, { Component } from 'react';
import {View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'




export default class Roles extends Component {
    componentDidMount(){
        this.getUser();
    }
    getUser = async() =>{
        try{
            const userID = await AsyncStorage.getItem('userID')
            const role = await AsyncStorage.getItem('role')
            if(role == "Faculty"){
                this.props.navigation.navigate('MenuFaculty',{userID: userID })
            }
            else if(!role && userID){
                this.props.navigation.navigate('MenuStudent',{userID: userID })
            }
            else if(role == "Teacher"){
                this.props.navigation.navigate('RollCallChooseClass',{userID: userID })
            }
            else{
                this.props.navigation.navigate('Login')
            }
            console.log(role, userID)
        }catch(e){
        }
    }
  render() {
    return (
        <View>
        </View>
    );
  }
};