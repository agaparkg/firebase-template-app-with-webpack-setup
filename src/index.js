import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  getDoc,
  updateDoc
} from 'firebase/firestore';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyCF5cyvp61Y75f7SsStnIWFjFWPv6GQJZM',
  authDomain: 'f9-dojo.firebaseapp.com',
  projectId: 'f9-dojo',
  storageBucket: 'f9-dojo.appspot.com',
  messagingSenderId: '620589429633',
  appId: '1:620589429633:web:a48eb5d80a012fbbeeee80'
};

// initialize firebase app
initializeApp(firebaseConfig);

// initialize services
const db = getFirestore();
const auth = getAuth();

// collection ref - reference to all documents in the database
const collectionRef = collection(db, 'books');

// collection ref - query to the specific document in the database
// https://cloud.google.com/firestore/docs/query-data/get-data
// const queryRef = query(collectionRef, orderBy('createdAt'));

// get realtime collection data - subscribing to the data change using onSnapshot fn
const unsubscribeCollection1 = onSnapshot(
  collectionRef,
  (snapshot) => {
    let books = [];
    snapshot.docs.forEach((doc) => {
      books.push({ ...doc.data(), id: doc.id });
    });
    // console.log(books);
  },
  (error) => {
    console.log(error);
  }
);

// adding new documents
const addNewBookForm = document.querySelector('.add');
addNewBookForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = addNewBookForm.title.value;
  const author = addNewBookForm.author.value;
  const createdAt = serverTimestamp();
  addDoc(collectionRef, {
    title,
    author,
    createdAt
  }).then(() => {
    addNewBookForm.reset();
    console.log('successfully added new book');
  });
});

// deleting documents
const deleteBookForm = document.querySelector('.delete');
deleteBookForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const docId = deleteBookForm.docId.value;
  deleteDocFn(docId);
});

// updating documents
const updateBookForm = document.querySelector('.update');
updateBookForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const docId = updateBookForm.docId.value;
  const docRef = doc(db, 'books', docId);

  updateDoc(docRef, {
    title: 'Updated Title'
  }).then(() => {
    updateBookForm.reset();
  });
});

// signing up new user
const signupUserForm = document.querySelector('.signup');
signupUserForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = signupUserForm.email.value;
  const password = signupUserForm.password.value;
  createUserWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      console.log('user created:', cred.user);
      signupUserForm.reset();
    })
    .catch((err) => {
      console.log(err);
    });
});

// login and logout user
const loginForm = document.querySelector('.login');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = loginForm.email.value;
  const password = loginForm.password.value;

  signInWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      // console.log('user successfully logged in!', cred.user);
    })
    .catch((err) => console.log(err));
});

const logoutBtn = document.querySelector('.logout');
logoutBtn.addEventListener('click', () => {
  signOut(auth)
    .then(() => {
      // console.log('user has been logged out!');
    })
    .catch((err) => {
      console.log(err);
    });
});

// subscribe to user's login and logout state
const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
  console.log('user status changed: ', user);
});

// unsubscribe from all subscriptions to the DB
const unsubscribeBtn = document.querySelector('.unsubscribe');
unsubscribeBtn.addEventListener('click', () => {
  console.log('unsubscribing');
  unsubscribeAuth();
  unsubscribeCollection1();
  unsubscribeCollection2();
  unsubscribeSingleDoc();
});

// displaying documents in the UI
const dataDiv = document.querySelector('.data-display');
const docList = document.createElement('ol');

const unsubscribeCollection2 = onSnapshot(collectionRef, (snapshot) => {
  let books = [];
  snapshot.docs.forEach((doc) => {
    books.push({ ...doc.data(), id: doc.id });
  });

  docList.innerHTML = '';

  for (let item of books) {
    let book = document.createElement('li');
    let div1 = document.createElement('div');
    let div2 = document.createElement('div');
    let div3 = document.createElement('div');
    let btn1 = document.createElement('button');
    let btn2 = document.createElement('button');
    div1.innerText = item.id;
    div2.innerText = item.title;
    div3.innerText = item.author;
    btn1.innerText = 'Delete';
    btn2.innerText = 'Get More Info';
    btn1.addEventListener('click', () => {
      deleteDocFn(item.id);
    });
    btn2.addEventListener('click', () => {
      getSingleDocument(item.id);
    });
    book.append(div1, div2, div3, btn1, btn2);
    docList.appendChild(book);
  }
});

dataDiv.appendChild(docList);

function deleteDocFn(docId) {
  const docRef = doc(db, 'books', docId);

  deleteDoc(docRef).then(() => {
    deleteBookForm.reset();
    console.log('successfully deleted the book');
  });
}

// ----------- collection ref - reference to all documents in the database -----------
// const collectionRef = collection(db, 'books');

// ----------- get all collection docs from a DB - one time run only -----------
// getDocs(collectionRef)
//   .then((snapshot) => {
//     let books = [];
//     snapshot.docs.forEach((doc) => {
//       books.push({ ...doc.data(), id: doc.id });
//     });
//   })
//   .catch((err) => console.log(err.message));

// ----------- get a single doc from a DB - one time run only -----------

function getSingleDocument(docId) {
  const singleDocRef = doc(db, 'books', docId);
  getDoc(singleDocRef).then((doc) => {
    // console.log(doc.data(), doc.id);
  });
}

const singleDocRef = doc(db, 'books', 'egNU9QKmo2wyQbTEvS5q');
const unsubscribeSingleDoc = onSnapshot(singleDocRef, (doc) => {
  // console.log(doc.data(), doc.id);
});

// ----------- get realtime collection docs from a DB - one time run only -----------
// onSnapshot(collectionRef, (snapshot) => {
//   let books = [];
//   snapshot.docs.forEach((doc) => {
//     books.push({ ...doc.data(), id: doc.id });
//   });
//   console.log(books);
// });

// ----------- collection ref - query to the specific document in the database -----------
// const queryRef = query(
//   collectionRef,
//   where('author', '==', 'Robert Niro'),
//   orderBy('title', 'desc')
// );
// and then call getDocs fn OR onSnapshot fn
// getDocs(queryRef)
//   .then((snapshot) => {
//     let books = [];
//     snapshot.docs.forEach((doc) => {
//       books.push({ ...doc.data(), id: doc.id });
//     });
//   })
//   .catch((err) => console.log(err.message));
// --------------------OR--------------------
// onSnapshot(collectionRef, (snapshot) => {
//   let books = [];
//   snapshot.docs.forEach((doc) => {
//     books.push({ ...doc.data(), id: doc.id });
//   });
//   console.log(books);
// });
// ----------- adding a new document to the database -----------
// addDoc(collectionRef, {
//   title,
//   author,
//   createdAt
// }).then(() => {
//   addNewBookForm.reset();
//   console.log('successfully added new book');
// });
// ----------- deleting a document from the database -----------
// const deleteBookForm = document.querySelector('.delete');
// deleteBookForm.addEventListener('submit', (e) => {
//   e.preventDefault();
//   const docId = deleteBookForm.docId.value;
//   const docRef = doc(db, 'books', docId);
//   deleteDoc(docRef).then(() => {
//     deleteBookForm.reset();
//     console.log('successfully deleted the book');
//   });
// });
