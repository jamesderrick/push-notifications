const urlParams = new URLSearchParams(window.location.search);
const nudgeId = urlParams.get('id')

const getAllContacts = async () => {
    const response = await fetch(`api/contacts`)
    const contacts = await response.json();
    return contacts
}

const getContactsDropdown = async () => {
    const contacts = await getAllContacts()
    console.log(contacts)
    const recipientDropdownField = document.querySelector('.recipient')
    const requestorDropdownField = document.querySelector('.requestor')
    console.log(contacts.filter(contact => contact.type === 'owner'))
    console.log(contacts.filter(contact => contact.type === 'contact'))

    contacts.filter(contact => contact.type === 'owner').forEach(contact => {
        console.log(contact)
        const option = document.createElement('option');
        option.value = contact.contact_id
        option.innerText = contact.email;
        requestorDropdownField.appendChild(option)

        const optionReciptient = document.createElement('option');
        optionReciptient.value = contact.contact_id
        optionReciptient.innerText = contact.email;
        recipientDropdownField.appendChild(optionReciptient)
    })
}

const getContactsCheckbox = async () => {
    const contacts = await getAllContacts();
    const checkboxField = document.querySelector('.contacts')

    contacts.filter(contact => contact.type === 'contact').forEach(contact => {
        const container = document.createElement('div');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox'
        checkbox.id = 'contact-' + contact.contact_id
        checkbox.name = 'contact'
        checkbox.value = contact.contact_id
        container.appendChild(checkbox)

        const label = document.createElement('label');
        label.setAttribute('for','contact-' + contact.contact_id)
        label.textContent = contact.first_name + ' ' + contact.last_name
        container.appendChild(label)

        checkboxField.appendChild(container)
    })
}

const getContactsByNudge = async (nudgeId) => {
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

if(nudgeId) {
    getContactsByNudge(nudgeId)
} else {
    getContactsDropdown()
    getContactsCheckbox()
}