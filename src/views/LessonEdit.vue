<template>
  <div>
    <h1 class="title font-weight-light main-title">{{ $t("Edit Lesson") }}</h1>
    <v-btn
        large
        class="save"
        :loading="!lesson"
        @click="clickSave">{{ $t('Save') }}
    </v-btn>
    <v-btn
        largedificultyPercent
        class="save"
        :loading="!lesson"
        @click="clickDelete">{{ $t('Delete') }}
    </v-btn>
    <v-card
        elevation="2"
        outlined
        shaped
        tile
        class="general"
    >
      <v-card-title>{{ $t('General') }}</v-card-title>

      <div class="input">
        <v-layout row wrap>
          <v-flex xs7>
            <v-text-field
                :label="$t('Title')"
                outlined
                v-model="title"
            ></v-text-field>
          </v-flex>
          <v-flex xs1>
            <v-text-field
                :label="$t('Index')"
                outlined
                v-model="index"
            ></v-text-field>
          </v-flex>
          <v-flex xs4>
            <v-slider
                class="slider"
                v-model="difficultyPercent"
                :label="$t('Difficulty') + ' ' + difficultyPercent"
                thumb-label="always"
            ></v-slider>
          </v-flex>
        </v-layout>
      </div>

      <div class="input">
        <v-text-field
            :label="$t('Subtitle')"
            outlined
            v-model="subtitle"
        ></v-text-field>
      </div>

      <div class="input">
        <v-text-field
            :label="$t('Description')"
            outlined
            v-model="description"
        ></v-text-field>
      </div>

    </v-card>

    <DeleteDialog v-model="dialogDelete" @deleteAction="deleteLesson"></DeleteDialog>


    <v-card
        elevation="2"
        outlined
        shaped
        tile
        class="general"
    >
      <v-card-title>{{ $t('Parts') }}</v-card-title>
      <v-card-text>
        <div>
          <v-btn
              large
              @click="createPart">{{ $t('Create new lesson part') }}
          </v-btn>
        </div>

        <div v-for="part in parts" :key="part.partNumber">
          <span class="body-2">{{ part.title }}</span>
          <v-btn
              class="quiz-button"
              large
              @click="editPart(part)">{{ $t('EditPart') }}
          </v-btn>
        </div>

      </v-card-text>

    </v-card>

    <v-card
        elevation="2"
        outlined
        shaped
        tile
        class="general"
    >
      <v-card-title>{{ $t('Initial Quiz') }}</v-card-title>

      <v-card-text>
        <div v-if="initialQuiz && initialQuiz.id">
          <span class="body-2">{{ initialQuiz.title }}</span>
          <v-btn
              class="quiz-button"
              large
              @click="editInitialQuiz">{{ $t('Edit') }}
          </v-btn>
        </div>
        <div v-else>
          <v-btn
              large
              @click="createInitialQuiz">{{ $t('Create initial Quiz') }}
          </v-btn>
        </div>

      </v-card-text>

    </v-card>

    <v-card
        elevation="2"
        outlined
        shaped
        tile
        class="general"
    >
      <v-card-title>{{ $t('Final Quiz') }}</v-card-title>
      <v-card-text>
        <div v-if="finalQuiz && finalQuiz.id">
          <span class="body-2">{{ finalQuiz.title }}</span>
          <v-btn
              class="quiz-button"
              large
              @click="editFinalQuiz">{{ $t('Edit') }}
          </v-btn>
        </div>
        <div v-else>
          <v-btn
              large
              @click="createFinalQuiz">{{ $t('Create final Quiz') }}
          </v-btn>
        </div>

      </v-card-text>
    </v-card>

    <v-card
        elevation="2"
        outlined
        shaped
        tile
        class="general"
    >

      <v-card-title>{{ $t('Head Image') }}</v-card-title>
      <v-card-text>
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
            v-if="imageUrl"
            lazy-src="https://picsum.photos/id/11/10/6"
            max-height="150"
            :src="imageUrl"
        ></v-img>
      </v-card-text>
    </v-card>

  </div>

</template>

<script lang="ts">
/* eslint-disable */
import {Component, Vue, Watch} from 'vue-property-decorator';
import {deleteLesson, getLesson, saveLesson} from "@/services/dbService";
import {Lesson, Part} from "@/models/Lessons";
import {Quiz, QuizType} from "@/models/Quiz";
import {VueEditor} from "vue2-editor";
import {uploadFile} from "@/services/filesService";
import {v4 as uuidv4} from "uuid";
import DeleteDialog from "@/components/DeleteDialog.vue";

@Component({extends: VueEditor, components: {DeleteDialog}})
export default class LessonEdit extends Vue {

  private lesson: Lesson | null = {} as Lesson
  private initialQuiz: Quiz | null = {} as Quiz
  private finalQuiz: Quiz | null = {} as Quiz
  private id: string | null = ""
  private courseId: string | null = ""
  private files: File[] = []
  private difficultyPercent = 50

  private title: string = this.$i18n.tc('Title')
  private index: number = 0
  private subtitle: string = this.$i18n.tc('Subtitle')
  private description: string = this.$i18n.tc('Description')
  private imageUrl: string = ""
  private action: string = "edit"
  private parts: Part[] = []
  private dialogDelete = false

  async created() {
    this.id = this.$route.params.id
    if (this.id == "None" || this.id === "") this.id = uuidv4()
    this.courseId = this.$route.params.courseId
    this.action = this.$route.params.action
    if (this.action === "edit") {
      this.lesson = await getLesson(this.id)
    }
    this.initLesson()
  }

  public initLesson() {
    if (!this.lesson || this.action === "create") this.lesson = {id: uuidv4(), courseId: this.courseId} as Lesson

    if (this.lesson?.description) {
      this.description = this.lesson?.description as string
    }

    if (this.lesson?.difficultyPercent) {
      this.difficultyPercent = this.lesson?.difficultyPercent as number
    }

    if (this.lesson?.index) {
      this.index = this.lesson?.index as number
    }

    if (this.lesson?.title) {
      this.title = this.lesson?.title as string
    }
    if (this.lesson?.courseId) {
      this.courseId = this.lesson?.courseId as string
    }

    if (this.lesson?.subtitle) {
      this.subtitle = this.lesson?.subtitle as string
    }

    if (this.lesson?.parts) {
      this.parts = this.lesson?.parts as Part[]
    }

    if (this.lesson?.initialQuiz) {
      this.initialQuiz = this.lesson?.initialQuiz as Quiz
    } else {
      this.initialQuiz = {} as Quiz
    }

    if (this.lesson?.finalQuiz) {
      this.finalQuiz = this.lesson?.finalQuiz as Quiz
    } else {
      this.finalQuiz = {} as Quiz
    }

    if (this.lesson?.imageUrl) {
      this.imageUrl = this.lesson?.imageUrl as string
    }


    this.$forceUpdate();
  }

  updateLessonObject() {
    this.lesson = {
      id: this.id,
      title: this.title,
      subtitle: this.subtitle,
      description: this.description,
      parts: this.parts,
      initialQuiz: this.initialQuiz,
      finalQuiz: this.finalQuiz,
      imageUrl: this.imageUrl,
      index: this.index,
      difficultyPercent: this.difficultyPercent
    } as Lesson

    if (this.courseId && this.courseId !== "") {
      this.lesson.courseId = this.courseId
    }
  }

  async clickSave(){
    await this.save()
    await this.$router.push({
      name: 'LessonConsole',
      params: {
        courseId: this.courseId as string
      }
    })
  }
  async save() {
    this.updateLessonObject()
    await saveLesson(this.lesson as Lesson)
  }

  async clickDelete() {
    this.dialogDelete = true
  }

  async deleteLesson() {
    this.dialogDelete = false
    await deleteLesson(this.lesson as Lesson)
    await this.$router.push({name: 'LessonConsole', params: {courseId: this.lesson?.courseId || ""}})

  }

  async createInitialQuiz() {
    await this.save()
    await this.$router.push({
      name: 'QuizEdit',
      params: {id: "None", lessonId: this.id || "", quizType: QuizType.INITIAL}
    })
  }

  async editInitialQuiz() {
    await this.save()
    await this.$router.push({
      name: 'QuizEdit',
      params: {id: (this.initialQuiz as any).id, lessonId: this.id || "", quizType: QuizType.INITIAL}
    })
  }

  async createFinalQuiz() {
    await this.save()
    await this.$router.push({name: 'QuizEdit', params: {id: "None", lessonId: this.id || "", quizType: QuizType.FINAL}})
  }

  async editFinalQuiz() {
    await this.save()
    await this.$router.push({
      name: 'QuizEdit',
      params: {id: (this.finalQuiz as any).id, lessonId: this.id || "", quizType: QuizType.FINAL}
    })
  }

  async createPart() {
    await this.save()
    await this.$router.push({
      name: 'PartEdit',
      params: {
        courseId: this.courseId as string,
        id: "None",
        lessonId: this.id || "",
        partNumber: "0",
        action: "create"
      }
    })
  }

  async editPart(part: Part) {
    await this.save()
    await this.$router.push({
      name: 'PartEdit',
      params: {id: part.id, lessonId: this.id || "", partNumber: "" + part.partNumber, action: "edit"}
    })
  }

  async upload() {
    const image = await uploadFile(this.files[0])
    this.imageUrl = image
    this.$forceUpdate()
  }

  @Watch('description')
  onPropertyChanged(value: string, oldValue: string) {
  }

}


</script>

<style>
.main-title {
  margin-top: 20px;
  text-align: center;
}

.general {
  margin: 20px;
}

.input {
  margin: 10px;
}

.slider {
  margin-left: 20px;
  margin-top: 10px;
}

#editor2 {
  height: 350px
}

.save {
  margin-left: 10px;
}

.quiz-button {
  margin-left: 10px;
}


</style>
