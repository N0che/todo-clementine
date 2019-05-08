<template>
  <v-app dark v-if="user !== null">
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>Welcome on your todo-list</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-img
        :src="require('./assets/glados.png')"
        contain
        height="54"
      ></v-img>
      <v-spacer></v-spacer>
      <v-toolbar-title class="headline text-uppercase">
        <span>end task for a cake slice</span>
      </v-toolbar-title>
    </v-toolbar>

    <v-content>
      <v-container>
        <v-layout text-xs-center wrap>
          <v-flex xs12 v-if="todos !== null">
            <!-- tasks -->
            <Todos/>
            <Todo/>
          </v-flex>
          <v-flex xs12 v-else>
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
    <!-- no user -->
    <User/>
  </v-app> 
</template>

<script>
import Todos from './components/Todos'
import Todo from './components/Todo'
import User from './components/User'
import Vuex from 'vuex'

export default {
  name: 'App',
  components: {
    Todos,
    Todo,
    User
  },
  computed: {
    ...Vuex.mapGetters({
      user: 'user',
      todos: 'todos'
    })
  },
  mounted() {
    this.$store.dispatch('getTodos')
    this.$store.dispatch('getStoredUser')
  }
}
</script>
