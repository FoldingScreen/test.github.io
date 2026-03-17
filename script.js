import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBu2RrQn8cAwwWaLtw5O8Omwn4-NzHWuc0",
  authDomain: "kor-app-fa47e.firebaseapp.com",
  projectId: "kor-app-fa47e",
  storageBucket: "kor-app-fa47e.firebasestorage.app",
  messagingSenderId: "397749083935",
  appId: "1:397749083935:web:51c7c2b066428ad4099a2a"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const emailEl = document.getElementById("email");
const passwordEl = document.getElementById("password");
const nicknameEl = document.getElementById("nickname");
const signupBtn = document.getElementById("signupBtn");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const statusEl = document.getElementById("status");

function setStatus(text) {
  statusEl.textContent = text;
}

signupBtn.addEventListener("click", async () => {
  const email = emailEl.value.trim();
  const password = passwordEl.value.trim();
  const nickname = nicknameEl.value.trim();

  if (!email || !password || !nickname) {
    setStatus("이메일, 비밀번호, 닉네임을 모두 입력하세요.");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      email,
      nickname,
      role: "user",
      approved: false,
      createdAt: serverTimestamp()
    });

    setStatus("회원가입 완료. 로그인 상태입니다.");
  } catch (error) {
    console.error(error);
    setStatus("회원가입 실패: " + error.message);
  }
});

loginBtn.addEventListener("click", async () => {
  const email = emailEl.value.trim();
  const password = passwordEl.value.trim();

  if (!email || !password) {
    setStatus("이메일과 비밀번호를 입력하세요.");
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    setStatus("로그인 성공");
  } catch (error) {
    console.error(error);
    setStatus("로그인 실패: " + error.message);
  }
});

logoutBtn.addEventListener("click", async () => {
  try {
    await signOut(auth);
    setStatus("로그아웃 완료");
  } catch (error) {
    console.error(error);
    setStatus("로그아웃 실패: " + error.message);
  }
});

onAuthStateChanged(auth, async (user) => {
  if (user) {
    logoutBtn.style.display = "inline-block";

    try {
      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);

      if (snap.exists()) {
        const userData = snap.data();
        setStatus(`로그인 중: ${userData.nickname} (${user.email})`);
      } else {
        setStatus(`로그인 중: ${user.email}`);
      }
    } catch (error) {
      console.error(error);
      setStatus(`로그인 중: ${user.email}`);
    }
  } else {
    logoutBtn.style.display = "none";
    setStatus("로그아웃 상태");
  }
});
