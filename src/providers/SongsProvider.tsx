import { createContext, useContext, useEffect, useState } from 'react';
import { storage } from "@/lib/firebase";
import { AuthContext } from './FirebaseAuthProvider';
import { ref, listAll, getDownloadURL, getBlob } from "firebase/storage"

export interface Song {
  name: string
  url: string
  blob: Blob
}

export const SongsContext = createContext<{ songs: Song[] }>({
  songs: [],
});

export const SongsProvider = ({ children }) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user) {
      return
    }
    const fetchSongs = async () => {
      const storageRef = ref(storage, `users/${user.uid}`);
      const files = await listAll(storageRef);
      const songs = await Promise.all(files.items.map(async (file) => {
        return {
          name: file.name,
          url: await getDownloadURL(file),
          blob: await getBlob(file)
        }
      }))
      console.log(songs)
      setSongs(songs);
    };

    fetchSongs();
  }, [user]);

  return (
    <SongsContext.Provider value={{ songs }}>
      {children}
    </SongsContext.Provider>
  );
};
