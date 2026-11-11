//Programa notificiaciones
import * as Notifications from 'expo-notifications';
//Permite saber si la app corre en un dispositivo físico
import * as Device from 'expo-device';
//Obtiene valores de la configuración de Expo, como el ID del proyecto
import Constants from 'expo-constants';
import { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Platform } from 'react-native';

//Configura cómo se muestran las notificaciones
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

//Obtiene los permisos
async function registerForPushNotificationsAsync() {
    let token;
    if(Platform.OS === "android"){
        //Por alguna razón quitando esto ya no da error
        // await Notifications.setNotificationChannelAsync("default", {
        //     name: "General",
        //     importance: Notifications.AndroidImportance.MAX
        // })
    }

    //Confirma si es un dispositivo físico
    if (Device.isDevice){
        //Consulta los permisos
        const {status: existingStatus} = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        //Si no están concedidos, los solicita
        if(existingStatus !== "granted"){
            const {status} = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        //Si el usuario no concede los permisos, muestra un aviso y se termina
        if(finalStatus !== "granted"){
            alert("Permiso para notificaciones denegado");
            return;
        }

        try {
            const projectId = Constants?.expoConfig?.extra?.eas?.projectId;
            //Intenta obtener el token de Expo
            token = (await Notifications.getExpoPushTokenAsync({projectId,})).data;
            console.log('Token del dispositivo:', token);

        } catch (e) {
            console.log('No se pudo obtener el token:', e.message);
        }
    }else{
        //Si no es un dispositivo físico muestra un aviso y no obtiene el token
        alert('Debes usar un dispositivo físico para notificaciones');
    }
    return token;
}

//Notificación local
async function scheduleNotification() {
    //await espera a que Expo confirme que quedó programada
    await Notifications.scheduleNotificationAsync({
        //Define el título y el cuerpo de la notificación
        content: {
            title: 'Notificación',
            body: 'Esta es una prueba de notificación local.',
        },
        //Indica cuándo mostrarla (dentro de 5 segundos en este caso)
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: 5,
        },
    });
    console.log('Notificación programada para dentro de 5 s');
}

export default function Notification(){
    const [token, setToken] = useState(null);

    //Intenta registrar permisos/token al montar el componente
    useEffect(() => {
        //Actualiza el estado del token
        //Si es null muestra "Sin token"
        registerForPushNotificationsAsync().then(t => setToken(t ?? 'Sin token'));
        //El arreglo vacío indica que no depende de valores que deban cambiar
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Token de dispositivo:</Text>
            {/*selectable permite seleccionar y copiar el texto del token*/}
            {/*Mientras carga muestra en pantalla "Obtenierdo..."*/}
            <Text selectable>{token ?? 'Obteniendo...'}</Text>
            <Button style={styles.btn}
                title="Programar notificación"
                onPress={scheduleNotification}
            />
        </View>
    )
}

const styles = StyleSheet.create(({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        //Separa lo que aparece en la pantalla
        gap: 18
    },

    title: {
        fontWeight: "bold"
    }
}))