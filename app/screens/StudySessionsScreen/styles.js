import colours from "../../config/colours";
const styles = {
    container: {
        flex: 1,
        backgroundColor: colours.backgroundColour,
        alignItems: 'center',
        paddingHorizontal: 25,
        gap: 18,
    },
    currentSessionView: {
        backgroundColor: colours.backgroundAccent,
        borderRadius: 11,
        padding: 9,
        width: '100%',
        alignItems: 'flex-start',
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: 5,
        shadowOffset: {width: -2, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 3,
        shadowColor: colours.shadowDarkColour,
        elevation: 8,
    },
    currentSessionTextContainer: {
        display: 'flex',
        width: '100%',
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    currentSessionEditButton: {
        backgroundColor: colours.blue,
        borderRadius: 10,
        paddingVertical: 2,
        paddingHorizontal: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    currentSessionEditText: {
        color: colours.black,
        fontSize: 12,
        fontFamily: 'Lato-Regular',
    },
    currentSessionTitle: {
        fontSize: 19,
        fontFamily: 'Lato-Regular',
        color: colours.black,
    },
    currentSessionText: {
        fontSize: 14,
        fontFamily: 'Lato-Regular',
        color: colours.secondarytext,
    },

    button: {
        backgroundColor: colours.primary,
        padding: 8,
        borderRadius: 11,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        
        shadowOffset: {width: -2, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 3,
        shadowColor: colours.shadowDarkColour,
        elevation: 8,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'Lato',
    },
}
export default styles;