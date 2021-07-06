import React from 'react'
import {View, Text, Alert} from 'react-native'
import QRCodeScanner from 'react-native-qrcode-scanner';
import firestore from '@react-native-firebase/firestore'
import EStyleSheet from 'react-native-extended-stylesheet'
import GetLocation from 'react-native-get-location'
import { distanceConversion, getDistance } from 'geolib';
import Header from '../../components/Header'

export default class CheckIn extends React.Component{
    constructor(props){
        super(props)
        this.state={
            userIDTeacher: '',
            classID: '',
            index: 0,
            lat: 0,
            long: 0,
            curLat: 0,
            curLong: 0
        }
    }

    getLocation = async () => {
        await GetLocation.getCurrentPosition({
            enableHighAccuracy: false,
            timeout: 15000,
        })
        .then(location => {
            this.setState({curLat: location.latitude, curLong: location.longitude})
        })
        .catch(error => {
            const { code, message } = error;
            console.warn(code, message);
        })

        let distance = getDistance(
            { latitude: this.state.curLat, longitude: this.state.curLong },
            { latitude: this.state.lat, longitude: this.state.long },
            accuracy = 1
        )

        if(distance < 100){
            console.log(distance)
            this.checkIn()
        }
        else{
            console.log(distance)
            Alert.alert(
                "Thông báo",
                "Bạn đang ở quá xa lớp học!",
            )
        }
    }
    checkIn = async() => {
        const {userIDTeacher, classID, index} = this.state
        const {userID, idStudent} = this.props.route.params
        const date = new Date()
        const time = `${date.getHours()}:${date.getMinutes()} ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
        const tempData = await firestore().collection(`users/${userIDTeacher}/lists/${classID}/students`)
        .doc(idStudent)
        .get()
        const classData = await firestore().collection(`users/${userIDTeacher}/lists`)
        .doc(classID)
        .get()
        let dayChecked = tempData.data().dayChecked
        dayChecked[index] = true
        {classData.data().isAllowToScan ? (
            firestore().collection(`users/${userIDTeacher}/lists/${classID}/students`)
            .doc(idStudent)
            .update({
                dayChecked: dayChecked,
            })
            .then( () => {
                firestore()
                    .collection(`students/${userID}/history`)
                    .add({
                        class: classData.data().class,
                        time: time
                    })
            })
            .then( () => {
                Alert.alert(
                    "Thông báo",
                    "Đã đi học !!!",
                )
            })
        ):(
            Alert.alert(
                "Thông báo",
                "Hết giờ điểm danh !!!",
            )
        )}
        
    }
    configData(data){
        let temp = data.search(":");
        let temp2 = data.search("/");
        let temp3 = data.search("curLat:");
        let temp4 = data.search("curLong:");
        let temp5 = data.length
        this.setState({userIDTeacher: data.substring(0,temp), 
            classID: data.substring(temp + 1, temp2), 
            index: data.substring(temp2 + 1, temp3),
            lat: data.substring(temp3 + 7, temp4),
            long: data.substring(temp4 + 8, temp5)})
    }
    onSuccess = async e => {
       if(e.data){
           await this.configData(e.data)
           await this.getLocation()
       }
    };



    render(){
        return(
            <View>
                <Header 
                name='Đi học'
                buttonBack={() => this.props.navigation.goBack()} 
                iconBack='Back'
                ></Header>
                <Text style={styles.titleCamera}>Scan để đi học</Text>
                <View style={styles.cameraContainer}>
                    <QRCodeScanner 
                        showMarker={true}
                        onRead={this.onSuccess}
                        cameraStyle={styles.cameraStyle}
                    />
                </View>
            </View>
        )
    }
}

const styles = EStyleSheet.create({
    container: {
    },
    cameraContainer: {
        marginLeft: '4.5rem',
        
    },
    cameraStyle:{
        width: '32rem',
        height: '32rem',
        marginTop: '2rem'
    },
    titleCamera: {
        textAlign:'center',
        fontWeight: 'bold',
        fontSize: 20,
        marginTop: '3rem',
    }
})