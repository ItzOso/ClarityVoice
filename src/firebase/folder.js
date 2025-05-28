import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";

export const fetchUserFolders = async (userId) => {
  // Validate userId to prevent errors if it's null/undefined
  if (!userId) {
    console.log("User ID is missing, cannot fetch folders.");
    return [];
  }

  const q = query(
    collection(db, "folders"),
    where("uid", "==", userId),
    orderBy("createdAt")
  );

  const foldersSnapshot = await getDocs(q);

  const foldersData = foldersSnapshot.docs.map((folderSnapshot) => ({
    ...folderSnapshot.data(),
    id: folderSnapshot.id,
  }));

  return foldersData; // Return the fetched data
};
