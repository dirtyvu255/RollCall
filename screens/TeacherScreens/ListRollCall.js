import React from 'react'
import {View, Text, FlatList, TouchableOpacity, Alert, ScrollView} from 'react-native'
import firestore from '@react-native-firebase/firestore'
import QRCode from 'react-native-qrcode-svg'
import EStyleSheet from 'react-native-extended-stylesheet'
import Modal from 'react-native-modal'
import GetLocation from 'react-native-get-location'
import Student from '../../components/Students'
import Header from '../../components/Header'
import Logo from '../../images/logo.png'

// import { getDistance } from 'geolib';

export default class ListRollCall extends React.Component{
    state = {
        students: [],
        isShowQR: false,
        valueQR: '',
        curLat: 0,
        curLong: 0
    }

    componentDidMount(){
        this.getData()
        
        this.getLocation()
    }
    getLocation(){
        GetLocation.getCurrentPosition({
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
    }
   
    getData = () => {
        const {userID, classID} = this.props.route.params
        firestore()
        .collection(`users/${userID}/lists/${classID}/students`)
        .orderBy('alphabet')
        .onSnapshot(snapshot => {
            let data = []
            snapshot.forEach( doc => {
                data.push({...doc.data(), id: doc.id})
            })
            this.setState({students: data})
            console.log(data)
        })
      }
    updateData = () => {
        const {userID, classID} = this.props.route.params
        this.state.students.map((ele) => 
        firestore()
          .collection(`users/${userID}/lists/${classID}/students`)
          .doc(`${ele.id}`)
          .update({
            dayChecked: ele.dayChecked
          })
        )
        Alert.alert(
            "Thông báo",
            "Điểm danh thành công!",
            // [{ text: "OK", onPress: () => this.props.navigation.navigate("MenuTeacher") }]
          )
    }
    toggleQR() {
        const {idDay,userID,classID} = this.props.route.params
            firestore()
              .collection(`users/${userID}/lists`)
              .doc(`${classID}`)
              .update({
                isAllowToScan: !this.state.isShowQR
              })
        this.setState({isShowQR: !this.state.isShowQR, valueQR: userID + ':' + classID + '/' + idDay + 'curLat:' + this.state.curLat + 'curLong:' + this.state.curLong})
    }
    render(){
        const {idDay} = this.props.route.params
        console.log(this.state.valueQR)
        return(
        <View style={styles.container}>     
            <Header name='Danh sách' 
            button={() => this.toggleQR()} 
            icon='QR'
            buttonBack={() => this.props.navigation.goBack()} 
            iconBack='Back'
            ></Header>
            <View style={styles.tag}>
                <Text style={styles.tagItem}>ID</Text>
                <Text style={[styles.tagItem, {marginLeft: -85}]}>Họ và Tên</Text>
                <Text style={styles.tagItem}>Điểm danh</Text>
            </View>
            <FlatList    
                showsVerticalScrollIndicator={false}
                style={{paddingVertical: 20}}
                data={this.state.students}
                renderItem={({ item }) => 
                <Student
                    item = {item}
                    isChecked = {item.dayChecked[idDay]}
                    checked = { () => {
                        this.setState(prevState => ({
                            students: prevState.students.map(
                                ele => ele.idStudent == item.idStudent ? { ...ele, dayChecked: ele.dayChecked.map((ele, index) => index == idDay ? !ele : ele)} : ele
                        )}))
                    }
                    }
                />}
            />
            <TouchableOpacity style={styles.confirmBlock} onPress={this.updateData}>
                <Text style={styles.confirmText}>Xác nhận</Text>
            </TouchableOpacity>
            {this.state.isShowQR ? (
                <Modal isVisible={this.state.isShowQR} onBackdropPress={() => this.toggleQR()}>
                    <View style={styles.qrContainer}>
                        <View style={styles.qrMargin}>
                            <QRCode
                                size={350}
                                logo = {Logo}
                                logoMargin = '1'
                                value = {this.state.valueQR}
                            />
                        </View>
                    </View>
                </Modal>
            ): null}
        </View>
        )
    }
}

const styles = EStyleSheet.create({
    container:{
        backgroundColor: '#fff',
        borderRadius: 15,
        flex: 1
    },
    tag:{
        borderBottomWidth: 0.5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: '2rem',
        marginBottom: '-2rem',
        marginHorizontal: '1.5rem'
    },
    tagItem: {
        fontSize: 16,
        color: 'grey'
    },
    confirmBlock: {
        backgroundColor: '#67e2d9',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '5rem',
        borderRadius: 30,
        marginHorizontal: '6rem'
    },
    confirmText: {
        fontWeight: 'bold',
        fontSize: 20,
        padding: '1.5rem',
        paddingHorizontal: '8rem'
    },
    qrContainer: {
        position: 'absolute',
        backgroundColor: '#fff',
        marginHorizontal: '-2rem',
        bottom: 0,
        marginBottom: '-2.7rem',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },
    qrMargin: {
        margin: '3rem'
    },
})