export class Data {
  constructor() {

  }

  async fetchContacts() {
    try {
      let contactsResponse = await fetch('api/contacts')

      if (contactsResponse.ok) {
        return await contactsResponse.json();
      } else {
        console.error("Error:", contactsResponse.statusText);
      }
    } catch(error) {
      console.error("Fetch Failed:", error);
    }
  }

  async addNew(contact) {
    try {
      let contactsResponse = await fetch('api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: contact
      })

      if (contactsResponse.ok) {
        console.log(await contactsResponse.json());
      } else {
        console.error("Error:", contactsResponse.statusText);
      }
    } catch(error) {
      console.error("Fetch Failed:", error);
    }
  }

  async editContact(contact, id) {
    try {
      let contactsResponse = await fetch(`api/contacts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', },
        body: contact
      })

      if (contactsResponse.ok) {
        console.log(await contactsResponse.json());
      } else {
        console.error("Error:", contactsResponse.statusText);
      }
    } catch(error) {
      console.error("Fetch Failed:", error);
    }
  }

  async delete(id) {
    try {
        await fetch(`api/contacts/${id}`, {
        method: 'DELETE',
      })
    } catch(error) {
      console.error("Fetch Failed:", error);
    }
  }

}