import React from 'react'
import {View, Text} from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
export default class Message extends React.Component{
    constructor(props){
        super(props)
    }

    render(){
        const {text, userID, msgID, userName} = this.props
        console.log(userName)
        return(
            <View >
                {userID === msgID ? (
                    <View style={styles.sentCon}>
                        <View style={styles.sentCon1}>
                            <Text style={styles.sent}>{text}</Text>
                        </View>
                    </View>
                ): 
                    <View>
                        <Text style={styles.userName}>{userName}</Text>
                        <View style={styles.receivedCon}>
                            <View style={styles.receivedCon1}>
                            <Text style={styles.received}>{text}</Text>
                            </View>
                        </View>
                    </View>
                }
            </View>
        )
    }
}

const styles = EStyleSheet.create({
    sentCon: {
        alignSelf: 'flex-end',
        marginRight: '1rem'
    },
    sentCon1: {
        alignSelf: 'flex-end',
        backgroundColor: '#67e2d9',
        margin: '1rem',
        padding: '1rem',
        borderRadius: 20,
    },
    receivedCon:{
        alignSelf: 'flex-start',
        marginLeft: '1rem'
    },
    receivedCon1:{
        backgroundColor: '#8e8795',
        margin: '1rem',
        padding: '1rem',
        borderRadius: 20,
        width: '70%'
    },
    sent: {
        alignSelf: 'flex-end',
        marginHorizontal: '1rem',
        fontSize: '1.5rem',
        textAlign: 'left'
    },
    received: {
        alignSelf: 'flex-start',
        marginHorizontal: '1rem',
        fontSize: '1.5rem',
        textAlign: 'left'
    },
    userName: {
        marginLeft: '2rem',
        fontSize: '1.5rem',
        color: 'grey'
    }
})