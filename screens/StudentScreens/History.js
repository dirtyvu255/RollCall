import React from 'react'
import {View, FlatList, Text} from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
import Header from '../../components/Header'
import firestore from '@react-native-firebase/firestore'
export default class History extends React.Component{
    constructor(props){
        super(props)
        this.state={
            history: [],
        }
    }
    componentDidMount(){
        this.getData()
    }

    getData = () => {
        const {userID} = this.props.route.params
        firestore()
        .collection(`students/${userID}/history`)
        .onSnapshot(snapshot => {
            let data = []
            snapshot.forEach( doc => {
                data.push({...doc.data(), id: doc.id})
            })
            this.setState({history: data})
        })
    }
   

    render(){
        return(
            <View>
                <Header 
                name='Lịch sử đi học'
                buttonBack={() => this.props.navigation.goBack()} 
                iconBack='Back'
                ></Header>
                <FlatList
                    data={this.state.history}
                    renderItem={({ item }) => (
                        <Text>{item.class}: {item.time}</Text> 
                      )}
                    keyExtractor={item => item.id}
                />
            </View>
        )
    }
}

const styles = EStyleSheet.create({
    info: {
        fontSize: 18,
    }
})