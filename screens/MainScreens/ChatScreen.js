import React from 'react'
import {TextInput, View, Image, ScrollView} from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
import { TouchableOpacity } from 'react-native-gesture-handler'
import firestore from '@react-native-firebase/firestore'

import Send from '../../images/send.png'
import Header from '../../components/Header'
import Message from '../../components/Message'

export default class ChatScreen extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            text: '',
            messages: []
        }
    }
    componentDidMount(){
        this.getData()
    }
    getData(){
        const {userID, classID} = this.props.route.params
        firestore()
        .collection(`classes/${classID}/messages`)
        .orderBy('createAt')
        .onSnapshot(snapshot => {
            let data = []
            snapshot.forEach( doc => {
                data.push({...doc.data(), id: doc.id})
            })

            this.setState({messages: data})
            console.log(data)
        })
    }
    chat() {
        const {classID, userID, userName} = this.props.route.params
        let user = userName
        if(!userName){
            user = 'Teacher'
        }
        this.setState({text: ''})
        if(this.state.text !== ''){
            firestore()
            .collection(`classes/${classID}/messages`)
            .add({
                createAt: firestore.FieldValue.serverTimestamp(),
                userID: userID,
                text: this.state.text,
                userName: user
            })
        }
    }
    render(){
        const {name,classID, userID} = this.props.route.params
        return(
            <View style={{height: '100%', backgroundColor: '#fff'}}>
                <Header 
                name={`${name}`} 
                buttonBack={() => this.props.navigation.goBack()} 
                iconBack='Back'
                ></Header>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={styles.scroll}
                    ref={ref => {this.scrollView = ref}}
                    onContentSizeChange={() => this.scrollView.scrollToEnd({animated: true})}
                >
                    {this.state.messages.map(msg => <Message time={msg.createAt} userName={msg.userName}  userID={userID}  msgID={msg.userID} text={msg.text}></Message>)}
                </ScrollView>
                <View style={styles.bottom}>
                    <TextInput
                        style={styles.input}
                        placeholder="Aa"
                        onChangeText={text => this.setState({ text })}
                        value={this.state.text}
                    ></TextInput>
                    <TouchableOpacity onPress={() => this.chat()}>
                        <Image source={Send} style={styles.send}></Image>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = EStyleSheet.create({
    scroll: {
        marginBottom: '7.5rem',
    },
    bottom:{
        flexDirection: 'row',
        width: '100%',
        height: '7.5rem',
        paddingTop: '1rem',
        position: 'absolute',
        bottom: 0,
        backgroundColor: '#fff',
    },
    input: {
        marginLeft: '2rem',
        marginRight: '1rem',
        borderWidth: 1,
        width: '32rem',
        borderRadius: 20,
        height: '4rem',
        paddingLeft: '1rem',
        padding: '1rem',
        fontSize: '1.8rem'
    },
    send: {
        height: '4rem',
        width: '4rem'
    }
})