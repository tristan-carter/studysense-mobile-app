import { StyleSheet } from 'react-native';
import colours from '../../config/colours.js';

export default StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colours.backgroundColour,
      gap: 15,
    },
    title: {
      fontSize: 24,
      fontFamily: 'Lato-Bold', fontWeight: '600',
      color: colours.subtitletext,
    },
    text: {
      fontSize: 18,
      fontFamily: 'Lato',
      color: colours.subtitletext,
    },
    settingsButton: {
      backgroundColor: colours.primary,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '80%',
    },
    buttonText: {
      color: 'white',
      fontSize: 18,
      fontFamily: 'Lato',
    },
    button: {
      backgroundColor: colours.primary,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      width: '90%',
      maxWidth: 300,
      borderWidth: 1.5,
      borderColor: colours.backgroundColour,
      backgroundColor: 'white',
      marginHorizontal: 20,
      paddingVertical: 20,
      paddingHorizontal: 18,
      borderRadius: 19,
      gap: 15,
      display: 'flex',
    },
    modalText: {
      fontSize: 18,
      marginBottom: 20,
      fontFamily: 'Lato',
    },
    divider: {
      height: 1.5,
      backgroundColor: '#ccc',
      width: '70%',
    },
    inputContainer: {
      gap: 9,
      display: 'flex',
    },
    inputLabel: {
        fontSize: 16,
        color: colours.subtitletext,
    },
    textInput: {
        backgroundColor: 'rgba(0, 0, 0, 0.04);',
        borderWidth: 1.5,
        borderColor: 'rgba(0, 0, 0, 0.05);',
        borderRadius: 4,
        paddingHorizontal: 10,
        paddingVertical: 8,
        fontSize: 15,
        fontFamily: 'Lato',
        textAlignVertical: 'top'
    },
    createButton: {
        backgroundColor: colours.primary,
        padding: 8,
        gap: 1,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    createButtonText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'Lato',
    },
    cancelButton: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
        width: 79,
        padding: 8,
        borderRadius: 10,
    },
    cancelButtonText: {
        color: '#7B6B5C',
        fontSize: 16,
        fontFamily: 'Lato',
    },
});