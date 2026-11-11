import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Platform } from 'react-native';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        //Muestra el banner incluso cuando la app está abierta
        shouldShowBanner: true,
        //La deja en el centro de notificaciones
        shouldShowList: true,
        //Reproduce sonido (false en este caso)
        shouldPlaySound: false,
        //Número rojo sobre el icono
        shouldSetBadge: false,
    }),
});

async function registerForPushNotificationsAsync() {
    let token;
    if(Platform.OS === "android"){
        await Notifications.setNotificationChannelAsync("default", {
            name: "General",
            importance: Notifications.AndroidImportance.MAX
        })
    }

    if (Device.isDevice){
        const {status: existingStatus} = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if(existingStatus !== "granted"){
            const {status} = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if(finalStatus !== "granted"){
            alert("Permiso para notificaciones denegado");
            return;
        }

        try {
            const projectId = Constants?.expoConfig?.extra?.eas?.projectId;
            token = (await Notifications.getExpoPushTokenAsync({projectId,})).data;
            console.log('Token del dispositivo:', token);

        } catch (e) {
            console.log('No se pudo obtener el token:', e.message);
        }
    }else{
        alert('Debes usar un dispositivo físico para notificaciones');
    }
    return token;
}

export default function Notification(){
    const [token, setToken] = useState(null);

    useEffect(() => {
        registerForPushNotificationsAsync().then(t => setToken(t ?? 'Sin token'));
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Token de dispositivo:</Text>
            <Text selectable>{token ?? 'Obteniendo...'}</Text>
            <Button
                title="Programar notificación"
                onPress={scheduleNotification}
            />
        </View>
    )
}