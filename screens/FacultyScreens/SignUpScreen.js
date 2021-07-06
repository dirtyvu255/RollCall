import React from 'react'
import {Text, TextInput, View, TouchableOpacity, ScrollView, Image, FlatList, Alert} from 'react-native'
import auth from '@react-native-firebase/auth'
import EStyleSheet from 'react-native-extended-stylesheet'
import Role from '../../components/Role'
import Logo from '../../images/logo.png'
import Student from '../../images/student.png'
import Teacher from '../../images/teacher.png'
import Faculty from '../../images/faculty.png'
import Header from '../../components/Header'
export default class SignUp extends React.Component {
  state = { 
    email: '', password: '', errorMessage: null, role: '', confirmPassword: '',
    roles: [
      {
          id: 'Faculty',
          name: 'Khoa',
          isChecked: false,
          image: Faculty,
      },
      {
          id: 'Teacher',
          name: 'Giảng viên',
          isChecked: false,
          image: Teacher
      },
      {
          id: 'Student',
          name: 'Sinh viên',
          isChecked: false,
          image: Student
      },
    ]
  }
handleSignUp = () => {
  auth()
  .createUserWithEmailAndPassword(this.state.email, this.state.password)
  .then(
    userCredentials => {
      return userCredentials.user.updateProfile({
        displayName: this.state.role.id
      })
    }
  )
  .catch(error => this.setState({ errorMessage: error.message }))
  Alert.alert("Đã tạo tài khoản!!");
}
isChecked(item) {
  this.setState(prevState => ({
    roles: prevState.roles.map(
        ele => ele.id === item.id ? { ...ele, isChecked: !ele.isChecked} : ele
    )
  }))
}
setRole() {
  this.setState(prevState => ({
    role: prevState.roles.find(
      ele => ele.isChecked === true
    )
  }))
}

render() {
  console.log(this.state.role)
    return (
      <View style={styles.mainContainer}>
        <Header 
        buttonBack={() => this.props.navigation.goBack()} 
        iconBack='Back'
        ></Header>
        <ScrollView>
        <View style={{alignItems: 'center', marginTop: 30}}>
          <Image source={Logo} style={styles.logoBLock}/>
        </View>
        <View style={styles.container}>
          {this.state.errorMessage &&
            <Text style={{ color: 'red' }}>
              {this.state.errorMessage}
            </Text>}
          <Text style={styles.textInputTitle}>Email</Text>
          <TextInput
            style={styles.textInput}
            autoCapitalize="none"
            placeholder="Nhập email"
            onChangeText={email => this.setState({ email })}
            value={this.state.email}
          />
          <Text style={styles.textInputTitle}>Mật khẩu</Text>
          <TextInput
            secureTextEntry
            style={styles.textInput}
            autoCapitalize="none"
            placeholder="Nhập mật khẩu"
            onChangeText={password => this.setState({ password })}
            value={this.state.password}
          />
          <Text style={styles.textInputTitle}>Xác nhận mật khẩu</Text>
          <TextInput
            secureTextEntry
            style={styles.textInput}
            autoCapitalize="none"
            placeholder="Nhập lại mật khẩu"
            onChangeText={confirmPassword => this.setState({ confirmPassword })}
            value={this.state.confirmPassword}
          />
          <View style={styles.listCalendar}>
            <FlatList
              numColumns= {3}
              data={this.state.roles}
              renderItem={({ item }) => 
              <Role
                data={item}
                checked = { () => {
                this.isChecked(item),
                this.setRole()
                }}
              />}
              keyExtractor={item => item.id}
            />
            </View>
          <View style={{alignItems: 'center', marginTop: 20}}>
            <TouchableOpacity onPress={this.handleSignUp}>
                <View style={styles.confirmBlock}>
                    <Text style={styles.confirmText}>Xác nhận</Text>
                </View>
            </TouchableOpacity>          
          </View>
        </View>
        </ScrollView>
        </View>
    )
  }
}
const styles = EStyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    justifyContent: 'center',
  },
  container: {
    marginHorizontal: '5rem',
  },
  logoBLock: {
    height: '22rem',
    width: '28rem',
  },
  textInputTitle: {
    fontWeight: '600',
    fontSize: 15,
    marginVertical: '0.5rem',
    marginTop: '1rem'
  },
  textInput: {
    height: '4.5rem',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 15,
    paddingLeft: '1rem',
  },
  listCalendar: {
    marginTop: '2.5rem',
    flexDirection: 'row',
    justifyContent: 'space-between',
    //marginLeft: 20
},
  loginBlock: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmBlock: {
    backgroundColor: '#67e2d9',
    height: '5rem',
    width: '18rem',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '5rem',
    borderRadius: 100
  },
  confirmText: {
    fontWeight: 'bold',
    fontSize: 20
}
})