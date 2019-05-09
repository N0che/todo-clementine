<template>
  <v-app dark v-if="user !== null">
    <v-toolbar app>
      <v-flex xs4>
        <v-toolbar-title class="headline text-uppercase">
          <span style="cursor: pointer" @click="editUser()"><v-icon size="25">edit</v-icon> Welcome {{ user.username }}</span>
        </v-toolbar-title>
      </v-flex>
      
      <v-flex xs4>
        <v-img
          :src="require('./assets/glados.png')"
          contain
          height="54"
        ></v-img>
      </v-flex>
      
      <v-flex xs4>
        <v-toolbar-title class="text-xs-right headline text-uppercase">
          <span>end task for a cake</span>
        </v-toolbar-title>
        </v-flex>
    </v-toolbar>

    <v-content>
      <v-container fluid grid-list-md>
        <v-layout v-if="errors" row wrap>
          <v-alert
              v-for="(error, key) in errors"
              :key="key"
              :value="true"
              color="error"
            >
            <v-layout row>
              <v-flex xs11>{{ error }}</v-flex>
              <v-flex xs1 @click="undisplayError(key)" style="cursor: pointer"><v-icon size="25">close</v-icon></v-flex>
            </v-layout>
          </v-alert>
        </v-layout>

        <v-layout row wrap v-if="todos !== null">
          <!-- tasks -->
          <Todos/>
        </v-layout>
        <v-layout text-xs-center wrap v-else>
          <v-flex xs12>
            <!-- no tasks -->
            <v-img
              :src="require('./assets/best_friend.png')"
              class="my-3"
              contain
              height="200"
            ></v-img>
            you have nothing to do today so .. play with your best friend ... that's just a picture for express what i mean .. don't try to play here go outside
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
  <v-app v-else dark>
    <!-- user -->
    <User/>
  </v-app> 
</template>

<script>
import Todos from './components/Todos'
import User from './components/User'
import Vuex from 'vuex'

export default {
  name: 'App',
  components: {
    Todos,
    User
  },
  computed: {
    ...Vuex.mapGetters({
      user: 'user',
      todos: 'todos',
      errors: 'errors'
    }),
  },
  methods: {
    editUser() {
      this.$store.dispatch("editSelectedUser")
    },
    undisplayError(errorKey) {
      this.$store.dispatch('eraseError', errorKey)
    }
  },
  mounted() {
    this.$store.dispatch('getTodos')
    this.$store.dispatch('getStoredUser')
  }
}
</script>
