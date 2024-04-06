import { StyleSheet } from 'react-native';
import colours from '../../../config/colours.js';

export default StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 18,
        backgroundColor: colours.backgroundColour,
        alignItems: 'center',
    },
    subtitleText: {
        fontSize: 20,
        fontWeight: '500',
        color: colours.subtitletext,
        marginBottom: 11,
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
        padding: 11,
        alignItems: 'center',
        borderRadius: 11,
        backgroundColor: colours.backgroundAccent,
        flexDirection: 'row',
        display: 'flex',
        gap: 10,
        borderWidth: 1.5,
        borderColor: `rgba(0, 0, 0, 0.005)`,
        shadowOffset: {height: 2},
        shadowOpacity: 0.01,
        shadowRadius: 3,
        shadowColor: colours.shadowColour,
        elevation: 6,
    },
    revisionOptionIcon: {
        width: 42,
        height: 42,
    },
    revisionOptionsTextContainer: {
        display: 'flex',
        flex: 1,
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 4,
        alignItems: 'flex-start',
    },
    revisionOptionTitle: {
        
        fontWeight: '500',
        fontSize: 21,
        color: colours.black,
    },
    revisionOptionDescription: {
        
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
        fontWeight: '600',
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
        fontWeight: '600',
    },
    restartContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: colours.backgroundColour,
    },
}) 