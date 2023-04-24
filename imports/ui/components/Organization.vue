<template>
  <form class="new-task mt-4" @submit.prevent="handleSubmit">
    <input type="text" placeholder="Organization Name" v-model="name" />

    <button type="button" class="btn btn-primary" v-on:click="handleSubmit">
      Add Organization
    </button>
    <table class="table mt-2">
      <thead>
        <th scope="col">Organization Name</th>
      </thead>
      <tbody>
        <tr v-for="organization in organizations" :key="organization._id">
          <td>{{ organization.name }}</td>
        </tr>
      </tbody>
    </table>
  </form>
</template>

<script>
import Vue from 'vue';
import { OrganizationsCollection } from './../../api/collections';

export default {
  data() {
    return {
      name: '',
      organizations: [],
    };
  },
  created() {
    this.getOrgaization();
  },

  methods: {
    handleSubmit(event) {
      if (this.name != '') {
        Meteor.call('organizations.insert', this.name, (err, res) => {
          if (err) {
            console.log(err);
          } else {
            console.log(res);
            this.getOrgaization();
          }
        });
        this.name = '';
      }
    },
    getOrgaization() {
      Meteor.call('organizations.view', (err, res) => {
        if (err) {
          console.log(err);
        } else {
          this.organizations = res.filter((organization) => {
            return organization.owner === Meteor.userId();
          });
        }
      });
    },
  },
  meteor: {
    organizations() {
      return OrganizationsCollection.find({}).fetch();
    },
  },
};
</script>
