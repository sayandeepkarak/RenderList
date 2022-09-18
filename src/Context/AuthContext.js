import React, { useContext, useState } from "react";
import { createContext } from "react";
import {
  GoogleAuthProvider,
  // FacebookAuthProvider,
  signOut,
  signInWithPopup,
} from "firebase/auth";
import { auth, db } from "../Firebase";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchUserPlaylists } from "../App/UserPlaylists";

const authContext = createContext();

export const AuthContext = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentuser, setcurrentuser] = useState(null);
  const [load, setload] = useState(false);
  const googleprovider = new GoogleAuthProvider();
  // const facebookprovider = new FacebookAuthProvider();

  const handlegoogleprovider = (provider, func) => {
    let data;
    signInWithPopup(auth, provider)
      .then((res) => {
        data = res;
      })
      .then(() => {
        func(data);
      })
      .catch((exp) => {
        console.error(exp);
      });
  };

  const createUser = async (responsedata) => {
    try {
      const getold = await getDocs(collection(db, "AllAccounts"));
      const oldadata = getold.docs.map((doc) => ({
        ...doc.data(),
        Id: doc.id,
      }));
      const found = oldadata.some((e) => e.email === responsedata.user.email);
      if (!found) {
        addDoc(collection(db, "AllAccounts"), {
          name: responsedata.user.displayName,
          email: responsedata.user.email,
          photoUrl: responsedata.user.photoURL,
        });
        const getcurrent = await getDocs(collection(db, "AllAccounts"));
        const currentdata = getcurrent.docs
          .map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }))
          .filter((data) => data.email === responsedata.user.email);
        await addDoc(
          collection(db, `AllAccounts/${currentdata[0].id}`, "Playlists"),
          {
            UserName: responsedata.user.displayName,
            Views: 0,
            Title: "Demo Playlist | RenderList",
            Thumbnail: "https://i.ytimg.com/vi/jCY6DH8F4oc/maxresdefault.jpg",
            Hide: false,
            Items: [
              {
                url: "https://youtu.be/o3KXwe-7A-Is",
                id: "o3KXwe-7A-Is",
                thumbnail:
                  "https://i.ytimg.com/vi/o3KXwe-7A-I/maxresdefault.jpg",
                channelTitle: "ATLAST",
                videoTitle:
                  "Deep Chills - Run Free (feat. IVIE) (Official Audio) TikTok #shoechange",
                publishedAt: "2017-08-18T13:31:53Z",
                view: 50297316,
              },
            ],
          }
        );
        alert("Register Success");
      } else {
        alert("user already exist");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loginuser = async (responsedata) => {
    try {
      const getold = await getDocs(collection(db, "AllAccounts"));
      const oldadata = getold.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      const found = oldadata.some((e) => e.email === responsedata.user.email);
      if (found) {
        const founduser = oldadata.filter(
          (e) => e.email === responsedata.user.email
        )[0];
        setcurrentuser(founduser);
        handleFetchuserData(founduser.id);
        navigate("/home");
      } else {
        alert("User not found");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleFetchuserData = async (userid) => {
    try {
      setload(true);
      const userPlaylist = await getDocs(
        collection(db, `AllAccounts/${userid}`, "Playlists")
      );
      dispatch(fetchUserPlaylists(userPlaylist.docs));
      setload(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handlegooglesignup = () => {
    handlegoogleprovider(googleprovider, createUser);
  };
  const handlefacebooksignup = () => {
    // handlesignup(facebookprovider);
  };

  const handlegooglelogin = () => {
    handlegoogleprovider(googleprovider, loginuser);
  };

  const handleLogout = () => {
    signOut(auth);
    setcurrentuser(null);
  };

  const value = {
    currentuser,
    load,
    handleFetchuserData,
    handleLogout,
    handlegooglesignup,
    handlefacebooksignup,
    handlegooglelogin,
  };
  return <authContext.Provider value={value}>{children}</authContext.Provider>;
};

export const useAuthContext = () => {
  return useContext(authContext);
};
