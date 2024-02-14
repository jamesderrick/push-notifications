const checkAuthentication = async () => {
    const response = await fetch('api/authenticated')
    const result = await response.json()
    return result
}

const renderDisplayName = (username) => {
    const profile = document.querySelector('.profile')
    profile.innerHTML = '';
    const email = document.createElement('p')
    email.innerText = 'Signed in as: ' + username;
    profile.appendChild(email)
}

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

const sendNudge = async (nudgeId) => {
    //alert('send nudge for id = ' + nudgeId)
    const response = await fetch('api/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': "application/json" },
        body: JSON.stringify({
            nudgeId: nudgeId,
            "title": "Test Notification",
            "body": "This is the body of the notification"
        })
    })
}

const sendAllNudges = async () => {
    const response = await fetch('api/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': "application/json" },
        body: JSON.stringify({
            "title": "Test Notification",
            "body": "This is the body of the notification"
        })
    })
}

const getNudges = async () => {
    const dateOptions = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    const response = await fetch('api/nudges')
    const nudges = await response.json()

    const nudgeResults = document.querySelector('.nudges tbody');
    nudges.forEach(nudge => {

        const nudgeRow = document.createElement('tr');
        const nudgeId = document.createElement('td');
        nudgeId.innerText = nudge.nudge_id

        const requested = document.createElement('td');
        requested.innerText = nudge.requestor

        const recipient = document.createElement('td');
        recipient.innerText = nudge.recipient

        const received = document.createElement('td');
        received.innerText = nudge.received === 1 ? new Date(nudge.received_timestamp).toLocaleDateString('en-GB', dateOptions) : 'NO';

        const acknowledged = document.createElement('td');
        acknowledged.innerText = nudge.acknowledged === 1 ? new Date(nudge.acknowledged_timestamp).toLocaleDateString('en-GB', dateOptions) : 'NO';

        const contacts = document.createElement('td');
        let contactsHTML = '';
        nudge.contacts.split(',').forEach(contact => {
            contactsHTML += '<span>' + contact + '</span><br/>'
        })
        contacts.innerHTML = '<div>' + contactsHTML + '</div';

        nudgeRow.appendChild(nudgeId)
        nudgeRow.appendChild(requested)
        nudgeRow.appendChild(recipient)
        nudgeRow.appendChild(received)
        nudgeRow.appendChild(acknowledged)
        nudgeRow.appendChild(contacts)

        const action = document.createElement('td');
        const sendBtn = document.createElement('button');
        sendBtn.innerText = 'SEND'
        sendBtn.onclick = () => sendNudge(nudge.nudge_id)

        action.appendChild(sendBtn)
        nudgeRow.appendChild(action)

        nudgeResults.appendChild(nudgeRow)
    })
}

const main = async () => {
    const authentication = await checkAuthentication()
    console.log(authentication)
    if(authentication.authenticated) {
        renderDisplayName(authentication.email)
        checkPermission()
        await requestNotificationPermission() 
    } else {
        window.location.href='/auth/signin'
    }
    //checkPermission()
    //await requestNotificationPermission()
    //await registerSW()
}

main()
getNudges()