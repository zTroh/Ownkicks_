import React, { Component } from "react";
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
} from "react-native";
import Layout from '../constants/Layout'
import { BackButtonIcon } from './TabBarIcon'
import Colors from '../constants/Colors'

export default Header =({style,goback,goForward,backButtonEnabled,forwardButtonEnabled,title, ...others}) => {
    return (
        <View style={[style,styles.container]}>
            <TouchableOpacity style={styles.backButtonEnabled} onPress={goback}>
                {backButtonEnabled && (<BackButtonIcon name={'chevron-left'} />)}
            </TouchableOpacity>
            <View style={styles.titleContianer}>
                <Text style={styles.text}>{title}</Text>
            </View>
            <TouchableOpacity style={styles.forwardButtonEnabled} onPress={goForward}>
                {forwardButtonEnabled && (<BackButtonIcon name={'chevron-right'} />)}
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: Layout.window.width,
        height: Layout.headerHeight,
        flexDirection: 'row',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    backButtonEnabled: {
        width: Layout.headerIconWidth,
        height: Layout.headerIconHeight,
        alignItems: 'center',
        justifyContent: 'center'
    },
    titleContianer: {
        flex: 1,
        alignSelf: 'center',
        alignItems: 'center'
    },
    text: {
        fontSize: Layout.headerFontSize,
        fontWeight: 'bold',
        color: Colors.tintColor
    },
    forwardButtonEnabled: {
        width: Layout.headerIconWidth,
        height: Layout.headerIconHeight,
        alignSelf: 'flex-end',
        alignItems: 'center',
        justifyContent: 'center'
    }
});

