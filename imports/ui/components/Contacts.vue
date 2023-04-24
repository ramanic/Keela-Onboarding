<template>
  <div>
    <form class="new-task mt-4" @submit.prevent="handleSubmit">
      <div v-if="mUser.role === 'OrganizationAdmin'">
        <input type="text" placeholder="name" v-model="name" />
        <input type="text" placeholder="email" v-model="email" />

        <button type="button" class="btn btn-primary" v-on:click="addContacts">
          Add Contact
        </button>
      </div>

      <table class="table mt-2">
        <thead>
          <th scope="col">Name</th>
          <th scope="col">Email</th>
          <th scope="col">Organization</th>
          <th scope="col">Tags</th>
        </thead>
        <tbody>
          <tr v-for="contact in contacts" :key="contact._id">
            <td>{{ contact.name }}</td>
            <td>{{ contact.email }}</td>
            <td>{{ organization.name }}</td>
            <td>
              <div v-for="tag in contact.tagIds" :key="tag">
                <div v-if="getTagName(tag)">
                  {{ getTagName(tag) }}
                  <span
                    class="btn btn-link"
                    v-on:click="removeTag(tag, contact)"
                    >X</span
                  >
                </div>
              </div>
            </td>

            <td>
              <button
                class="btn btn-primary"
                v-on:click.prevent="addTagShow(contact)"
              >
                Add Tags
              </button>
              <button
                v-if="mUser.role === 'OrganizationAdmin'"
                class="btn btn-danger"
                v-on:click.prevent="deleteContact(contact._id)"
              >
                Delete
              </button>
              <button
                v-if="mUser.role === 'OrganizationAdmin'"
                type="button"
                class="btn btn-secondary"
                v-on:click="updateContactShow(contact)"
              >
                Update
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </form>
    <modal name="contact-update" :adaptive="true" :minHeight="10" :height="180">
      <div>
        <input
          class="m-2"
          type="text"
          placeholder="Name"
          v-model="contactToUpdate.name"
        />
        <input
          class="m-2"
          type="text"
          placeholder="Email"
          v-model="contactToUpdate.email"
        />

        <button
          type="button"
          class="btn btn-primary m-2"
          v-on:click="updateContacts"
        >
          Update Contact
        </button>
      </div>
    </modal>
    <modal name="add-tag" :adaptive="true" :minHeight="10" :height="120">
      <div class="m-2">
        <select
          v-model="addedTag"
          class="custom-select my-1 mr-sm-2"
          id="inlineFormCustomSelectPref"
        >
          <option
            v-for="tag in tagsOptions"
            :value="tag._id"
            v-bind:key="tag._id"
          >
            {{ tag.name }}
          </option>
        </select>
        <button
          type="button"
          class="btn btn-secondary"
          v-on:click="addTagsToContact()"
        >
          Add
        </button>
      </div>
    </modal>
  </div>
</template>

<script>
import Vue from 'vue';
import { OrganizationsCollection } from './../../api/collections';
import { Meteor } from 'meteor/meteor';

export default {
  data() {
    return {
      mUser: { _id: 1 },
      name: '',
      email: '',
      organization: {},
      contacts: [],
      tags: [],
      tagsOptions: [],

      contactToUpdate: {
        name: '',
        email: '',
      },
      addedTag: '',
    };
  },
  created() {
    this.getContacts();
    this.getTags();
    this.mUser = Meteor.users.findOne(
      { _id: Meteor.user()._id },
      { fields: { role: 1, organization: 1 } }
    );
    let org = OrganizationsCollection.find({
      _id: this.mUser.organization,
    }).fetch();
    this.organization = org[0];
    console.log('Org', this.organization);
  },

  methods: {
    updateContactShow(data) {
      this.$modal.show('contact-update');
      this.contactToUpdate = { ...data };
    },
    addTagShow(data) {
      this.$modal.show('add-tag');
      this.contactToUpdate = { ...data };
      this.tagsOptions = this.tags.filter((tag) => {
        return !this.contactToUpdate.tagIds.includes(tag._id);
      });
      if (!this.contactToUpdate.tagIds) {
        this.contactToUpdate.tagIds = [];
      }
    },

    deleteContact(id) {
      Meteor.call('contacts.delete', id, (err, res) => {
        if (err) {
          console.log(err);
        } else {
          console.log(res);
          this.getContacts();
        }
      });
    },

    addContacts() {
      if ((this.name != '') & (this.email != '')) {
        Meteor.call('contacts.insert', this.name, this.email, (err, res) => {
          if (err) {
            console.log(err);
          } else {
            this.getContacts();
            console.log(res);
          }
        });
        this.name = '';
        this.email = '';
      }
    },
    getContacts() {
      Meteor.call('contacts.view', (err, res) => {
        if (err) {
          console.log(err);
        } else {
          this.contacts = res;
          console.log('contacts', this.contacts);
        }
      });
    },
    updateContacts() {
      Meteor.call('contacts.update', this.contactToUpdate, (err, res) => {
        if (err) {
          console.log(err);
        } else {
          this.getContacts();
          this.$modal.hide('contact-update');
          console.log(res);
        }
      });
    },
    addTags() {
      if (this.name != '') {
        Meteor.call('tags.insert', this.name, (err, res) => {
          if (err) {
            console.log(err);
          } else {
            this.getTags();
            console.log(res);
          }
        });
        this.name = '';
      }
    },
    getTags() {
      Meteor.call('tags.view', (err, res) => {
        if (err) {
          console.log(err);
        } else {
          this.tags = res;
          console.log('tags', this.tags);
        }
      });
    },
    addTagsToContact() {
      if (this.addedTag) {
        this.contactToUpdate.tagIds.push(this.addedTag);

        Meteor.call(
          'contacts.addTags',
          this.contactToUpdate._id,
          this.contactToUpdate.tagIds,
          (err, res) => {
            if (err) {
              console.log(err);
            } else {
              this.getContacts();
              this.$modal.hide('add-tag');
            }
          }
        );
      }
    },
    removeTag(tagId, contact) {
      console.log('contact', contact);
      let tagIds = contact.tagIds.filter((tag) => {
        return tag !== tagId;
      });
      Meteor.call('contacts.addTags', contact._id, tagIds, (err, res) => {
        if (err) {
          console.log(err);
        } else {
          this.getContacts();
        }
      });
    },
    getTagName(id) {
      let tag = this.tags.find((tag) => {
        return tag._id === id;
      });
      if (tag) {
        return tag.name || null;
      }
    },
  },
};
</script>
