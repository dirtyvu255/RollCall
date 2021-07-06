import React from 'react'
import {View, FlatList, Text, Alert} from 'react-native'
import firestore from '@react-native-firebase/firestore';
import EStyleSheet from 'react-native-extended-stylesheet'
import AsyncStorage from '@react-native-async-storage/async-storage'
import XLSX from 'xlsx'
import { writeFile, DocumentDirectoryPath } from 'react-native-fs'
import Button from '../../components/ChooseClassButton'
import FixList from '../TeacherScreens/FixList'
import AddList from '../TeacherScreens/AddList'
import Header from '../../components/Header'

const DDP = DocumentDirectoryPath + "/";
export default class RollCallChooseClass extends React.Component{
    constructor(props){
        super(props)
        this.state={
            listsDone: [],
            listsUnDone: [],
            isShowEdit: false,
            isShowCreate: false,
            item: '',
            data:[]
        }
        this.toggleAddList = this.toggleAddList.bind(this)
        this.toggleFixList = this.toggleFixList.bind(this)
    }
    componentDidMount() {
        this.getData();
    }
    getData = () => {
        const userID = this.props.route.params.userID
        firestore().collection(`users/${userID}/lists`).onSnapshot(snap => {
            let tempList = []
            let tempList1 = []
            snap.forEach(doc => {
                if(doc.data().done){
                    tempList.push({...doc.data(), id: doc.id})
                }
                else{
                    tempList1.push({...doc.data(), id: doc.id})
                }   
            this.setState({listsDone: tempList})
            this.setState({listsUnDone: tempList1})
            });
        })
      }
    toggleFixList(item){
        this.setState({item: item, isShowEdit: !this.state.isShowEdit})
    }
    toggleAddList(){
        this.setState({isShowCreate: !this.state.isShowCreate})
    }
    logOut = async() =>{
        try{
            await AsyncStorage.removeItem('userID')
            await AsyncStorage.removeItem('role')
            await this.props.navigation.navigate('Login')
          } catch (e){
            console.log(e)
          }
    }

    createFile = async(item) =>{
        const userID = this.props.route.params.userID
        firestore().collection(`users/${userID}/lists/${item.id}/students`).onSnapshot(snap => {
            let students = []
            snap.forEach(doc => {
                    students.push({...doc.data(), id: doc.id}) 
            })
            let temp = []
            let tempTimeline = ["MSSV","Tên"]
            let day = new Date(item.dayStart.toDate())
            temp.push(['Môn', item.class],['Lớp', item.group],['Ngày bắt đầu', `${day.getDate()}/${day.getMonth() + 1}/${day.getFullYear()}`])
            for(let i = 0; i < item.timeline.length; i++){
                let days = new Date(item.timeline[i].toDate())
                tempTimeline.push(`${days.getDate()}/${days.getMonth() + 1}/${days.getFullYear()}`)
            }
            temp.push(tempTimeline)
            for(let i=0; i<students.length; i++){
                let tempStudent = []
                tempStudent.push(students[i].idStudent, students[i].nameStudent)
                for(let j = 0; j<students[i].dayChecked.length; j++){
                    if(students[i].dayChecked[j]){
                        tempStudent.push('Có')
                    }
                    else {
                        tempStudent.push('Vắng')
                    }
                }
                temp.push(tempStudent)
            }
            var wb = XLSX.utils.book_new()
            var ws = XLSX.utils.aoa_to_sheet(temp);
            XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
            const wbout = XLSX.write(wb, {type:'binary', bookType:"xlsx"});
            const file = DDP + `${item.class}.xlsx`;
            writeFile(file, wbout, 'ascii').then((res) =>{
                    Alert.alert("Xuất thành công", "Địa chỉ:" + file);
                    // Alert.alert("Xuất thành công");
            }).catch((err) => { Alert.alert("exportFile Error", "Error " + err.message); });    
        }) 
    }
    render(){
        const userID = this.props.route.params.userID
        return(
            <View style={styles.container}>
                <Header 
                name='Danh sách lớp' 
                button={() => this.toggleAddList()} 
                icon='AddList' 
                buttonExit={() => this.logOut()} 
                iconExit='Exit'
                ></Header>
                <Text style={[styles.textBlock, {marginTop: 15}]}>Các lớp chưa hoàn thành</Text>
                {this.state.listsUnDone.length !== 0 ? (
                    <FlatList   
                    showsVerticalScrollIndicator={false}
                    style={{height: 250}} 
                    data={this.state.listsUnDone}
                    renderItem={({ item }) => 
                    <Button
                        item={item}
                        done={item.done}
                        onPress={() => this.props.navigation.navigate("RollCallChooseDay", {classID: item.id, userID: userID, name: item.class})}
                        onLongPress= {() => this.toggleFixList(item)}
                    > 
                    </Button>
                }
                    keyExtractor={item => item.id}
                />
                ): null}
                <Text style={styles.textBlock}>Các lớp đã hoàn thành</Text>
                {this.state.listsDone.length !== 0 ? (
                    <FlatList    
                    showsVerticalScrollIndicator={false}
                    data={this.state.listsDone}
                    renderItem={({ item }) => 
                    <Button
                        item={item}
                        done={item.done}
                        onPress={() => this.props.navigation.navigate("RollCallChooseDay", {classID: item.id, userID: userID, name: item.class})}
                        onLongPress= {() => this.createFile(item)}  
                    />}
                    keyExtractor={item => item.id}
                />
                ) : null}
                {this.state.isShowEdit ? (
                    <FixList 
                    isShowEdit={this.state.isShowEdit} 
                    item={this.state.item} 
                    classID={this.state.item.id} 
                    userID={userID} 
                    toggleFixList={this.toggleFixList} />
                ): null}
                {this.state.isShowCreate ? (
                    <AddList 
                    isShowCreate={this.state.isShowCreate} 
                    userID={userID} 
                    toggleAddList={this.toggleAddList} />
                ): null}
            </View>  
        )
    }
}

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor:'#fff',
        alignItems: 'center',
    },
    textBlock: {
        fontWeight: 'bold',
        fontSize: 18,
    }
})