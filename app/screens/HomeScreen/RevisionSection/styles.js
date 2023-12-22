import { StyleSheet } from 'react-native';
import colours from '../../../config/colours.js';

export default StyleSheet.create({
    container: {
        flex: 1,
        paddingVerticle: 5,
        paddingHorizontal: 18,
        backgroundColor: colours.backgroundColour,
        alignItems: 'center',
    },
    subtitleText: {
        fontSize: 20,
        fontFamily: 'Lato-Bold', fontWeight: '600',
        color: colours.subtitletext,
        marginBottom: 23,
    },
    revisionOptionsContainer: {
        marginTop: 10,
        marginBottom: 10,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        flexDirection: 'column',
        flex: 1,
    },
    revisionOption: {
        width: '100%',
        padding: 10,
        alignItems: 'center',
        borderRadius: 13,
        backgroundColor: colours.secondary,
        flexDirection: 'row',
        display: 'flex',
        gap: 10,
        borderWidth: 1,
        borderColor: `rgba(0, 0, 0, 0.02)`,
    },
    revisionOptionIcon: {
        width: 50,
        height: 50,
    },
    revisionOptionsTextContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 4,
        alignItems: 'flex-start',
    },
    revisionOptionTitle: {
        fontFamily: 'Lato-Bold', fontWeight: '600',
        fontSize: 21,
        color: colours.primarytext,
    },
    revisionOptionDescription: {
        fontFamily: 'Lato',
        fontSize: 12,
        color: colours.secondarytext,
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'Bold', fontWeight: '600',
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
        fontWeight: 'Bold', fontWeight: '600',
    },
    restartContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: colours.backgroundColour,
    },
}) 