
<template>
  <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md8>
            <v-card class="elevation-12">
              <v-toolbar dark>
                <v-toolbar-title>Who are you?</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <v-form v-if="users">
                  <v-select :items="users" v-model="selectedUser" item-text="name" item-value="id"></v-select>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="selectUser(selectedUser)" :disabled="selectedUser ? false : true">Yep, that's me</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
</template>

<script>
import Api from '../config/Api'

  export default {
    data: () => ({
      selectedUser: null,
      users: null
    }),
    methods: {
      selectUser(userID) {
        localStorage.userID = userID
        this.$store.dispatch('selectedUser', userID)
      }
    },
    created() {
      Api.get("users").then(
        response => {
          this.users = response.data
        },
         // eslint-disable-next-line
         err => {
          this.$store.commit('ADD_ERROR', 'API_ERROR')
        }
      )
    }
  }
</script>

<style>

</style>
