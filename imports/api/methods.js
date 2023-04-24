import { check } from 'meteor/check';
import {
  ContactsCollection,
  OrganizationsCollection,
  TagsCollection,
} from './collections';

Meteor.methods({
  'organizations.insert'(name) {
    check(name, String);

    role = Meteor.users.findOne({ _id: this.userId }).role;

    if (!this.userId && role !== 'KeelaAdmin') {
      console.log('Error');
      throw new Meteor.Error('Not authorized.');
    }
    OrganizationsCollection.insert({
      name,
      createdAt: new Date(),
      owner: this.userId,
    });
  },

  'organizations.view'() {
    role = Meteor.users.findOne({ _id: this.userId }).role;

    if (!this.userId && role !== 'KeelaAdmin') {
      console.log('Error');
      throw new Meteor.Error('Not authorized.');
    }
    let orgs = OrganizationsCollection.find({}).fetch();

    return orgs;
  },
  'users.insert'(username, password, role, organization) {
    check(username, String);
    check(role, String);
    check(password, String);
    let urole = Meteor.users.findOne({ _id: this.userId }).role;

    if (
      !this.userId &&
      (urole !== 'KeelaAdmin' || urole !== 'OrganizationAdmin')
    ) {
      console.log('Error');
      throw new Meteor.Error('Not authorized.');
    }
    dupUser = Meteor.users.findOne({ username: username });
    console.log('dupUser', dupUser);
    if (dupUser) {
      throw new Meteor.Error('Username already exists.');
    }
    id = Accounts.createUser({
      username: username,
      password: password,
    });
    Meteor.users.update(id, {
      $set: {
        role: role,
        organization: organization,
      },
    });
  },
  'users.view'() {
    let user = Meteor.users.findOne({ _id: this.userId });
    let users = [];
    if (this.userId && user.role === 'KeelaAdmin') {
      users = Meteor.users
        .find({}, { fields: { role: 1, username: 1, organization: 1 } })
        .fetch();
    } else if (this.userId && user.role === 'OrganizationAdmin') {
      users = Meteor.users
        .find(
          {
            organization: user.organization,
          },
          { fields: { role: 1, username: 1, organization: 1 } }
        )
        .fetch();
    }
    console.log('Users', users);
    return users;
  },
  'users.delete'(id) {
    let user = Meteor.users.findOne({ _id: this.userId });
    if (this.userId && user.role === 'KeelaAdmin') {
      Meteor.users.remove({ _id: id });
    }
  },
  'users.update'({ _id, username, role, organization, password }) {
    let user = Meteor.users.findOne({ _id: this.userId });
    if (
      this.userId &&
      (user.role === 'KeelaAdmin' || user.role === 'OrganizationAdmin')
    ) {
      if (username) {
        Meteor.users.update({ _id: _id }, { $set: { username } });
      }
      if (role) {
        Meteor.users.update({ _id: _id }, { $set: { role } });
      }
      if (organization) {
        Meteor.users.update({ _id: _id }, { $set: { organization } });
      }

      if (password) {
        Accounts.setPassword(_id, password);
      }
    }
  },

  'contacts.insert'(name, email) {
    let user = Meteor.users.findOne({ _id: this.userId });
    if (!this.userId && user.role !== 'OrganizationAdmin') {
      console.log('Error');
      throw new Meteor.Error('Not authorized.');
    }
    ContactsCollection.insert({
      name,
      email,
      organization: user.organization,
    });
  },
  'contacts.view'() {
    let user = Meteor.users.findOne({ _id: this.userId });
    let contacts = [];
    if (this.userId) {
      contacts = ContactsCollection.find({
        organization: user.organization,
      }).fetch();
    }
    console.log('Contacts', contacts);
    return contacts;
  },
  'contacts.delete'(id) {
    let user = Meteor.users.findOne({ _id: this.userId });
    if (this.userId && user.role === 'OrganizationAdmin') {
      ContactsCollection.remove({ _id: id });
    }
  },
  'contacts.update'({ _id, name, email }) {
    let user = Meteor.users.findOne({ _id: this.userId });
    if (this.userId && user.role === 'OrganizationAdmin') {
      if (name) {
        ContactsCollection.update({ _id: _id }, { $set: { name } });
      }
      if (email) {
        ContactsCollection.update({ _id: _id }, { $set: { email } });
      }
    }
  },
  'contacts.addTags'(contactId, tagIds) {
    console.log('contactId', contactId);
    console.log('tagIds', tagIds);
    ContactsCollection.update({ _id: contactId }, { $set: { tagIds } });
  },

  'tags.insert'(name) {
    let user = Meteor.users.findOne({ _id: this.userId });

    TagsCollection.insert({
      name,
      organization: user.organization,
    });
  },
  'tags.view'() {
    let user = Meteor.users.findOne({ _id: this.userId });
    let tags = [];
    if (this.userId) {
      tags = TagsCollection.find({
        organization: user.organization,
      }).fetch();
    }

    return tags;
  },
  'tags.delete'(id) {
    TagsCollection.remove({ _id: id });
  },
  'tags.update'({ _id, name }) {
    if (name) {
      TagsCollection.update({ _id: _id }, { $set: { name } });
    }
  },
});
