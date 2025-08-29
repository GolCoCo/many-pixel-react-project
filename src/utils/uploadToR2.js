import axios from 'axios';
import { v4 as uuid } from 'uuid';

export async function uploadToR2(file, setProgress) {
    const fileName = `${uuid()}.${file.name.split('.').pop()}`;
    const req = await axios.get(`${import.meta.env.VITE_APP_SERV_API}/signedUrl?key=${fileName}`);

    const url = req.data;

    if (req.data) {
        const response = await axios.put(url, file, {
            headers: {
                'Content-Type': file?.type,
            },
            onUploadProgress: state => {
                const percent = state.progress * 100;
                setProgress(percent);
            },
        });
        if (response.status === 200) {
            return fileName;
        }
    }
    return null;
}
