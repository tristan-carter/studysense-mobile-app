import colours from "../../config/colours";
const styles = {
    container: {
        flex: 1,
        backgroundColor: colours.backgroundColour,
        alignItems: 'center',
        paddingHorizontal: 15,
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
        gap: 6,
        shadowOffset: {width: -2, height: 2},
        shadowOpacity: 0.03,
        shadowRadius: 3,
        shadowColor: '#D0D0D0',
        elevation: 5,
    },
    currentSessionTextContainer: {
        display: 'flex',
        width: '100%',
        flexDirection: 'row',
        gap: 10,
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
}
export default styles;