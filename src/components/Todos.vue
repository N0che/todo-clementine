<template>
  <div>
    <v-btn color="primary" @click="addTodo()">Add a task</v-btn>
    <v-layout v-for="section in sections" :key="section.value" row wrap>
      <v-flex class="display-3" xs12>
        {{ section.label }}
        <hr>
      </v-flex>
      <v-flex
        v-for="todo in tasks[section.value]"
        :key="todo.id"
        xs12
        sm6
        md4
        lg3
        xl2
      >
        <v-card light class="todo-card">
          <v-layout row wrap>
            <v-flex xs4>
              <span class="display-2">
                {{ todo.id }}
              </span>
              <hr>
            </v-flex>
            <v-flex xs8>
              <v-layout row wrap class="text-xs-right">
                <v-flex xs6>
                  <v-select @change="selectTag(todo)" v-model="todo.tag" :items="tags" item-text="label" item-value="value"></v-select>
                </v-flex>
                <v-flex xs4>
                  <v-btn color="primary" @click="taskDone(todo)" :disabled="user.id == todo.userId && !todo.completed ? false : true">done</v-btn>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
          <v-layout row wrap @click="editTodo(todo)">
            <v-flex xs12>
              <v-layout row wrap>
                <v-flex xs12>
                  {{ todo.title }}
                </v-flex>
                <v-flex xs12 class="text-xs-right">
                  <v-icon size="15">edit</v-icon>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
    <!-- add edit modal -->
    <v-dialog v-model="addEdit" persistent max-width="290" light>
      <v-card>
        <v-card-title>
          <span class="headline">Task form</span>
        </v-card-title>
        <v-card-text>
          <v-textarea label="Title" v-model="selectedTodo.title" required></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn v-if="selectedTodo.id" color="red darken-1" flat @click="deleteTodo(selectedTodo)">Delete</v-btn>
          <v-btn color="blue darken-1" flat @click="addEdit = false">Close</v-btn>
            <v-btn color="blue darken-1" flat @click="saveTodo(selectedTodo)">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- done modal -->
    <v-dialog v-model="done" persistent max-width="290" light>
      <v-card>
        <v-card-text>
          <v-img
            :src="require('../assets/cake.png')"
            contain
          ></v-img>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary darken-1" flat @click="done = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import Vuex from 'vuex'

  export default {
    data: () => ({
      sections: [
        { "label": "Important", "value": "important" },
        { "label": "Later", "value": "later" },
        { "label": "Done", "value": "done" }
      ],
      tags: [
        { "label": "Important", "value": "important" },
        { "label": "Later", "value": "later" }
      ],
      ownedTasks: null,
      done: false,
      addEdit: false
    }),
    computed: {
      ...Vuex.mapGetters({
        todos: 'todos',
        user: 'user',
        selectedTodo : 'selectedTodo'
      }),

      laterTask: function() {
        return this.ownedTasks.filter(function(todo) {
          return todo.tag == 'later' && !todo.completed
        })
      },

      importantTask: function() {
        return this.ownedTasks.filter(function(todo) {
          return todo.tag == 'important' && !todo.completed
        })
      },

      doneTask: function() {
        return this.ownedTasks.filter(function(todo) {
          return todo.completed
        })
      },

      tasks: function() {
        return { "important": this.importantTask, "later": this.laterTask, "done": this.doneTask  }
      }
    },
    methods: {
      selectTag: function(todo) {
        this.$store.dispatch('updateTodo', todo)
      },
      taskDone: function(todo) {
        this.done = true
        todo.completed = true
        this.$store.dispatch('updateTodo', todo)
      },
      addTodo: function() {
        this.$store.dispatch('resetSelectedTodo')
        this.addEdit = true
      },
      editTodo: function(todo) {
        this.$store.dispatch('getSelectedTodo', todo.id)
        this.addEdit = true
      },
      saveTodo: function (todo) {
        if (todo.id == 0) {
          this.$store.dispatch('createTodo', todo)
        } else {
          this.$store.dispatch('updateTodo', todo)
        }
        
        this.addEdit = false
      },
      deleteTodo: function (todo) {
        this.$store.dispatch('deleteTodo', todo)

        this.addEdit = false
      }
    },
    created: function() {
      const el = this
      this.ownedTasks = this.todos.filter(function(todo) {
          return todo.userId == el.user.id
        })
    }
  }
</script>

<style>
.todo-card {
  padding: 5px
}
</style>
