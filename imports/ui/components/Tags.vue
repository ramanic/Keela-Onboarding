<template>
  <div>
    <form class="new-task mt-4" @submit.prevent="handleSubmit">
      <div>
        <input type="text" placeholder="name" v-model="name" />

        <button type="button" class="btn btn-primary" v-on:click="addTags">
          Add Tag
        </button>
      </div>

      <table class="table mt-2">
        <thead>
          <th scope="col">Name</th>
        </thead>
        <tbody>
          <tr v-for="tag in tags" :key="tag._id">
            <td>{{ tag.name }}</td>
            <td>
              <button
                class="btn btn-danger"
                v-on:click.prevent="deleteTag(tag._id)"
              >
                Delete
              </button>
              <button
                type="button"
                class="btn btn-secondary"
                v-on:click="updateTagShow(tag)"
              >
                Update
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </form>
    <modal name="tag-update" :adaptive="true" :minHeight="10" :height="180">
      <div>
        <input
          class="m-2"
          type="text"
          placeholder="Name"
          v-model="tagToUpdate.name"
        />

        <button
          type="button"
          class="btn btn-primary m-2"
          v-on:click="updateTags"
        >
          Update Tags
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
      name: '',
      tags: [],
      tagToUpdate: {
        name: '',
      },
    };
  },
  created() {
    this.getTags();
  },

  methods: {
    updateTagShow(data) {
      this.$modal.show('tag-update');
      this.tagToUpdate = { ...data };
    },

    deleteTag(id) {
      Meteor.call('tags.delete', id, (err, res) => {
        if (err) {
          console.log(err);
        } else {
          console.log(res);
          this.getTags();
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
        }
      });
    },
    updateTags() {
      Meteor.call('tags.update', this.tagToUpdate, (err, res) => {
        if (err) {
          console.log(err);
        } else {
          this.getTags();
          this.$modal.hide('tag-update');
        }
      });
    },
  },
};
</script>
