// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { FacebookAuthProvider, getAuth, signInWithPopup, getRedirectResult, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, query, setDoc, doc, serverTimestamp,getDoc,updateDoc,deleteDoc, increment,arrayUnion} from "firebase/firestore";
import { getStorage, ref,getDownloadURL,uploadBytes} from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB0H6QDs-haD5YGctH8P_gH0h75W-1TEvk",
  authDomain: "practice-64853.firebaseapp.com",
  projectId: "practice-64853",
  storageBucket: "practice-64853.appspot.com",
  messagingSenderId: "949462170391",
  appId: "1:949462170391:web:5c526a7382026fd64bd552"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)
console.log("app ====>", app)
console.log("auth ====>", auth)
console.log("FireStore ====>", db)



async function loginFacebookHandler() {
  const provider = new FacebookAuthProvider();
  provider.addScope('user_birthday');
  provider.setCustomParameters({
    'display': 'popup'
  });

  try {
    const result1 = await signInWithPopup(auth, provider)
    const user1 = await result1.user
    return user1
  }
  catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = FacebookAuthProvider.credentialFromError(error);
    console.log("ERROR ==>", error)
    console.log("Error code  ==>", errorCode)
    console.log("Error Message  ===== >", error.message)
  }
}

function addUserToFirebase(user) {
  
  const userId = auth.currentUser.uid;
  const { email, displayName, photoURL } = user
  return setDoc(doc(db, "users", userId), { email, displayName, photoURL, userId, myTokens: [] })

}
function checkuserLogin() {
  onAuthStateChanged(auth, (user) => {

    if (user) {
      // setUser(true
      return true
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      const uid = user.uid;
      // ...
    } else {
      // User is signed out
      return false
      // ...
    }
  });
}

async function AddCompany(data) {
  
  const {address,
    close,
    name,
    open,
    since,
    url
   } = data
  const companyDetail = {
    company: name,
    since: since,
    openingTime: open ,
    closingTime: close ,
    address: address,
    url:url,
    userId: auth.currentUser.uid,
    totalTokens : 0,
    each_token_time : 0,
    soldTo: [],
    activeToken: 0,
    totalSoldToken: 0,
    createdAt: serverTimestamp()
  }

  const companyId = `${auth.currentUser.uid}${Date.now()}`
 
   setDoc(doc(db, "Company",companyId), companyDetail)
    alert("Company Registed")
}
function logout() {

  signOut(auth).then(() => {
    // Sign-out successful.
  }).catch((error) => {
    // An error happened.
  });
}


async function getAllCompany() {
  const q = query(collection(db, "Company"));

  const querySnapshot = await getDocs(q);
  let data = []
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots

    data.push({ ...doc.data() })

  });
  return data
}

async function getUserInfo(){
  const userId = auth.currentUser.uid
  const docRef = doc(db, "users",userId);
const docSnap = await getDoc(docRef);

return docSnap.data()
}

// upload Compnay Images Firebase Storage
async function uploadImage(image) {

  //call the function to import the line No #5
  const storageRef = ref(storage, `ComapnyImage/${image.name}`);
  // 'file' comes from the Blob orNo #5
  const snapshot = await uploadBytes(storageRef, image);
  const url = await getDownloadURL(snapshot.ref);
  return url;
}

function setTokensToDb(data){
 
  const {istoken,IsEachTime,isCompanyId} = data
  const Token = {
    totalTokens : istoken,
    each_token_time : IsEachTime,
    activeToken: 0,
    totalSoldToken: 0,
    soldTo: []
  }
  ;
  return updateDoc(doc(db, "Company",isCompanyId),Token)

}
//delete button function
function deleteCompanyToDb(companyId){
  return deleteDoc(doc(db, "Company", companyId));
}
//company Component DisAllow button call the function
function disallowToken(isCompanyId){
  // const {istoken,IsEachTime,isCompanyId} = data
  const Token = {
    totalTokens : 0,
    each_token_time : 0,
    activeToken: 0,
    totalSoldToken: 0,
    soldTo: []
  }
  ;
  return updateDoc(doc(db, "Company",isCompanyId),Token)

}


//update sold Array function to call the user Component
async function buyToken(data){
const {companyId,totalTokens ,totalSold,company}=data
debugger
  const washingtonRef = doc(db, "Company", companyId);
const obj = {userId: auth.currentUser.uid,name: auth.currentUser.displayName,tokenNumber: totalSold+1}
  // Atomically add a new region to the "regions" array field.
  await updateDoc(washingtonRef, {totalSoldToken:increment(1) ,soldTo: arrayUnion(obj)});
  const userToken = doc(db, "users",auth.currentUser.uid)
  // ArrayUnion firebase ka Array ko set kar na ka function ha import firebase sa hu wa ha 
  updateDoc(userToken,{myTokens: 
    arrayUnion({companyName: company ,tokenNumber: totalSold+1,companyId:companyId })})
  
}


async function patientImage(image) {
  //call the function to import the line No #5
  const storageRef = ref(storage, `patientImage/${image.name}`);
  // 'file' comes from the Blob or File API
  //call the function to import the line No #5
  const snapshot = await uploadBytes(storageRef, image);
  const url = await getDownloadURL(snapshot.ref);
  return url;
}
export { loginFacebookHandler, checkuserLogin, AddCompany, logout, getAllCompany,
   addUserToFirebase ,db,auth, getUserInfo,uploadImage,setTokensToDb,deleteCompanyToDb,
   disallowToken,buyToken,patientImage}
