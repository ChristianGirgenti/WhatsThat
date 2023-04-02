import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  mainContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#e1e1e1',
  },

  textInputBox: {
    backgroundColor: 'white',
    padding: 10,
    marginVertical: 15,
    borderRadius: 4,
    width: '74%',
  },

  baseText: {
    fontSize: 18,
    fontWeight: 'normal',
  },

  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },

  button: {
    padding: 5,
    backgroundColor: 'red',
    borderRadius: 4,
    alignSelf: 'center',
    marginTop: 20,
    width: '37%',
  },

  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    alignSelf: 'center',
  },

  errorText: {
    color: '#ed1c5c',
    fontSize: 16,
    fontWeight: 'normal',
  },

  errorBox: {
    flexDirection: 'row',
    borderLeftColor: '#ed1c5c',
    borderColor: '#ffedf3',
    borderWidth: 1,
    borderLeftWidth: 3,
    backgroundColor: '#ffedf3',
    alignSelf: 'center',
    marginVertical: 10,
    width: '74%',
    padding: 10,
  },
  errorIcon: {
    marginRight: 15,
    alignSelf: 'center',
  },
  navigationHeaderTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 24,
    textAlign: 'center',
  },
  navigationHeaderSection: {
    backgroundColor: '#25D366',
    justifyContent: 'center',
    textAlign: 'center',
    flex: 1,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  wrapper: {
    flex: 15,
  },
});
