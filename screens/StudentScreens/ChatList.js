import React from 'react'
import {View, FlatList, Alert} from 'react-native'
import firestore from '@react-native-firebase/firestore'
import EStyleSheet from 'react-native-extended-stylesheet'
import Header from '../../components/Header'
import ChatButton from '../../components/ChatButton'



export default class ChatList extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            data :[]
        }
    }

    componentDidMount(){
        this.getData()
    }

    getData = () => {
        const {userID} = this.props.route.params
        firestore()
        .collection(`students/${userID}/classes`)
        .onSnapshot(snapshot => {
            let data = []
            snapshot.forEach( doc => {
                data.push({...doc.data(), id: doc.id})
            })
            this.setState({data: data})
        })
    }
    goChat(userName, classID, name){
        const {userID} = this.props.route.params
        this.props.navigation.navigate('Chat', {userName: userName, userID: userID, classID: classID, name: name})
    }
    delete(doc, name){
        const {userID} = this.props.route.params
        Alert.alert(
            `${name}`,
            "Bạn chắc chắn muốn xoá lớp?",
            [
              {
                text: "Cancel",
                style: "cancel"
              },
              { text: "OK", onPress: () => {
                firestore()
                .collection(`students/${userID}/classes`)
                .doc(`${doc}`)
                .delete()
              } }
            ]
          );
        
    }
    render(){
        const {name} = this.props.route.params
        return(
                <View>
                    <Header 
                    name='Danh sách các lớp'
                    buttonBack={() => this.props.navigation.goBack()} 
                    iconBack='Back'
                    ></Header>
                    <FlatList
                    data={this.state.data}
                    renderItem={({ item }) => (
                        <ChatButton
                        name={item.name}
                        dayStart={item.dayStart}
                        onPress={() => this.goChat(name, item.id, item.name)}
                        onLongPress={() => this.delete(item.id, item.name)}
                        ></ChatButton>
                      )}
                    keyExtractor={item => item.id}
                />
                </View>
        )
    }
}

const styles = EStyleSheet.create({
    
})