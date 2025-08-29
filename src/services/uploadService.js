// src/services/uploadService.js
import { getToken, getUserId } from './storage';

// Format date as dd-MM-yyyy
const formatDate = (date) => {
    const d = date.getDate().toString().padStart(2, '0');
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const y = date.getFullYear();
    return `${d}-${m}-${y}`;
};

export const uploadDocument = async ({ documentDate, majorHead, minorHead, selectedTags, remarks, file }) => {
    try {
        const token = await getToken();
        const userId = await getUserId();

        if (!token) throw new Error('No token found in storage');

        const formData = new FormData();

        formData.append('file', {
            uri: file.uri,
            type: file.type || 'application/octet-stream',
            name: file.fileName || 'upload',
        });

        const dataPayload = {
            major_head: majorHead,
            minor_head: minorHead,
            document_date: formatDate(documentDate),
            document_remarks: remarks,
            tags: selectedTags.map(tag => ({ tag_name: tag })),
            user_id: userId || 'fallback_user',
        };

        formData.append('data', JSON.stringify(dataPayload));

        const response = await fetch(
            'https://apis.allsoft.co/api/documentManagement/saveDocumentEntry',
            {
                method: 'POST',
                headers: { token },
                body: formData,
            }
        );

        if (!response.ok) throw new Error(`Upload failed: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Upload error:', error);
        throw error;
    }
};
