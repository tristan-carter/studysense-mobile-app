import { StyleSheet } from 'react-native';
import colours from '../../../../config/colours';

export default StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: colours.backgroundColour,
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: colours.subtitletext,
    },
    description: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
        color: colours.secondarytext,
    },
    button: {
        backgroundColor: colours.primary,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    buttonText: {
        color: colours.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
});