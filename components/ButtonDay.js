import React from 'react'
import {Text, TouchableOpacity} from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'

export default class Button extends React.Component{
    constructor(props){
        super(props)
    }
    dayOfWeek(day){
        if(day===0)
            return "Chủ Nhật"
        if(day===1)
            return "Thứ Hai"
        if(day===2)
            return "Thứ Ba"
        if(day===3)
            return "Thứ Tư"
        if(day===4)
            return "Thứ Năm"
        if(day===5)
            return "Thứ Sáu"
        if(day===6)
            return "Thứ Bảy"
    }
    render(){
        const {data, onPress, total, checkedCount} = this.props
        const day = new Date(data.toDate())
        return(
            <TouchableOpacity style={styles.container} onPress={onPress}>
                <Text style={[styles.name, {paddingTop: 20}]}>{this.dayOfWeek(day.getDay())}: {day.getDate()}/{day.getMonth() + 1}/{day.getFullYear()}</Text>
                <Text style={[styles.name, {paddingBottom: 20}]}>Đi học: {checkedCount}/{total}</Text>
            </TouchableOpacity>
        )
    }
}

const styles = EStyleSheet.create({
    container:{
        backgroundColor: '#67e2d9',
        borderRadius: 30,
        marginTop: '2.5rem',
        paddingHorizontal: '4rem',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '0.5rem'
    },
    name: {
        fontWeight: '600',
        fontSize: 20,
        paddingBottom: '1rem',
        alignSelf: 'center',
        textAlign: 'center'
    }
})