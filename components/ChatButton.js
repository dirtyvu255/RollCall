import React from 'react'
import {Text, TouchableOpacity} from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'

export default class ChatButton extends React.Component{
    constructor(props){
        super(props)
    }
    render(){
        const {name, dayStart, onPress, onLongPress} = this.props
        return(
            <TouchableOpacity style={styles.container} onPress={onPress} onLongPress={onLongPress}>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.name}>{dayStart}</Text>
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
        marginBottom: '0.5rem',
        marginHorizontal: '5rem'
    },
    name: {
        fontWeight: '600',
        fontSize: 20,
        padding: '1rem',
        alignSelf: 'center',
        textAlign: 'center'
    }
})