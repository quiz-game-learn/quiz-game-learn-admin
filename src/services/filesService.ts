import {storage} from "@/firebase";
import { v4 as uuidv4 } from 'uuid';

export const uploadFile = async (file: File): Promise<string> => {
    storage

    const storageRef = storage.ref();

    const id = uuidv4() + "_" + file.name

    const ref = storageRef.child('images/'+id);

    const snapshot = await ref.put(file)
    return snapshot.ref.getDownloadURL()
}