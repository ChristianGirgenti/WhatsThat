import { StyleSheet} from 'react-native';

export default StyleSheet.create({
 container:{
    flex: 1,
    backgroundColor: '#1e9c6d',
    alignItems: 'center',
    //padding: '25%',
    justifyContent: 'center'
 },

 textInputBox:{
    backgroundColor: 'white',
    padding: 5,
    marginVertical: 10,
    borderRadius: 4,
    width: '80%'
},

 baseText: {
    fontSize: 14,
    fontWeight: 'normal'
 },

 button: {
    padding: 5,
    backgroundColor: 'red',
    borderRadius: 4, 
    alignSelf: 'center',
    marginTop: 20,
 },

 buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    alignSelf: 'center'
 },

 errorText: {
    color: '#ed1c5c',
    fontSize: 8
  },

 errorBox:{
    borderLeftColor: '#ed1c5c',
    borderColor: '#ffedf3',
    borderWidth: 1,
    borderLeftWidth: 3,
    backgroundColor: '#ffedf3',
    alignSelf: 'center',
    marginVertical: 10,
    width: '100%',
    padding: 3
  }
});