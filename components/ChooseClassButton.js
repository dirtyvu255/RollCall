import React from 'react'
import {Text, TouchableOpacity} from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'

export default class Button extends React.Component{
    constructor(props){
        super(props)
    }
    checkDone(done){
        if(done) {
            return styles.containerDone
        }
        else {
            return styles.containerUnDone
        }
    }
    render(){
        const {item, onPress, done, onLongPress} = this.props
        const day = new Date(item.dayStart.toDate())
        return(
            <TouchableOpacity style={this.checkDone(done)} onPress={onPress} onLongPress={onLongPress}>
                    <Text style={[styles.name, {marginBottom: 5, textTransform: 'uppercase'}]}>{item.class}</Text>
                    <Text style={[styles.name, {marginBottom: 5}]}>{item.group}</Text>
                    <Text style={styles.name}>{day.getDate()}/{day.getMonth() + 1}/{day.getFullYear()}</Text>
            </TouchableOpacity>
        )
    }
}

const styles = EStyleSheet.create({
    containerDone:{
        backgroundColor: '#ad343e',
        borderRadius: 30,
        width: '30rem',
        marginTop: '2.5rem',
        paddingVertical: '2.2rem'
    },
    containerUnDone:{
        backgroundColor: '#67e2d9',
        borderRadius: 30,
        width: '30rem',
        marginTop: '2.5rem',
        paddingVertical: '2.2rem'
    },
    name: {
        fontWeight: 'bold',
        fontSize: 20,
        alignSelf: 'center',
        textAlign: 'center'
    }
})