<template>
  <div v-if="user">
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
      <div class="container-fluid">
        <router-link class="navbar-brand" to="/">
          {{ user.username }}</router-link
        >
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <router-link
                class="nav-link active"
                v-if="user.role === 'KeelaAdmin'"
                to="/organizations/"
                >Create Organization</router-link
              >
            </li>
            <li class="nav-item">
              <router-link
                v-if="
                  user.role === 'KeelaAdmin' ||
                  user.role === 'OrganizationAdmin'
                "
                to="/users/"
                class="nav-link"
                >Manage Users</router-link
              >
            </li>
            <li class="nav-item">
              <router-link
                v-if="user.role != 'KeelaAdmin'"
                to="/contacts/"
                class="nav-link"
                >Manage Contacts</router-link
              >
            </li>
            <li class="nav-item">
              <router-link
                v-if="user.role != 'KeelaAdmin'"
                to="/tags/"
                class="nav-link"
                >Manage Tags</router-link
              >
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <div>
      <router-view></router-view>
    </div>
  </div>
  <div v-else>
    <form class="login-form" @submit.prevent="handleSubmit">
      <div>
        <label for="username">Username</label>
        <input
          id="username"
          name="username"
          type="text"
          placeholder="Username"
          required
          v-model="username"
        />
      </div>

      <div>
        <label for="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Password"
          required
          v-model="password"
        />
      </div>

      <div>
        <button type="button" class="btn btn-success" v-on:click="handleSubmit">
          Log In
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { Meteor } from 'meteor/meteor';
export default {
  data: {
    user: null,
    username: '',
    password: '',
  },
  created() {
    this.user = Meteor.users.findOne(
      { _id: Meteor.user()._id },
      { fields: { role: 1 } }
    );
  },

  methods: {
    logout() {
      Meteor.logout();
    },
    handleSubmit(event) {
      console.log('handleSubmit');
      Meteor.loginWithPassword(this.username, this.password, (error) => {
        if (error) {
          console.log('error', error);
        } else {
          this.user = Meteor.users.findOne(
            { _id: Meteor.user()._id },
            { fields: { role: 1, username: 1 } }
          );

          console.log('user after login', this.user);
        }
      });
    },
  },
  computed: {},
};
</script>

<style>
body {
  font-family: sans-serif;
  padding: 10px;
}
</style>
