<template>
  <div>
    <form class="new-task mt-4" @submit.prevent="handleSubmit">
      <input type="text" placeholder="username" v-model="name" />
      <input type="password" placeholder="Password" v-model="password" />
      <label>Role:</label>
      <select v-model="role">
        <option value="OrganizationAdmin">Organization Admin</option>
        <option value="Coordinator">Coordinator</option>
      </select>
      <div v-if="mUser.role == 'KeelaAdmin'">
        <label>Organization:</label>

        <select v-model="organization">
          <option
            v-for="organization in organizations"
            :key="organization._id"
            :value="organization._id"
          >
            {{ organization.name }}
          </option>
        </select>
      </div>
      <button type="button" class="btn btn-primary" v-on:click="addUser">
        Add User
      </button>

      <table class="table mt-2">
        <thead>
          <th scope="col">Users</th>
          <th scope="col">Role</th>
          <th scope="col">Organization</th>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user._id">
            <td>{{ user.username }}</td>
            <td>{{ user.role }}</td>
            <td>{{ getOrgName(user.organization).name }}</td>
            <td>
              <button
                v-if="user._id !== mUser._id"
                class="btn btn-danger"
                v-on:click.prevent="deleteUser(user._id)"
              >
                Delete
              </button>
              <button
                type="button"
                class="btn btn-secondary"
                v-on:click="updateUserShow(user)"
              >
                Update
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </form>
    <modal name="user-update" :adaptive="true" :minHeight="10" :height="180">
      <div>
        <input
          class="m-2"
          type="text"
          placeholder="username"
          v-model="userToUpdate.username"
        />
        <input
          class="m-2"
          type="password"
          placeholder="Password"
          v-model="userToUpdate.password"
        />
        <br />
        <labe class="m-2">Role:</labe>
        <select v-model="userToUpdate.role" class="m-2">
          <option value="OrganizationAdmin">Organization Admin</option>
          <option value="Coordinator">Coordinator</option>
        </select>
        <div v-if="mUser.role == 'KeelaAdmin'">
          <label class="m-2">Organization:</label>
          <select v-model="userToUpdate.organization" class="m-2">
            <option
              v-for="organization in organizations"
              :key="organization._id"
              :value="organization._id"
            >
              {{ organization.name }}
            </option>
          </select>
        </div>
        <button
          type="button"
          class="btn btn-primary m-2"
          v-on:click="updateUser"
        >
          Update User
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
      password: '',
      role: '',
      organizations: [],
      organization: '',
      users: [],
      userToUpdate: {
        username: '',
        password: '',
        role: '',
        organization: '',
      },
    };
  },
  created() {
    this.getOrgaization();
    this.getUsers();
    this.mUser = Meteor.users.findOne(
      { _id: Meteor.user()._id },
      { fields: { role: 1, organization: 1 } }
    );
    this.organization = this.mUser.organization;
  },

  methods: {
    updateUserShow(userUp) {
      this.$modal.show('user-update');
      this.userToUpdate = { ...userUp };
    },
    getOrgName(id) {
      if (this.mUser.role == 'KeelaAdmin') {
        if (id == null) {
          return { name: 'Unknown' };
        }
        let orginf = this.organizations.find((org) => {
          return org._id === id;
        });
        if (orginf == null) {
          return { name: 'Unknown' };
        }
        return orginf;
      } else {
        let org = OrganizationsCollection.find({
          _id: this.mUser.organization,
        }).fetch();
        return org[0];
      }
    },
    deleteUser(id) {
      Meteor.call('users.delete', id, (err, res) => {
        if (err) {
          console.log(err);
        } else {
          console.log(res);
          this.getUsers();
        }
      });
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
    addUser() {
      if ((this.name != '') & (this.password != '')) {
        console.log(this.mUser);
        console.log('Organization', this.organization);
        Meteor.call(
          'users.insert',
          this.name,
          this.password,
          this.role,
          this.organization,
          (err, res) => {
            if (err) {
              console.log(err);
            } else {
              this.getUsers();
              console.log(res);
            }
          }
        );
        this.name = '';
        this.password = '';
        this.role = '';
        this.organization = '';
      }
    },
    getUsers() {
      Meteor.call('users.view', (err, res) => {
        if (err) {
          console.log(err);
        } else {
          this.users = res;
          console.log('users', this.users);
        }
      });
    },
    updateUser() {
      Meteor.call('users.update', this.userToUpdate, (err, res) => {
        if (err) {
          console.log(err);
        } else {
          this.getUsers();
          this.$modal.hide('user-update');
          console.log(res);
        }
      });
    },
  },
};
</script>
