import React from 'react'
import {Text, TouchableOpacity, View, ScrollView, Image} from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
import AsyncStorage from '@react-native-async-storage/async-storage'
import AddStudent from '../../images/addStudent.png'
import Check from '../../images/check.png'
import Header from '../../components/Header'


export default class MenuFaculty extends React.Component{
    logOut = async() =>{
        try{
            await AsyncStorage.removeItem('userID')
            await AsyncStorage.removeItem('role')
            await this.props.navigation.navigate('Login')
          } catch (e){
            console.log(e)
          }
    }
render(){
    return(
        <View style={styles.mainContainer}>
            <Header 
                name='Menu' 
                buttonExit={() => this.logOut()} 
                iconExit='Exit'
            ></Header>
            <ScrollView>
                <TouchableOpacity 
                    style={styles.buttonStyle}
                    onPress= {() => this.props.navigation.navigate('SignUp')}
                >
                    <Image source={AddStudent} style={styles.iconStyle}/>
                    <View style={styles.textButtonContainer}>
                        <Text style={styles.textButton}>Tạo tài khoản mới</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.buttonStyle}
                >
                    <Image source={Check} style={styles.iconStyle}/>
                    <View style={styles.textButtonContainer}>
                        <Text style={styles.textButton}>Xem danh sách</Text>
                    </View>
                </TouchableOpacity>
                
            </ScrollView>
        </View>
    )
}
}
const styles = EStyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        //justifyContent: 'space-between',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonStyle: {
        height: '10rem',
        backgroundColor: '#67e2d9',
        borderRadius: '5rem',
        margin: '2rem',
        marginHorizontal: '3rem',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
    },
    iconStyle: {
        height: '6rem',
        width: '6rem'
    },
    textButtonContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    textButton: {
        fontSize: 22,
        fontWeight: 'bold'
    },
})