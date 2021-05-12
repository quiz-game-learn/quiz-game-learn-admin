<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header">Register</div>
          <div class="card-body">
            <div v-if="error" class="alert alert-danger">{{error}}</div>
            <form action="#" @submit.prevent="submit">
              <div class="form-group row">
                <div class="col-md-6">
                  <v-text-field
                      label="name"
                      id="name"
                      type="name"
                      required
                      autofocus
                      v-model="form.name"
                  ></v-text-field>
                </div>
              </div>

              <div class="form-group row">
                <div class="col-md-6">
                  <v-text-field
                      label="email"
                      id="email"
                      type="email"
                      required
                      autofocus
                      v-model="form.email"
                  ></v-text-field>
                </div>
              </div>

              <div class="form-group row">
                <div class="col-md-6">
                  <v-text-field
                      label="password"
                      id="password"
                      type="password"
                      required
                      autofocus
                      v-model="form.password"
                  ></v-text-field>
                </div>
              </div>

              <div class="form-group row mb-0">
                <div class="col-md-8 offset-md-4">
                  <button type="submit" class="btn btn-primary">Register</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>



<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {auth} from "@/firebase";

@Component({
})
export default class Register extends Vue {
  public form: any ={
    name: "",
    email: "",
    password: ""
  }

  public error: any | null = null

  public submit() {
    auth.createUserWithEmailAndPassword(this.form.email, this.form.password)
        .then(data => {
          (data.user as any)
              .updateProfile({
                displayName: this.form.name
              })
        })
        .catch(err => {
          this.error = err.message;
        });
  }
}
</script>
