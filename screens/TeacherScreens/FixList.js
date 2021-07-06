import React from 'react'
import {View, Text, TextInput, FlatList, TouchableOpacity, Alert} from 'react-native'
import Day from '../../components/Day'
import EStyleSheet from 'react-native-extended-stylesheet'
import firestore from '@react-native-firebase/firestore'
import DateTimePicker from '@react-native-community/datetimepicker'
import Modal from 'react-native-modal'

export default class FixList extends React.Component{
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
    componentDidMount(){
        const item = this.props.item
        for(let i = 0; i < item.dayOfWeek.length; i++){
            let id = item.dayOfWeek[i]
            this.setState(prevState => ({
                week: prevState.week.map(
                    ele => ele.id === id ? { ...ele, isChecked: !ele.isChecked } : ele
                )
                }))
        }
        this.setState({class: item.class, dayStart: item.dayStart.toDate(), days: item.days, group: item.group, timeEnd: item.timeEnd, timeStart: item.timeStart})
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
            }    
        })
        this.setState({dayOfWeek: temp})
    }
    updateData = async() => {
        const {userID, classID} = this.props
        await this.setDayOfWeek()
        await this.setTimeline(this.state.dayStart,this.state.dayOfWeek, this.state.days)
        await  firestore().collection(`users/${userID}/lists`).doc(`${classID}`).update({
            'class': this.state.class,
            'group': this.state.group,
            'days': this.state.days,
            'dayStart': this.state.dayStart,
            'dayOfWeek': this.state.dayOfWeek,
            'timeline': this.state.timeline,
            'timeStart': this.state.timeStart,
            'timeEnd': this.state.timeEnd
        })
        Alert.alert(
            "Thông báo",
            "Đã cập nhật!!",
            [{ text: "OK", onPress: () => this.props.toggleFixList() }]
          );
    }
    deleteData = async() => {
        const {userID,classID} = this.props
        await  firestore().collection(`users/${userID}/lists`).doc(`${classID}`).update({
            done : true
        })
        Alert.alert(
            "Thông báo",
            "Đã kết thúc!!",
            [{ text: "OK", onPress: () =>  this.props.toggleFixList()}]
          );
    }
    render(){
        return(
            <Modal isVisible={this.props.isShowEdit} style={{width: '100%', marginLeft: -1, marginTop: 140}} onBackdropPress={()=>this.props.toggleFixList()}>
            <View style={styles.container}>
                <Text style={{fontSize: 25, fontWeight: 'bold', textAlign:'center', marginTop: 25}}>THAY ĐỔI THÔNG TIN</Text>
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
                    <TextInput 
                    style={styles.placeHolder}
                    onChangeText = {text => this.setState({group: text})}
                    value={this.state.group}
                    ></TextInput>
                </View>
                <View style={styles.inputBlock}>
                    <Text style={styles.textInput}>Số buổi</Text>
                    <TextInput 
                    style={styles.placeHolder}
                    onChangeText = {text => this.setState({days: text})}
                    value={this.state.days}
                    >
                    </TextInput>
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
                <View style={styles.time}>
                    <View style={[styles.inputBlock, {width: 180}]}>
                        <Text style={styles.textInput}>Giờ bắt đầu</Text>
                        <TextInput 
                        style={styles.placeHolder}
                        onChangeText = {text => this.setState({timeStart: text})}
                        value={this.state.timeStart}
                        ></TextInput>
                    </View>
                    <View style={[styles.inputBlock, {width: 180}]}>
                        <Text style={styles.textInput}>Giờ kết thúc</Text>
                        <TextInput 
                        style={styles.placeHolder}
                        onChangeText = {text => this.setState({timeEnd: text})}
                        value={this.state.timeEnd}
                        ></TextInput>
                    </View>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 6}}>
                    <TouchableOpacity onPress={this.updateData} style={{alignItems: 'center', marginTop: 20,marginRight: 10}}>
                        <View style={styles.confirmBlock}>
                            <Text style={styles.confirmText}>Xác nhận</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.deleteData} style={{alignItems: 'center', marginTop: 20, marginLeft:10}}>
                        <View style={styles.confirmDeleteBlock}>
                            <Text style={styles.confirmText}>Kết thúc lớp</Text>
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
        fontSize: '1.5rem',
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