import { StyleSheet } from 'react-native';
import colours from '../../config/colours.js';

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: colours.backgroundColour,
    },
    title: {
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
                fontFamily: 'Lato',
fontSize: 16,
        fontWeight: "bold"
    },
    footerView: {
        flex: 1,
        alignItems: "center",
        marginTop: 20
    },
    footerText: {
                fontFamily: 'Lato',
fontSize: 16,
        color: '#2e2e2d'
    },
    footerLink: {
        color: colours.primary,
        fontWeight: "bold",
                fontFamily: 'Lato',
fontSize: 16
    }
})