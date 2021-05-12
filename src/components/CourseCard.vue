<template>
  <v-card
      class="mx-auto card"
      max-width="344"
  >
    <v-img
        v-if="course.imageUrl"
        :src="course.imageUrl"
    ></v-img>
    <v-card-text>
      <div>{{$t('Course')}}</div>
      <p class="display-1 text--primary">
        {{ course.title }}
      </p>
      <p>{{ course.subtitle }}</p>
      <div class="text--primary">
        {{ course.description }}
      </div>
    </v-card-text>
    <v-card-actions>
      <v-btn
          text
          color="teal accent-4"
          v-on:click="select(course)"
      >
        {{$t('View lessons')}}
      </v-btn>
      <v-btn
          text
          color="teal accent-4"
          v-on:click="edit(course)"
      >
        {{$t('Edit')}}
      </v-btn>
      <v-btn
          text
          color="teal accent-4"
          v-on:click="deleteCourse(course)"
      >
        {{$t('Delete')}}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import {Quiz} from "../models/Quiz";
import {Course} from "@/models/Course";

@Component({
  components: {},
})
export default class QuizCard extends Vue {
  @Prop({required: false})
  public course: Course | undefined

  public select = (course: Course) => {
    this.$store.dispatch('setSelectedCourseAction', course)
    console.log(course)
    this.$router.push({ name: 'LessonConsole', params: { courseId:course.id } })

  }
  public edit = (course: Course) => {
    this.$emit("editCourse", course)
  }
  public deleteCourse = (course: Course) => {
    this.$emit("deleteCourse", course)
  }

}
</script>
<style>
.card {
  margin:10px
}
</style>