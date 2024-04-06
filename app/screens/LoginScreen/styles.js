import { StyleSheet } from 'react-native';
import colours from '../../config/colours.js';

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: colours.backgroundColour,
    },
    title: {
        fontSize: 24,
         fontWeight: '600',
        color: colours.subtitletext,
    },
    logo: {
        flex: 1,
        height: 120,
        width: 120,
        alignSelf: "center",
        margin: 30
    },
    input: {
        height: 48,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: colours.white,
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 30,
        marginRight: 30,
        paddingLeft: 16
    },
    button: {
        backgroundColor: colours.primary,
        marginLeft: 30,
        marginRight: 30,
        marginTop: 20,
        height: 48,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: 'center'
    },
    buttonTitle: {
        color: colours.text,
        fontSize: 16,
        fontWeight: "bold"
    },
    footerView: {
        flex: 1,
        alignItems: "center",
        marginTop: 20
    },
    footerText: {
        fontSize: 16,
        color: '#2e2e2d'
    },
    footerLink: {
        color: colours.primary,
        fontWeight: "bold",
        fontSize: 16
    },
    forgotPasswordText: {
        fontSize: 16,
        color: colours.primary,
        fontWeight: "bold"
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
        backgroundColor: colours.white,
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
        
        color: colours.subtitletext,
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
        color: colours.text,
        fontSize: 18,
        
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
        
    },
})