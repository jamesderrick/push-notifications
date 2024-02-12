const urlParams = new URLSearchParams(window.location.search);
const nudgeId = urlParams.get('id')

const getContacts = async (nudgeId) => {
    const response = await fetch(`api/nudges/contacts?id=${nudgeId}`)
    const contacts = await response.json()

    const results = document.querySelector('.results');
    contacts.forEach((result,index) => {
        const contact = document.createElement('div');
        contact.id = 'contact-' + index;
        contact.classList.add('contact-container')
        const contactName = document.createElement('div');
        contactName.classList.add('contact-name')
        contactName.innerHTML = result.first_name + ' ' + result.last_name;
        const contactDetails = document.createElement('div');
        contactDetails.classList.add('contact-details')
        contactDetails.innerHTML = result.email;

        contact.appendChild(contactName);
        contact.appendChild(contactDetails);
        results.appendChild(contact)
    });
}

getContacts(nudgeId)