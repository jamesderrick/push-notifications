const checkPermission = () => {
    console.log('checking permissions')
    if(!('serviceWorker' in navigator)) {
        throw new Error("No support for service worker!");
    } 

    if(!('Notification' in window)) {
        throw new Error("No support for notification API");
    }
}

const registerSW = async() => {
    console.log('register service worker...')
    const registration = await navigator.serviceWorker.register('worker.js');
    return registration;
}

const requestNotificationPermission = async () => {
    console.log('request notification permissions')
    const permission = await Notification.requestPermission();

    if(permission !== 'granted') {
        throw new Error("Notification permission not granted");
    } else {
        await registerSW()
    }
}

const main = async () => {
    checkPermission()
    await requestNotificationPermission()
    //await registerSW()
}

main()