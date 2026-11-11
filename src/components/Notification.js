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
