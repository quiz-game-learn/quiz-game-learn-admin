import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import store from "./store"

// firebase init - add your own config here
const firebaseConfig = {
    apiKey: "AIzaSyB6552oZVo2vQIvdP-N4daKxEWUexUePfE",
    authDomain: "quizz-learn-vue.firebaseapp.com",
    projectId: "quizz-learn-vue",
    storageBucket: "quizz-learn-vue.appspot.com",
    messagingSenderId: "907787151380",
    appId: "1:907787151380:web:4adff18546c12549661f01",
    measurementId: "G-1RCH7308W1"
};
firebase.initializeApp(firebaseConfig)

firebase.auth().onAuthStateChanged(user => {
    console.log("user -> ", user)
    store.dispatch("setUser", user);
});

export const getCurrentUserFirebase = () => {
    return new Promise((resolve, reject) => {
        const unsubscribe = firebase.auth().onAuthStateChanged(user => {
            unsubscribe();
            resolve(user);
        }, reject);
    })
};

// utils
const db = firebase.firestore()
const auth = firebase.auth()
const storage = firebase.storage()

// collection references
const results = db.collection('results')
const quizzesCollection = db.collection('quizzes')
const partsCollection = db.collection('lessonContentParts')
const coursesCollection = db.collection('courses')
const lessonsCollection = db.collection('lessons')

// export utils/refs
export {
    db,
    auth,
    results,
    quizzesCollection,
    coursesCollection,
    lessonsCollection,
    partsCollection,
    storage
}