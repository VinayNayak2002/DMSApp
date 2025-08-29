import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';
import { generateOtp, validateOtp } from '../services/api';

export default function LoginScreen() {
    const [mobile, setMobile] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');

    const handleSendOtp = async () => {
        if (mobile.trim().length !== 10) {
            Alert.alert('Invalid Number', 'Please enter a valid 10-digit mobile number');
            return;
        }

        try {
            await generateOtp(mobile);
            setOtpSent(true);
            Alert.alert('OTP Sent', `OTP has been generated for ${mobile}`);
        } catch (error) {
            console.log(error);
            Alert.alert('Error', 'Failed to send OTP');
        }
    };

    const handleVerifyOtp = async () => {
        if (otp.trim().length === 0) {
            Alert.alert('Enter OTP', 'Please enter the OTP received');
            return;
        }

        try {
            await validateOtp(mobile, otp);
            Alert.alert('OTP Verified', `Mobile: ${mobile}, OTP: ${otp}`);
        } catch (error) {
            console.log(error);
            Alert.alert('Error', 'Failed to verify OTP');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Document Management Login</Text>

            {!otpSent && (
                <>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter Mobile Number"
                        keyboardType="number-pad"
                        value={mobile}
                        onChangeText={setMobile}
                        maxLength={10}
                    />

                    <TouchableOpacity style={styles.button} onPress={handleSendOtp}>
                        <Text style={styles.buttonText}>Send OTP</Text>
                    </TouchableOpacity>
                </>
            )}

            {otpSent && (
                <>
                    <Text style={styles.otpLabel}>Enter OTP:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="OTP"
                        keyboardType="number-pad"
                        value={otp}
                        onChangeText={setOtp}
                        maxLength={6}
                    />

                    <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
                        <Text style={styles.buttonText}>Verify OTP</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 22,
        marginBottom: 20,
        fontWeight: '600',
        color: '#333',
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#aaa',
        padding: 12,
        borderRadius: 8,
        marginBottom: 20,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#4CAF50',
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    otpLabel: {
        fontSize: 18,
        marginBottom: 10,
        fontWeight: '500',
    },
});