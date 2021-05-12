<template>
  <div>
    <v-container fluid>
      <v-btn
          large
          class="create"
          :loading="loading"
          @click="create">{{ $t('Create course') }}
      </v-btn>

    <CourseCard @editCourse="editCourse" @deleteCourse="deleteCourse" :course="item" v-for="item in courses" :key="item.id">

    </CourseCard>

      <DeleteDialog v-model="dialogDelete" @deleteAction="deleteCourseConfirm"></DeleteDialog>
    </v-container>

    <v-dialog
        v-model="dialog"
        width="600"
    >
      <v-card>
        <v-card-title>
          {{ $t('New course') }}
        </v-card-title>

        <v-card-text>
          <div class="input">
            <v-text-field
                :label="$t('Title')"
                outlined
                v-model="editingCourse.title"
            ></v-text-field>
          </div>

          <div class="input">
            <v-text-field
                :label="$t('Subtitle')"
                outlined
                v-model="editingCourse.subtitle"
            ></v-text-field>
          </div>

          <div class="input">
            <v-text-field
                :label="$t('Audience')"
                outlined
                v-model="editingCourse.alumni"
            ></v-text-field>
          </div>


        <v-divider></v-divider>

        <v-layout row wrap>
          <v-flex xs8>
            <v-file-input
                v-model="files"
                placeholder="Upload your documents"
                label="File input"
                multiple
                prepend-icon="mdi-paperclip"
            />
          </v-flex>
          <v-flex xs4>
            <v-btn
                v-if="files && files.length>0"
                large
                @click="upload">{{ $t('Upload') }}
            </v-btn>
          </v-flex>
        </v-layout>
        <v-img
            v-if="editingCourse.imageUrl"
            lazy-src="https://picsum.photos/id/11/10/6"
            max-height="150"
            :src="editingCourse.imageUrl"
        ></v-img>

        </v-card-text>


        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="primary"
              text
              @click="dialog = false"
          >
            {{ $t('Cancel') }}
          </v-btn>
          <v-btn
              color="primary"
              text
              @click="save"
          >
            {{ $t('Save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>

</template>

<script lang="ts">
/* eslint-disable */
import {Component, Vue} from 'vue-property-decorator';
import CourseCard from "@/components/CourseCard.vue";
import {Course} from "@/models/Course";
import {v4 as uuidv4} from "uuid";
import {saveCourse, deleteCourse} from "@/services/dbService";
import {uploadFile} from "@/services/filesService";
import DeleteDialog from "@/components/DeleteDialog.vue";

@Component({
  components: {CourseCard, DeleteDialog},
})
export default class CoursesMenu extends Vue {
  public dialog = false
  public loading = true
  public editingCourse: Course = {} as Course
  private imageUrl: string = ""
  private dialogDelete = false

  private files: File[] = []

  get courses() {
    return this.$store.state.availableCoursesForUser
  }

  async create() {
    this.editingCourse = {id:uuidv4()} as Course
    this.dialog = true
  }
  async save() {
    this.dialog = false
    await saveCourse(this.editingCourse)
    await this.$store.dispatch('setAvailableCoursesForUser')

  }
  editCourse(course:Course){
    this.editingCourse=course
    this.dialog = true
  }
  deleteCourse(course:Course){
    this.editingCourse=course
    this.dialogDelete = true
  }
  async deleteCourseConfirm(){
    this.loading = true
    await deleteCourse(this.editingCourse)
    console.log("---", this.editingCourse)
    await this.$store.dispatch('setAvailableCoursesForUser')
    this.loading = false
  }

  async created() {
    await this.$store.dispatch('setAvailableCoursesForUser')
    this.loading = false
  }

  async upload(){
    const image = await uploadFile(this.files[0])
    this.imageUrl = image
    this.editingCourse.imageUrl = image
    this.$forceUpdate()
  }

}
</script>
<style>
.create{
  margin-left: 10px;
}
</style>