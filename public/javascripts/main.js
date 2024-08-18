import { Render } from "./render.js";
import { Data } from "./data.js";

class Main {
  constructor() {
    this.render = new Render();
    this.data = new Data();
    this.boundEditListener = this.editListener.bind(this);
    this.boundDeleteListener = this.deleteListener.bind(this);
    this.init();
  }

  async addContact(data) {
    await this.data.addNew(data);
  }

  async init() {
    const contacts = await this.data.fetchContacts();
    this.render.setContacts(contacts);
    this.render.renderTagFilters(contacts);
    this.render.renderContacts(contacts);
    this.addSubmit();
    this.deleteContact();
    this.editContact();
  }

  addSubmit() {
    document.addEventListener('submit', async e => {
      e.preventDefault();
      if (e.target.id === 'add_contact_form') {
        let formData = new FormData(e.target);
        let object = Object.fromEntries(formData);
        let data = JSON.stringify(object);
        await this.addContact(data);
        e.target.reset();
        this.render.renderNewContact(object);
        this.deleteContact();
        this.editContact();
      }
    })
  }

  editContact() {
    const editButtons = document.querySelectorAll('button.edit');
    editButtons.forEach(button => {
      button.removeEventListener('click', this.boundEditListener); 
      button.addEventListener('click', this.boundEditListener); 
    });
  }

  submitEdit() {
    document.addEventListener('submit', async e => {
      e.preventDefault();
      if (e.target.id === 'edit_contact_form') {
        let id = e.target.getAttribute('data-id');
        let formData = new FormData(e.target);
        let object = Object.fromEntries(formData);
        let data = JSON.stringify(object);
        await this.data.editContact(data, id);
        e.target.reset();
        this.render.renderEditedContact(object, id);
        this.editContact();
        this.deleteContact();
      }
    })
  }

  editListener(e) {
    e.preventDefault();
    let id = e.target.parentElement.getAttribute('data-id');
    this.render.showEdit(id);
    this.submitEdit();
  }; 

  deleteContact() {
    const deleteButtons = document.querySelectorAll('button.delete');
    deleteButtons.forEach(button => {
      button.removeEventListener('click', this.boundDeleteListener);
      button.addEventListener('click', this.boundDeleteListener);
    })
  }

  deleteListener(e) {
    let confirmation = confirm('Are you sure you want to delete this contact?');
    if (confirmation) {
      let id = e.target.parentElement.getAttribute('data-id');
      this.data.delete(id);
      this.render.removeContact(id);
      this.editContact();
      this.deleteContact();
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const main = new Main();

  const searchBox = document.querySelector('#search_box');
  searchBox.addEventListener('input', () => {
    setTimeout(() => {
      main.editContact();
      main.deleteContact();
    }, 0);
  });

  document.getElementById('tag_filter').addEventListener('click', (event) => {
    if (event.target.classList.contains('tag')) {
      main.editContact();
      main.deleteContact();
    }
  });
})
