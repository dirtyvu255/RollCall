import React from 'react'
import {View, FlatList, TouchableOpacity, Text, TextInput, Alert} from 'react-native'
import firestore from '@react-native-firebase/firestore'
import EStyleSheet from 'react-native-extended-stylesheet'
import QRCode from 'react-native-qrcode-svg'
import Modal from 'react-native-modal'
import ButtonDay from '../../components/ButtonDay'
import Header from '../../components/Header'
import Logo from '../../images/logo.png'
export default class RollCallChooseDay extends React.Component{
    state = {
        listDay: [],
        listDayChecked: [],
        total: 0,
        isShowQR: false,
        isShowByHand: false,
        idStudent: '',
        nameStudent: '',
        dayChecked: [],
        qrDays: 0,
        valueQR: ''
    }
    componentDidMount() {
        this.getData()
    }
    getData = () => {
        const {userID, classID} = this.props.route.params
        firestore()
        .collection(`users/${userID}/lists`)
        .doc(`${classID}`)
        .onSnapshot(snap => {
            this.setState({listDay: snap.data().timeline})
        })
        firestore()
        .collection(`users/${userID}/lists/${classID}/students`)
        .onSnapshot(snapshot => {
            let data = []
            let data1 = []
            snapshot.forEach( doc => {
                data.push({...doc.data(), id: doc.id})
            })
            for(let i = 0; i < data[0].dayChecked.length; i++){
                let count = 0
                for(let j = 0; j < data.length; j++){
                    if(data[j].dayChecked[i]){
                        count += 1
                    }
                }
                data1.push(count)
            }
            this.setState({listDayChecked: data1, total: data.length})
        })
    }


    addStudent = async() => {
        const {userID, classID} = this.props.route.params
        firestore()
        .collection(`users/${userID}/lists`)
        .doc(`${classID}`)
        .onSnapshot(snap => {
            let temp = []
            for(let i = 0; i < snap.data().days; i++){
                temp.push(false)
            }
            firestore().collection(`users/${userID}/lists/${classID}/students`)
            .doc(this.state.idStudent)
            .set({
                idStudent: this.state.idStudent,
                nameStudent: this.state.nameStudent,
                alphabet: this.state.nameStudent.split(' ').slice(-1)[0],
                dayChecked: temp,
            }).then( () => {
                Alert.alert(
                    "Thông báo",
                    "Đã thêm!!",
                    [{ text: "OK", onPress: () => this.toggleByHand() }]
                )
            })
        })  
    }
    toggleQR() {
        const {userID, classID} = this.props.route.params
        firestore()
        .collection(`users/${userID}/lists`)
        .doc(`${classID}`)
        .onSnapshot(snap => {
            this.setState({isShowQR: !this.state.isShowQR, valueQR: userID + ':' + classID + '/' + snap.data().days})
        })  
        
    }
    toggleByHand(){
        this.setState({isShowByHand: !this.state.isShowByHand, idStudent: '', nameStudent: ''})
    }
    goChat(name){
        const {userID, classID} = this.props.route.params
        this.props.navigation.navigate('Chat', {name: name, userID: userID, classID: classID})
    }

    render(){
        const {userID, classID, name} = this.props.route.params
        return(
            <View style={styles.container}>
                <Header 
                name={`${name}`} 
                button={() => this.toggleQR()} 
                icon='AddStudent'
                buttonBack={() => this.props.navigation.goBack()} 
                iconBack='Back'
                classID={classID}
                goChat={ () => this.goChat(name)}
                ></Header>
                <FlatList    
                    showsVerticalScrollIndicator={false}
                    data={this.state.listDay}
                    renderItem={({ item, index }) => 
                    <ButtonDay
                        data={item}
                        checkedCount={this.state.listDayChecked[index]}
                        total= {this.state.total}
                        onPress={() => this.props.navigation.navigate('ListRollCall', {classID: classID, userID: userID, idDay:index})}
                    />}
                    keyExtractor={item => item.id}
                    showsHorizontalScrollIndicator={false}
                />    
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
                            <TouchableOpacity style={styles.confirmBlock} onPress={() => this.toggleByHand()}>
                                <Text style={styles.confirmText}>Thêm thủ công</Text>
                            </TouchableOpacity> 
                            <Modal isVisible={this.state.isShowByHand} onBackdropPress={() => this.toggleByHand()}>
                                <View style={{backgroundColor: '#fff', borderRadius: 20, padding: 10}}>
                                    <Text style={{textAlign: 'center', fontSize: 22, fontWeight: 'bold', marginTop: 20}}>THÔNG TIN SINH VIÊN</Text>
                                    <View style={styles.inputBlock}>
                                        <Text style={styles.infoInput}>ID</Text>
                                        <TextInput 
                                        style={styles.textInput}
                                        onChangeText = {text => this.setState({idStudent: text})}
                                        value={this.state.idStudent}
                                        />
                                    </View>
                                    <View style={styles.inputBlock}>
                                        <Text style={styles.infoInput}>Tên sinh viên</Text>
                                        <TextInput style={styles.textInput}
                                        onChangeText = {text => this.setState({nameStudent: text})}
                                        value={this.state.nameStudent}
                                        />
                                    </View> 
                                    <TouchableOpacity style={styles.confirmBlock} onPress={() => this.addStudent()}>
                                        <Text style={styles.confirmText}>Xác nhận</Text>
                                    </TouchableOpacity>
                                </View>    
                            </Modal>
                        </View>
                    </Modal>
                ): null}
            </View>
        )
    }
}

const styles = EStyleSheet.create({
    container: {
        backgroundColor: "#fff",
        flex: 1,
        alignItems: 'center'
    },
    qrContainer: {
        // flex: 1,
        position: 'absolute',
        backgroundColor: '#fff',
        marginHorizontal: '-2rem',
        bottom: 0,
        marginBottom: '-1.7rem',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },
    qrMargin: {
        marginHorizontal: '3rem', 
        marginTop: '3rem'
    },
    confirmBlock: {
        backgroundColor: '#67e2d9',
        height: '5rem',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '2rem',
        borderRadius: 30,
        alignSelf: 'center',
        marginTop: '2rem',
        paddingHorizontal: '3rem'
    },
    confirmText: {
        fontWeight: 'bold',
        fontSize: 20
    },
    inputBlock:{
        marginTop: '1.5rem',
        marginHorizontal: '0.5rem',
    },
    infoInput: {
        fontSize: 18,
        fontWeight: '600',
    },
    textInput: {
        height: '3.5rem',
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 10,
        paddingLeft: '1rem'
    },
})