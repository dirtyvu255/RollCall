import React from 'react'
import {View, Text, TextInput, FlatList, TouchableOpacity, Alert, ScrollView} from 'react-native'
import Day from '../../components/Day'
import firestore from '@react-native-firebase/firestore'
import DateTimePicker from '@react-native-community/datetimepicker'
import EStyleSheet from 'react-native-extended-stylesheet'
import Modal from 'react-native-modal'


export default class CreateList extends React.Component{
    constructor(props){
        super(props)
        this.state ={
            week: [
                {
                    id: 2,
                    name: 'Thứ 2',
                    isChecked: false
                },
                {
                    id: 3,
                    name: 'Thứ 3',
                    isChecked: false
                },
                {
                    id: 4,
                    name: 'Thứ 4',
                    isChecked: false
                },
                {
                    id: 5,
                    name: 'Thứ 5',
                    isChecked: false
                },
                {
                    id: 6,
                    name: 'Thứ 6',
                    isChecked: false
                },
                {
                    id: 7,
                    name: 'Thứ 7',
                    isChecked: false
                },
                {
                    id: 1,
                    name: 'Chủ nhật',
                    isChecked: false
                }
            ],
            date: new Date(),
            class: '',
            dayOfWeek: [],
            dayStart: new Date(),
            days: '',
            group: '',
            timeEnd: '',
            timeStart: '',
            timeline: []
        }

    }
    onChange = async(event,selectedDate) => {
        const currentDate = selectedDate
        if(currentDate){
            this.setState({dayStart: currentDate})
        }else { 
            this.setState({dayStart: this.state.date})
        }
      }

      setTimeline = async (dayStart,dayOfWeek, days) => {
        var timeline = []
        getDay = (dayOfWeek, day) => {
            var temp = 0
            for(let i=0; i<dayOfWeek.length; i++){
              if(dayOfWeek[i] < (day.getDay() + 1))
                temp = 7 + dayOfWeek[i] - day.getDay() - 1
              else if (dayOfWeek[i] > (day.getDay() + 1))
                temp = dayOfWeek[i] - (day.getDay() + 1)
              else
                temp = 0
              let b = new Date(day.getFullYear(), day.getMonth(), day.getDate() + temp)
              timeline.push(b)
            }
          }
          await getDay(dayOfWeek,dayStart)
          timeline.sort(function (dayStart, b) {
              return dayStart.getDate() - b.getDate()
          })
          timeline.sort(function (dayStart, b) {
              return dayStart.getMonth() - b.getMonth()
          })
        plusDay = (timeline, days) => {
            const temp = days - timeline.length
            for(let i = 0; i<temp; i++){
              let b = new Date(timeline[i].getFullYear(), timeline[i].getMonth(), timeline[i].getDate() + 7)
              timeline.push(b)
            }
          }
          await plusDay(timeline,days)
          timeline.sort(function (dayStart, b) {
              return dayStart.getDate() - b.getDate()
          })
          timeline.sort(function (dayStart, b) {
              return dayStart.getMonth() - b.getMonth()
          })

          await this.setState({timeline: timeline})
    }

    setDayOfWeek (){
        let temp = []
        this.state.week.forEach(item => {
            if(item.isChecked == true){
                temp.push(item.id)
                console.log(item)
            }    
        })
        this.setState({dayOfWeek: temp})
    }

    addData= async() => {
        const {userID} = this.props
        await this.setDayOfWeek()
        await this.setTimeline(this.state.dayStart,this.state.dayOfWeek, this.state.days)
        await firestore().collection(`users/${userID}/lists`).add({
            class: this.state.class,
            group: this.state.group,
            days: this.state.days,
            dayStart: this.state.dayStart,
            dayOfWeek: this.state.dayOfWeek,
            timeline: this.state.timeline,
            timeStart: this.state.timeStart,
            isAllowToScan: false,
            timeEnd: this.state.timeEnd,
            done: false,
        })
        .then( () => {
            Alert.alert(
                "Thông báo",
                "Thêm danh sách thành công!",
                [{ text: "OK", onPress: () => this.props.toggleAddList() }]
              );
        })
    }
    render(){
        return(
            <Modal isVisible={this.props.isShowCreate} onBackdropPress={()=>this.props.toggleAddList()} style={{width: '100%', marginLeft: -1, marginTop: 140}}>
            <View style={styles.container}>
                <Text style={{fontSize: 28, fontWeight: 'bold', textAlign:'center', marginTop: 25}}>THÊM LỚP</Text>
                <View style={styles.inputBlock}>
                    <Text style={styles.textInput}>Tên môn</Text>
                    <TextInput 
                    style={styles.placeHolder}
                    onChangeText = {text => this.setState({class: text})}
                    value={this.state.class}
                    ></TextInput>
                </View>
                <View style={styles.inputBlock}>
                    <Text style={styles.textInput}>Tên lớp</Text>
                    <TextInput style={styles.placeHolder}
                    onChangeText = {text => this.setState({group: text})}
                    value={this.state.group}
                    ></TextInput>
                </View>
                <View style={styles.inputBlock}>
                    <Text style={styles.textInput}>Số buổi</Text>
                    <TextInput style={styles.placeHolder}
                    onChangeText = {text => this.setState({days: text})}
                    value={this.state.days}
                    ></TextInput>
                </View>
                <View style={styles.inputBlock}>
                    <Text style={styles.textInput}>Ngày bắt đầu</Text>
                    <DateTimePicker
                        minimumDate={new Date()}
                        mode='date'
                        value={this.state.date}
                        onChange={this.onChange}
                        style={{marginTop: 10}}
                    />
                </View>
                <View style={styles.inputBlock}>
                    <Text style={styles.textInput}>Ngày dạy trong tuần</Text>
                    <View style={styles.listCalendar}>
                        <FlatList
                            numColumns= {7}
                            data={this.state.week}
                            renderItem={({ item }) => 
                            <Day
                                data={item}
                                checked = { () => {                                
                                this.setState(prevState => ({
                                    week: prevState.week.map(
                                        ele => ele.id === item.id ? { ...ele, isChecked: !ele.isChecked } : ele
                                    )
                                    }))                                
                                }}
                            />}
                            keyExtractor={item => item.id}
                        />
                    </View>
                </View>
                <View style={styles.inputBlock}>
                    <View style={styles.time}>
                        <View style={[styles.inputBlock, {width: 180}]}>
                            <Text style={styles.textInput}>Giờ bắt đầu</Text>
                            <TextInput style={styles.placeHolder}
                            onChangeText = {text => this.setState({timeStart: text})}
                            value={this.state.timeStart}
                            ></TextInput>
                        </View>
                        <View style={[styles.inputBlock, {width: 180}]}>
                            <Text style={styles.textInput}>Giờ kết thúc</Text>
                            <TextInput style={styles.placeHolder}
                            onChangeText = {text => this.setState({timeEnd: text})}
                            value={this.state.timeEnd}
                            ></TextInput>
                        </View>
                    </View>
                </View>
                <View style={{alignItems: 'center', marginTop: 20}}>
                        <TouchableOpacity onPress={this.addData}>
                            <View style={styles.confirmBlock}>
                                <Text style={styles.confirmText}>Xác nhận</Text>
                            </View>
                        </TouchableOpacity>
                </View>
            </View>
            </Modal>
        )
    }
}
const styles = EStyleSheet.create({
    container:{
        flexDirection: 'column',
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },
    inputBlock:{
        marginTop: '1.5rem',
        marginHorizontal: '0.5rem',
    },
    textInput: {
        fontSize: '1.2rem',
        fontWeight: '600',
    },
    placeHolder: {
        height: '3.5rem',
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 10,
        paddingLeft: '1rem'
    },
    listCalendar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: '1rem'
    },
    calendarBlock: {
        flexDirection: 'column'
    },
    calendar: {
        height: '5rem',
        width: '5rem'
    },
    time:{
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    confirmBlock: {
        backgroundColor: '#67e2d9',
        height: '5rem',
        width: '18rem',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '5rem',
        borderRadius: 30
    },
    confirmDeleteBlock: {
        backgroundColor: 'red',
        height: '5rem',
        width: '18rem',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '5rem',
        borderRadius: 30
    },
    confirmText: {
        fontWeight: 'bold',
        fontSize: 20
    } 
})