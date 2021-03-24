import React, { Component } from "react";
import {
    StyleSheet,
    View,
    ActivityIndicator
} from "react-native";
import Layout from '../constants/Layout'
import Colors from '../constants/Colors'

export default ActivitysIndicator = () => {
    return (
        <View style={[styles.container]}>
            <ActivityIndicator color={Colors.tintColor} size="large" />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: Layout.window.width,
        height: Layout.window.height,
        position: 'absolute',
        justifyContent: 'center',
        backgroundColor: 'rgba(52, 52, 52, 0)',
        bottom: 0
    }
});

