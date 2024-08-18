export class Render {
  constructor() {
    this.home = document.querySelector('#home');
    this.contactSection = document.querySelector('#contact_section');
    this.tagFilterSection = document.querySelector('#tag_filter');
    this.main = document.querySelector('div#main');
    this.newContact = document.querySelector('#add_contact');
    this.addContactFormSection = document.querySelector('#add_contact_section');
    this.editContactFormSection = document.querySelector('#edit_contact_section');
    this.addContact = document.querySelector('#add_contact_form_template');
    this.editContact = document.querySelector('#edit_contact_form_template');
    this.addContactForm = document.querySelector('#add_contact_form')
    this.searchBox = document.querySelector('#search_box');
    this.contacts;
    this.selectedFilters;
    this.searchValue;
    this.bind();
  }

  setContacts(json) { 
    this.contacts = json;
  };

  renderTags(json = this.contacts) {
    let uniqueTags = [];
    let stringTags = '';

    json.forEach(contact => {
      if (contact.tags) {
        stringTags += ',' + contact.tags;
      }
    })

    let allTags = stringTags.split(',').filter(ele => ele);

    allTags.forEach(tag => {
      if (!uniqueTags.includes(tag)) {
        uniqueTags.push(tag);
      }
    });

    return uniqueTags;
  }

  renderTagFilters(json = this.contacts) {
    const uniqueTags = this.renderTags(json);
    const filterTags = document.querySelector('#filter_tag_list').innerHTML;
    const filterTagsTemplate = Handlebars.compile(filterTags);
    this.tagFilterSection.innerHTML = filterTagsTemplate({ tags: uniqueTags });
    this.tagsSelection();
  }

  renderContacts(json = this.contacts) {
    const contacts = document.querySelector('#contacts').innerHTML;
    const singleContact = document.querySelector('#contact').innerHTML;
    const contactTags = document.querySelector('#contact_tags').innerHTML;

    json.forEach(contact => {
        if (typeof contact.tags === 'string') {
          contact.tags = contact.tags ? contact.tags.split(',') : [];
        }
    })

    Handlebars.registerPartial('contact_tags', contactTags)
    Handlebars.registerPartial('contact', singleContact);

    const contactTemplate = Handlebars.compile(contacts);
    this.contactSection.innerHTML = contactTemplate({ json });
  }

  searchContacts() {
    this.searchBox.addEventListener('input', e => {
      this.searchValue = e.target.value.toLowerCase();
      this.renderFiltered();
    })
  }

  highestContactId() {
    let contactIds = [];
    this.contacts.forEach( contact => contactIds.push(Number(contact.id)));
    return Math.max(...contactIds) + 1;
  }

  renderNewContact(json) {
    json.id = this.highestContactId();
    this.contacts.push(json)
    this.renderContacts();
    this.renderTagFilters();
    this.hideAdd();
  }

  renderEditedContact(json, id) {
    this.updateContactList(json, id);
    this.renderContacts();
    this.renderTagFilters();
    this.hideEdit();
  }

  updateContactList(json, id) {
    let contactIndex = this.contacts.findIndex(contact => contact.id === Number(id));
    let updatedInfo = json;
    updatedInfo.id = Number(id);
    this.contacts[contactIndex] = json;
    this.renderTagFilters();
  }

  removeContact(id) {
    let targetContact = document.querySelector(`[data-id='${id}']`);
    if (targetContact) {
      targetContact.remove();
    }
    let contactIdx = this.contacts.findIndex(contact => contact.id === id);
    this.contacts.splice(contactIdx, 1);
    this.renderTagFilters();
  }

  renderFiltered() {
    if (this.searchValue) {
      this.renderContacts(this.filterContacts(this.searchValue));
    } else {
      this.renderContacts(this.filterContacts());
    }
  }

  filterContacts(value) {
    let valueFiltered = this.contacts;

    if (value) {
      valueFiltered = this.contacts.filter(contact => {
        let regex = new RegExp(`^${value}+`, 'i');
        let name = contact.full_name.split(' ');
        if (name.length > 1) {
          let [first, last] = contact.full_name.split(' ') || contact.full_name;
          return first.match(regex) || last.match(regex);
        } else {
          return name[0].match(regex);
        }
      })
    }

    if (this.selectedFilters) {
      return valueFiltered.filter(contact => {
        return this.selectedFilters.every(filter => contact.tags && contact.tags.includes(filter));
      });
    } else {
        return valueFiltered;
    }
  }

  tagsSelection() {
    const tagFilters = document.querySelectorAll('#tag_filter span.tag');
    tagFilters.forEach(tagFilter => {
      tagFilter.addEventListener('click', e => {
        this.highlightTag(e.target);
        this.filterByTags();
        this.renderFiltered();
      })
    })
  }

  highlightTag(target) {
    target.classList.toggle('selected');
  }

  filterByTags() {
    const selectedFilterElements = document.querySelectorAll('#tag_filter span.tag.selected');
    this.selectedFilters = [...selectedFilterElements].map(filter => filter.textContent);
  }

  hideMain() {
    this.main.classList.remove('show');
    this.main.classList.add('hide');
  }

  showMain() {
    this.main.classList.remove('hide');
    this.main.classList.add('show');
  }

  hideContact() {
    this.addContactFormSection.classList.remove('show');
    this.addContactFormSection.classList.add('hide');
  }

  showContact() {
    this.addContactFormSection.classList.remove('hide');
    this.addContactFormSection.classList.add('show');
  }

  hideEditContact() {
    this.editContactFormSection.classList.remove('show');
    this.editContactFormSection.classList.add('hide');
  }

  showEditContact() {
    this.editContactFormSection.classList.remove('hide');
    this.editContactFormSection.classList.add('show');
  }

  hideAdd() {
    this.hideContact();
    this.showMain();
  }

  showAdd() {
    const addContactForm = Handlebars.compile(this.addContact.innerHTML);
    this.addContactFormSection.innerHTML = addContactForm({ tags: this.renderTags()} );
    this.showContact();
    this.hideMain();
  }

  hideEdit() {
    this.hideEditContact();
    this.showMain();
  }

  showEdit(id) {
    const editContactForm = Handlebars.compile(this.editContact.innerHTML);
    const contact = this.contacts.find(contact => contact.id === Number(id))
    this.editContactFormSection.innerHTML = editContactForm(contact);
    this.showEditContact();
    this.hideMain();
  }

  bind() {
    this.home.addEventListener('click', e => {
      e.preventDefault;
      this.hideAdd();
      this.hideEdit();
      this.showMain();
    }) 

    document.addEventListener('click', e => {
      if (e.target.parentElement.id && e.target.parentElement.id === 'add_contact') {
        e.preventDefault;
        this.hideMain();
        this.showAdd();
      }
    })

    this.searchContacts();
  }
}