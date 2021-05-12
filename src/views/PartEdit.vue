<template>
  <div>
    <h1 class="title font-weight-light main-title">{{ $t("Edit content part for lesson") }}</h1>
    <h2 v-if="lesson" class="title font-weight-light main-title">{{ lesson.title }}</h2>
    <v-btn
        large
        class="cancel"
        @click="cancel">{{ $t('Cancel') }}
    </v-btn>

    <v-btn
        large
        class="save"
        :loading="!part ||! lesson"
        @click="save">{{ $t('Save') }}
    </v-btn>

    <v-card
        outlined
        shaped
        tile
        class="general"
    >
      <v-card-title>{{ $t('General') }}</v-card-title>

      <div class="input">
        <v-layout row wrap>
          <v-flex xs8>
        <v-text-field
            :label="$t('Part title')"
            outlined
            v-model="title"
        ></v-text-field>


          </v-flex>
          <v-flex xs4>
          <v-text-field
              :label="$t('Part number')"
              outlined
              class="flexInput"
            v-model="partNumberInput"
            type="number"
        />
          </v-flex>
        </v-layout>
      </div>


      <div class="input">
        <v-text-field
            :label="$t('Part subtitle')"
            outlined
            v-model="subtitle"
        ></v-text-field>
      </div>

    </v-card>


    <div>

      <v-card
          elevation="2"
          outlined
          shaped
          tile
          class="general"
      >
        <v-card-title>{{ $t('Content') }}</v-card-title>
        <div class="input">
          <vue-editor id="editor2" useCustomImageHandler @image-added="handleImageAdded" v-model="content"/>

        </div>

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
              max-width="250"
              :src="imageUrl"
          ></v-img>
        </v-card-text>
      </v-card>

    </div>


  </div>

</template>

<script lang="ts">
/* eslint-disable */
import {Component, Vue, Watch} from 'vue-property-decorator';
import {getLesson, getPart, getQuiz, saveLesson, savePart, saveQuiz} from "@/services/dbService";
import {Question, Quiz, QuizType} from "@/models/Quiz";
import {Lesson, Part} from "@/models/Lessons";
import {v4 as uuidv4} from "uuid";
import QuestionEdit from "@/components/QuestionEdit.vue";
import {VueEditor} from "vue2-editor";
import {uploadFile} from "@/services/filesService";

@Component({extends: VueEditor})
export default class PartEdit extends Vue {

  private part: Part
  private id: string
  private action: string | null
  private lessonId: string | null
  private lesson: Lesson
  private title: string = this.$i18n.tc('Part Title')
  private subtitle: string = this.$i18n.tc('Part subtitle')
  private partNumber: number = 0
  private partNumberInput: number = 1
  private files: File[] = []
  private imageUrl: string = ""

  private content: string = this.$i18n.tc('Content')

  async created() {
    this.id = this.$route.params.id
    this.lessonId = this.$route.params.lessonId
    this.action = this.$route.params.action
    this.partNumber = parseInt(this.$route.params.partNumber)
    this.partNumberInput = this.partNumber +1
    if (this.id && this.id !== "None") {
      try {
        this.part = await getPart(this.id) as Part
      } catch (e) {
        console.log(e)
      }
    } else {
      this.id = uuidv4()
    }

    if (this.lessonId) {
      try {
        this.lesson = await getLesson(this.lessonId) as Lesson
      } catch (e) {
        console.log(e)
      }
    }
    console.log(this.lesson)

    this.initPart()
    this.$forceUpdate();


  }

  public initPart() {
    if (!this.part) {
      this.part = {} as Part
      this.part.id = this.id || uuidv4()
      this.part.partNumber = this.partNumber
      this.part.lessonId = this.lessonId || "None"
    }

    if (this.part.partNumber) {
      this.partNumber = this.part.partNumber
      this.partNumberInput = this.partNumber +1
    }
    if (this.part.title) {
      this.title = this.part.title
    }
    if (this.part.subtitle) {
      this.subtitle = this.part.subtitle
    }
    if (this.part.content) {
      this.content = this.part.content
    }
    if (this.part.headImageUrl) {
      this.imageUrl = this.part.headImageUrl
    }
    this.$forceUpdate();
  }

  updatePartObject() {
    this.part = {
      id: this.id,
      title: this.title,
      content: this.content,
      partNumber: this.partNumberInput -1,
      lessonId: this.lessonId,
      subtitle: this.subtitle,
    } as Part
    if (this.imageUrl) this.part.headImageUrl = this.imageUrl
    console.log(this.part)
  }

  async handleImageAdded(file: File, Editor: any, cursorLocation: any) {
    const snapshot = await uploadFile(file)
    const url = snapshot
    Editor.insertEmbed(cursorLocation, 'image', url);
  }

  async upload(){
    const image = await uploadFile(this.files[0])
    this.imageUrl = image
    this.$forceUpdate()
  }

  async save() {
    this.updatePartObject()
    this.updatePartsArray()
    await savePart(this.part as Part)
    await saveLesson(this.lesson as Lesson)
    this.$router.push({name: 'LessonEdit', params: {action:"edit", courseId: (this.lesson as Lesson).courseId, id: this.lessonId as string}})

  }

  updatePartsArray() {
    if (!this.lesson.parts) this.lesson.parts = []
    if (this.action === "edit") {
      this.lesson.parts = this.lesson.parts.filter((part)=>part.id !== this.part.id)
    }
    this.lesson.parts.push(this.part as Part)
    console.log(this.lesson)
    console.log(this.lesson.parts)

  }

  async cancel() {
    this.$router.push({name: 'LessonEdit', params: {action:"edit", courseId: (this.lesson as Lesson).courseId, id: this.lessonId as string}})
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
  padding: 20px;
}

.flexInput {
  padding: 5px;
}

.save {
  margin-left: 20px;
}

.cancel {
  margin-left: 20px;
}

.question-content{
  margin:10px
}

</style>
